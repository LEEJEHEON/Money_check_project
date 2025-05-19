from django.db import models
from django.core.validators import MinValueValidator
from accounts.models import User

class Category(models.Model):
    """카테고리 모델"""
    TRANSACTION_TYPES = [
        ('income', '수입'),
        ('expense', '지출'),
    ]

    name = models.CharField('카테고리명', max_length=50)
    type = models.CharField('유형', max_length=20, choices=TRANSACTION_TYPES)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        verbose_name = '카테고리'
        verbose_name_plural = '카테고리들'

    def __str__(self):
        return f"{self.get_type_display()} - {self.name}"

class AccountBook(models.Model):
    """가계부 모델"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='transactions')
    amount = models.DecimalField('금액', max_digits=15, decimal_places=2, validators=[MinValueValidator(0)])
    transaction_type = models.CharField('거래 유형', max_length=20, choices=Category.TRANSACTION_TYPES)
    description = models.TextField('설명', blank=True)
    transaction_date = models.DateField('거래일')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'account_book'
        verbose_name = '가계부'
        verbose_name_plural = '가계부들'
        ordering = ['-transaction_date', '-created_at']

    def __str__(self):
        return f"{self.transaction_date} - {self.category.name} - {self.amount}"

    def save(self, *args, **kwargs):
        # 카테고리의 type과 transaction_type이 일치하는지 확인
        if self.category.type != self.transaction_type:
            raise ValueError("거래 유형이 카테고리 유형과 일치하지 않습니다.")
        super().save(*args, **kwargs)

class Budget(models.Model):
    """예산 모델"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='budgets')
    amount = models.DecimalField('예산액', max_digits=15, decimal_places=2, validators=[MinValueValidator(0)])
    start_date = models.DateField('시작일')
    end_date = models.DateField('종료일')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'budgets'
        verbose_name = '예산'
        verbose_name_plural = '예산들'

    def __str__(self):
        return f"{self.category.name} - {self.start_date}~{self.end_date} - {self.amount}"

    def save(self, *args, **kwargs):
        # 예산은 지출 카테고리에만 설정할 수 있음
        if self.category.type != 'expense':
            raise ValueError("지출 카테고리에만 예산을 설정할 수 있습니다.")
        if self.start_date > self.end_date:
            raise ValueError("시작일이 종료일보다 늦을 수 없습니다.")
        super().save(*args, **kwargs) 