from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import User, Category, Transaction
import json

@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        # 필수 필드 검증
        if not username or not email or not password:
            return JsonResponse({
                'status': 'error',
                'message': '모든 필드를 입력해주세요.'
            }, status=400)
        
        # 사용자명 중복 검사
        if User.objects.filter(username=username).exists():
            return JsonResponse({
                'status': 'error',
                'message': '이미 존재하는 아이디입니다.'
            }, status=400)
        
        # 이메일 중복 검사
        if User.objects.filter(email=email).exists():
            return JsonResponse({
                'status': 'error',
                'message': '이미 존재하는 이메일입니다.'
            }, status=400)
        
        # 사용자 생성
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        return JsonResponse({
            'status': 'success',
            'message': '회원가입이 완료되었습니다.',
            'user_id': user.id
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': '잘못된 JSON 형식입니다.'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': '서버 오류가 발생했습니다.'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        print(f"Login attempt - Username: {username}")  # 디버깅
        
        # 사용자 존재 확인
        try:
            user_exists = User.objects.get(username=username)
            print(f"User exists: {user_exists.username}, is_active: {user_exists.is_active}")  # 디버깅
        except User.DoesNotExist:
            print(f"User {username} does not exist")  # 디버깅
            return JsonResponse({
                'status': 'error',
                'message': '존재하지 않는 사용자입니다.'
            }, status=401)
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            print(f"Authentication successful for {username}")  # 디버깅
            login(request, user)
            return JsonResponse({
                'status': 'success',
                'message': '로그인 성공',
                'user_id': user.id,
                'username': user.username,
                'is_admin': user.username == 'admin'
            })
        else:
            print(f"Authentication failed for {username}")  # 디버깅
            return JsonResponse({
                'status': 'error',
                'message': '아이디 또는 비밀번호가 잘못되었습니다.'
            }, status=401)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': '잘못된 JSON 형식입니다.'
        }, status=400)
    except Exception as e:
        print(f"Login error: {e}")  # 디버깅
        return JsonResponse({
            'status': 'error',
            'message': '서버 오류가 발생했습니다.'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def user_list(request):
    try:
        # 디버깅을 위한 로그
        print(f"Request user: {request.user}")
        print(f"Is authenticated: {request.user.is_authenticated}")
        print(f"Session key: {request.session.session_key}")
        
        # 로그인 확인
        if not request.user.is_authenticated:
            return JsonResponse({
                'status': 'error',
                'message': '로그인이 필요합니다.'
            }, status=401)
        
        # Admin 권한 확인 (username이 'admin'인지 체크)
        if request.user.username != 'admin':
            return JsonResponse({
                'status': 'error',
                'message': '관리자 권한이 필요합니다.'
            }, status=403)
        
        # 모든 사용자 목록 가져오기
        users = User.objects.all().order_by('-date_joined')
        user_list = []
        
        for user in users:
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.username == 'admin',
                'is_active': user.is_active,
                'date_joined': user.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
                'last_login': user.last_login.strftime('%Y-%m-%d %H:%M:%S') if user.last_login else '로그인 기록 없음'
            }
            user_list.append(user_data)
        
        return JsonResponse({
            'status': 'success',
            'users': user_list,
            'total_count': len(user_list)
        })
        
    except Exception as e:
        print(f"Error in user_list: {e}")
        return JsonResponse({
            'status': 'error',
            'message': '서버 오류가 발생했습니다.'
        }, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
def user_update(request, user_id):
    try:
        # 로그인 확인
        if not request.user.is_authenticated:
            return JsonResponse({
                'status': 'error',
                'message': '로그인이 필요합니다.'
            }, status=401)
        
        # Admin 권한 확인
        if request.user.username != 'admin':
            return JsonResponse({
                'status': 'error',
                'message': '관리자 권한이 필요합니다.'
            }, status=403)
        
        # 수정할 사용자 찾기
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': '사용자를 찾을 수 없습니다.'
            }, status=404)
        
        # 요청 데이터 파싱
        data = json.loads(request.body)
        
        # 사용자 정보 업데이트
        if 'email' in data:
            # 이메일 중복 검사 (자신 제외)
            if User.objects.filter(email=data['email']).exclude(id=user_id).exists():
                return JsonResponse({
                    'status': 'error',
                    'message': '이미 존재하는 이메일입니다.'
                }, status=400)
            user.email = data['email']
        
        if 'is_active' in data:
            user.is_active = data['is_active']
        
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        
        user.save()
        
        return JsonResponse({
            'status': 'success',
            'message': '사용자 정보가 수정되었습니다.',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.username == 'admin',
                'is_active': user.is_active,
                'date_joined': user.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
                'last_login': user.last_login.strftime('%Y-%m-%d %H:%M:%S') if user.last_login else '로그인 기록 없음'
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': '잘못된 JSON 형식입니다.'
        }, status=400)
    except Exception as e:
        print(f"Error in user_update: {e}")
        return JsonResponse({
            'status': 'error',
            'message': '서버 오류가 발생했습니다.'
        }, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
def user_delete(request, user_id):
    try:
        # 로그인 확인
        if not request.user.is_authenticated:
            return JsonResponse({
                'status': 'error',
                'message': '로그인이 필요합니다.'
            }, status=401)
        
        # Admin 권한 확인
        if request.user.username != 'admin':
            return JsonResponse({
                'status': 'error',
                'message': '관리자 권한이 필요합니다.'
            }, status=403)
        
        # 삭제할 사용자 찾기
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': '사용자를 찾을 수 없습니다.'
            }, status=404)
        
        # 자기 자신(admin) 삭제 방지
        if user.username == 'admin':
            return JsonResponse({
                'status': 'error',
                'message': '관리자 계정은 삭제할 수 없습니다.'
            }, status=400)
        
        username = user.username
        user.delete()
        
        return JsonResponse({
            'status': 'success',
            'message': f'사용자 "{username}"이(가) 삭제되었습니다.'
        })
        
    except Exception as e:
        print(f"Error in user_delete: {e}")
        return JsonResponse({
            'status': 'error',
            'message': '서버 오류가 발생했습니다.'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def category_list(request):
    """카테고리 목록 조회"""
    try:
        # 로그인 확인
        if not request.user.is_authenticated:
            return JsonResponse({
                'status': 'error',
                'message': '로그인이 필요합니다.'
            }, status=401)
        
        # 모든 카테고리 목록 가져오기 (일반 사용자도 조회 가능)
        categories = Category.objects.all().order_by('type', 'name')
        category_list = []
        
        for category in categories:
            category_data = {
                'id': category.id,
                'type': category.type,
                'type_display': category.get_type_display(),
                'name': category.name,
                'remark': category.remark or '',
                'created_by': category.created_by.username,
                'created_at': category.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            category_list.append(category_data)
        
        return JsonResponse({
            'status': 'success',
            'categories': category_list,
            'total_count': len(category_list)
        })
        
    except Exception as e:
        print(f"Error in category_list: {e}")
        return JsonResponse({
            'status': 'error',
            'message': '서버 오류가 발생했습니다.'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def category_create(request):
    """카테고리 생성"""
    try:
        # 로그인 확인
        if not request.user.is_authenticated:
            return JsonResponse({
                'status': 'error',
                'message': '로그인이 필요합니다.'
            }, status=401)
        
        # Admin 권한 확인
        if request.user.username != 'admin':
            return JsonResponse({
                'status': 'error',
                'message': '관리자 권한이 필요합니다.'
            }, status=403)
        
        # 요청 데이터 파싱
        data = json.loads(request.body)
        
        # 필수 필드 검증
        type_value = data.get('type')
        name = data.get('name')
        remark = data.get('remark', '')
        
        if not type_value or not name:
            return JsonResponse({
                'status': 'error',
                'message': '구분과 계정명은 필수 입력 항목입니다.'
            }, status=400)
        
        # 유효한 타입인지 확인
        valid_types = [choice[0] for choice in Category.TYPE_CHOICES]
        if type_value not in valid_types:
            return JsonResponse({
                'status': 'error',
                'message': '유효하지 않은 구분입니다.'
            }, status=400)
        
        # 중복 카테고리 확인
        if Category.objects.filter(type=type_value, name=name).exists():
            return JsonResponse({
                'status': 'error',
                'message': '이미 존재하는 카테고리입니다.'
            }, status=400)
        
        # 카테고리 생성
        category = Category.objects.create(
            type=type_value,
            name=name,
            remark=remark,
            created_by=request.user
        )
        
        return JsonResponse({
            'status': 'success',
            'message': '카테고리가 성공적으로 생성되었습니다.',
            'category': {
                'id': category.id,
                'type': category.type,
                'type_display': category.get_type_display(),
                'name': category.name,
                'remark': category.remark or '',
                'created_by': category.created_by.username,
                'created_at': category.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': '잘못된 JSON 형식입니다.'
        }, status=400)
    except Exception as e:
        print(f"Error in category_create: {e}")
        return JsonResponse({
            'status': 'error',
            'message': '서버 오류가 발생했습니다.'
        }, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
def category_update(request, category_id):
    """카테고리 수정"""
    try:
        # 로그인 확인
        if not request.user.is_authenticated:
            return JsonResponse({
                'status': 'error',
                'message': '로그인이 필요합니다.'
            }, status=401)
        
        # Admin 권한 확인
        if request.user.username != 'admin':
            return JsonResponse({
                'status': 'error',
                'message': '관리자 권한이 필요합니다.'
            }, status=403)
        
        # 수정할 카테고리 찾기
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': '카테고리를 찾을 수 없습니다.'
            }, status=404)
        
        # 요청 데이터 파싱
        data = json.loads(request.body)
        
        # 카테고리 정보 업데이트
        if 'type' in data:
            valid_types = [choice[0] for choice in Category.TYPE_CHOICES]
            if data['type'] not in valid_types:
                return JsonResponse({
                    'status': 'error',
                    'message': '유효하지 않은 구분입니다.'
                }, status=400)
            category.type = data['type']
        
        if 'name' in data:
            # 중복 카테고리 확인 (자신 제외)
            if Category.objects.filter(
                type=category.type, 
                name=data['name']
            ).exclude(id=category_id).exists():
                return JsonResponse({
                    'status': 'error',
                    'message': '이미 존재하는 카테고리입니다.'
                }, status=400)
            category.name = data['name']
        
        if 'remark' in data:
            category.remark = data['remark']
        
        category.save()
        
        return JsonResponse({
            'status': 'success',
            'message': '카테고리가 수정되었습니다.',
            'category': {
                'id': category.id,
                'type': category.type,
                'type_display': category.get_type_display(),
                'name': category.name,
                'remark': category.remark or '',
                'created_by': category.created_by.username,
                'created_at': category.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': '잘못된 JSON 형식입니다.'
        }, status=400)
    except Exception as e:
        print(f"Error in category_update: {e}")
        return JsonResponse({
            'status': 'error',
            'message': '서버 오류가 발생했습니다.'
        }, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
def category_delete(request, category_id):
    """카테고리 삭제"""
    try:
        # 로그인 확인
        if not request.user.is_authenticated:
            return JsonResponse({
                'status': 'error',
                'message': '로그인이 필요합니다.'
            }, status=401)
        
        # Admin 권한 확인
        if request.user.username != 'admin':
            return JsonResponse({
                'status': 'error',
                'message': '관리자 권한이 필요합니다.'
            }, status=403)
        
        # 삭제할 카테고리 찾기
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': '카테고리를 찾을 수 없습니다.'
            }, status=404)
        
        category_name = category.name
        category.delete()
        
        return JsonResponse({
            'status': 'success',
            'message': f'카테고리 "{category_name}"가 삭제되었습니다.'
        })
        
    except Exception as e:
        print(f"Error in category_delete: {e}")
        return JsonResponse({
            'status': 'error',
            'message': '서버 오류가 발생했습니다.'
        }, status=500)

@csrf_exempt
def transaction_list(request):
    """거래 내역 목록 조회"""
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': '로그인이 필요합니다.'})
        
        try:
            transactions = Transaction.objects.filter(user=request.user).order_by('-transaction_date', '-created_at')
            
            transaction_list = []
            for transaction in transactions:
                transaction_list.append({
                    'id': transaction.id,
                    'transaction_type': transaction.transaction_type,
                    'transaction_type_display': transaction.get_transaction_type_display(),
                    'amount': str(transaction.amount),
                    'description': transaction.description,
                    'transaction_date': transaction.transaction_date.strftime('%Y-%m-%d'),
                    'memo': transaction.memo or '',
                    'category': {
                        'id': transaction.category.id,
                        'name': transaction.category.name,
                        'type_display': transaction.category.get_type_display()
                    },
                    'created_at': transaction.created_at.strftime('%Y-%m-%d %H:%M:%S')
                })
            
            return JsonResponse({
                'status': 'success',
                'transactions': transaction_list
            })
            
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    
    return JsonResponse({'status': 'error', 'message': '잘못된 요청입니다.'})

@csrf_exempt
def transaction_create(request):
    """거래 내역 생성"""
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': '로그인이 필요합니다.'})
        
        try:
            data = json.loads(request.body)
            
            # 필수 필드 검증
            required_fields = ['category_id', 'transaction_type', 'amount', 'description', 'transaction_date']
            for field in required_fields:
                if not data.get(field):
                    return JsonResponse({'status': 'error', 'message': f'{field}는 필수 항목입니다.'})
            
            # 카테고리 존재 확인
            try:
                category = Category.objects.get(id=data['category_id'])
            except Category.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': '존재하지 않는 카테고리입니다.'})
            
            # 거래 내역 생성
            transaction = Transaction.objects.create(
                user=request.user,
                category=category,
                transaction_type=data['transaction_type'],
                amount=data['amount'],
                description=data['description'],
                transaction_date=data['transaction_date'],
                memo=data.get('memo', '')
            )
            
            return JsonResponse({
                'status': 'success',
                'message': '거래 내역이 생성되었습니다.',
                'transaction_id': transaction.id
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': '잘못된 JSON 형식입니다.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    
    return JsonResponse({'status': 'error', 'message': '잘못된 요청입니다.'})

@csrf_exempt
def transaction_update(request, transaction_id):
    """거래 내역 수정"""
    if request.method == 'PUT':
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': '로그인이 필요합니다.'})
        
        try:
            # 거래 내역 존재 확인 및 권한 검증
            try:
                transaction = Transaction.objects.get(id=transaction_id, user=request.user)
            except Transaction.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': '존재하지 않는 거래 내역이거나 권한이 없습니다.'})
            
            data = json.loads(request.body)
            
            # 카테고리 존재 확인
            if data.get('category_id'):
                try:
                    category = Category.objects.get(id=data['category_id'])
                    transaction.category = category
                except Category.DoesNotExist:
                    return JsonResponse({'status': 'error', 'message': '존재하지 않는 카테고리입니다.'})
            
            # 필드 업데이트
            if data.get('transaction_type'):
                transaction.transaction_type = data['transaction_type']
            if data.get('amount'):
                transaction.amount = data['amount']
            if data.get('description'):
                transaction.description = data['description']
            if data.get('transaction_date'):
                transaction.transaction_date = data['transaction_date']
            if 'memo' in data:
                transaction.memo = data['memo']
            
            transaction.save()
            
            return JsonResponse({
                'status': 'success',
                'message': '거래 내역이 수정되었습니다.'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': '잘못된 JSON 형식입니다.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    
    return JsonResponse({'status': 'error', 'message': '잘못된 요청입니다.'})

@csrf_exempt
def transaction_delete(request, transaction_id):
    """거래 내역 삭제"""
    if request.method == 'DELETE':
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': '로그인이 필요합니다.'})
        
        try:
            # 거래 내역 존재 확인 및 권한 검증
            try:
                transaction = Transaction.objects.get(id=transaction_id, user=request.user)
            except Transaction.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': '존재하지 않는 거래 내역이거나 권한이 없습니다.'})
            
            transaction.delete()
            
            return JsonResponse({
                'status': 'success',
                'message': '거래 내역이 삭제되었습니다.'
            })
            
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    
    return JsonResponse({'status': 'error', 'message': '잘못된 요청입니다.'})

@csrf_exempt
def transaction_bulk_delete(request):
    """거래 내역 일괄 삭제"""
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': '로그인이 필요합니다.'})
        
        try:
            data = json.loads(request.body)
            transaction_ids = data.get('transaction_ids', [])
            
            if not transaction_ids:
                return JsonResponse({'status': 'error', 'message': '삭제할 거래 내역을 선택해주세요.'})
            
            # 사용자의 거래 내역만 삭제
            deleted_count = Transaction.objects.filter(
                id__in=transaction_ids,
                user=request.user
            ).delete()[0]
            
            return JsonResponse({
                'status': 'success',
                'message': f'{deleted_count}개의 거래 내역이 삭제되었습니다.',
                'deleted_count': deleted_count
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': '잘못된 JSON 형식입니다.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    
    return JsonResponse({'status': 'error', 'message': '잘못된 요청입니다.'}) 