# 코드 스타일 가이드 📝

## 1. TypeScript/React 스타일 가이드

### 파일 구조
```typescript
// 1. 임포트
import React from 'react';
import styled from '@emotion/styled';

// 2. 타입/인터페이스 정의
interface Props {
  // ...
}

// 3. 스타일 컴포넌트
const StyledComponent = styled.div`
  // ...
`;

// 4. 컴포넌트 정의
const Component: React.FC<Props> = () => {
  // ...
};

// 5. 내보내기
export default Component;
```

### 네이밍 컨벤션
- 컴포넌트: PascalCase (예: `LoginForm`)
- 함수/변수: camelCase (예: `handleSubmit`)
- 인터페이스: PascalCase + 설명적 (예: `UserData`)
- 스타일 컴포넌트: Styled 접두사 (예: `StyledButton`)

### 코드 포맷팅
- 들여쓰기: 2칸 공백
- 세미콜론 필수
- 작은따옴표 사용
- 후행 쉼표 사용

## 2. Django/Python 스타일 가이드

### 파일 구조
```python
# 1. 표준 라이브러리 임포트
import os
import json

# 2. 서드파티 라이브러리 임포트
from rest_framework import viewsets

# 3. 로컬 애플리케이션 임포트
from .models import User
from .serializers import UserSerializer

# 4. 상수 정의
MAX_RETRIES = 3

# 5. 클래스/함수 정의
class UserViewSet(viewsets.ModelViewSet):
    # ...
```

### 네이밍 컨벤션
- 클래스: PascalCase
- 함수/변수: snake_case
- 상수: 대문자 + 언더스코어
- URL 패턴: 케밥-케이스

### 코드 포맷팅
- 들여쓰기: 4칸 공백
- 최대 줄 길이: 79자
- 독스트링 필수
- PEP 8 준수

## 3. 데이터베이스 네이밍 컨벤션

### 테이블
- 복수형 사용
- 소문자 + 언더스코어
- 예: `users`, `account_books`

### 필드
- 소문자 + 언더스코어
- 외래 키: `모델명_id`
- 예: `created_at`, `user_id`

### 인덱스
- `idx_테이블명_필드명`
- 예: `idx_transactions_user_id`

## 4. Git 컨벤션

### 브랜치 네이밍
- feature/기능명
- bugfix/버그설명
- hotfix/긴급수정
- release/버전

### 커밋 메시지
```
[타입] 제목

본문

푸터
```

타입:
- feat: 새로운 기능
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅
- refactor: 리팩토링
- test: 테스트 코드
- chore: 기타 변경

## 5. API 응답 포맷

### 성공 응답
```json
{
  "status": "success",
  "data": {
    // 실제 데이터
  }
}
```

### 에러 응답
```json
{
  "status": "error",
  "message": "에러 메시지",
  "code": "ERROR_CODE"
}
``` 