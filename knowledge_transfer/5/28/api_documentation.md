# API 문서 📡

## 🔐 인증 API

### 회원가입
**POST** `/api/auth/register/`

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com", 
  "password": "password123"
}
```

**Response (성공 - 201):**
```json
{
  "status": "success",
  "message": "회원가입이 완료되었습니다.",
  "user_id": 1
}
```

**Response (실패 - 400):**
```json
{
  "status": "error",
  "message": "이미 존재하는 아이디입니다."
}
```

### 로그인
**POST** `/api/auth/login/`

**Request Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response (성공 - 200):**
```json
{
  "status": "success",
  "message": "로그인 성공",
  "user_id": 1,
  "username": "testuser"
}
```

**Response (실패 - 401):**
```json
{
  "status": "error",
  "message": "아이디 또는 비밀번호가 잘못되었습니다."
}
```

## 📊 데이터 모델

### User 모델
```python
class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Category 모델
```python
class Category(models.Model):
    TRANSACTION_TYPES = [
        ('income', '수입'),
        ('expense', '지출'),
    ]
    name = models.CharField('카테고리명', max_length=50)
    type = models.CharField('유형', max_length=20, choices=TRANSACTION_TYPES)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    created_at = models.DateTimeField(auto_now_add=True)
```

### AccountBook 모델
```python
class AccountBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='transactions')
    amount = models.DecimalField('금액', max_digits=15, decimal_places=2)
    transaction_type = models.CharField('거래 유형', max_length=20, choices=Category.TRANSACTION_TYPES)
    description = models.TextField('설명', blank=True)
    transaction_date = models.DateField('거래일')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Budget 모델
```python
class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='budgets')
    amount = models.DecimalField('예산액', max_digits=15, decimal_places=2)
    start_date = models.DateField('시작일')
    end_date = models.DateField('종료일')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## 🔄 예정된 API

### 카테고리 관리 (Admin 전용)
- `GET /api/categories/` - 카테고리 목록 조회
- `POST /api/categories/` - 카테고리 생성
- `PUT /api/categories/{id}/` - 카테고리 수정
- `DELETE /api/categories/{id}/` - 카테고리 삭제

### 거래 내역 관리
- `GET /api/transactions/` - 거래 내역 조회
- `POST /api/transactions/` - 거래 등록
- `PUT /api/transactions/{id}/` - 거래 수정
- `DELETE /api/transactions/{id}/` - 거래 삭제

### 예산 관리
- `GET /api/budgets/` - 예산 목록 조회
- `POST /api/budgets/` - 예산 설정
- `PUT /api/budgets/{id}/` - 예산 수정
- `DELETE /api/budgets/{id}/` - 예산 삭제

### 대시보드 통계
- `GET /api/dashboard/stats/` - 대시보드 통계 데이터
- `GET /api/dashboard/monthly/` - 월별 통계
- `GET /api/dashboard/category/` - 카테고리별 통계

## 🛡️ 인증 및 권한

### 세션 기반 인증
- Django의 기본 세션 인증 사용
- 로그인 시 세션 생성
- 로그아웃 시 세션 삭제

### 권한 체크
- Admin: `username === 'admin'`
- User: 로그인된 모든 사용자

### CORS 설정
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True
``` 