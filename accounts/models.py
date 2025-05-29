from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """커스텀 사용자 모델"""
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    email = models.EmailField(unique=True)

    class Meta:
        db_table = 'users'
        verbose_name = '사용자'
        verbose_name_plural = '사용자들'

    def __str__(self):
        return self.username

class Category(models.Model):
    """카테고리 모델"""
    TYPE_CHOICES = [
        ('asset', '자산'),
        ('liability', '부채'),
        ('equity', '자본'),
        ('revenue', '수익'),
        ('expense', '비용'),
    ]
    
    type = models.CharField('구분', max_length=20, choices=TYPE_CHOICES)
    name = models.CharField('계정명', max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    remark = models.TextField('비고', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name = '카테고리'
        verbose_name_plural = '카테고리들'
        ordering = ['type', 'name']
    
    def __str__(self):
        return f"{self.get_type_display()} - {self.name}"

class Transaction(models.Model):
    """거래 내역 모델"""
    TRANSACTION_TYPE_CHOICES = [
        ('income', '수입'),
        ('expense', '지출'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField('거래 유형', max_length=10, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField('금액', max_digits=12, decimal_places=2)
    description = models.CharField('설명', max_length=200)
    transaction_date = models.DateField('거래 날짜')
    memo = models.TextField('메모', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transactions'
        verbose_name = '거래 내역'
        verbose_name_plural = '거래 내역들'
        ordering = ['-transaction_date', '-created_at']
    
    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.description} ({self.amount}원)" 