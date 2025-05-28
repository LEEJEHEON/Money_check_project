from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import User
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
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return JsonResponse({
                'status': 'success',
                'message': '로그인 성공',
                'user_id': user.id,
                'username': user.username
            })
        else:
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
        return JsonResponse({
            'status': 'error',
            'message': '서버 오류가 발생했습니다.'
        }, status=500) 