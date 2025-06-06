# Generated by Django 4.2.21 on 2025-05-29 07:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_add_updated_at_to_category'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transaction_type', models.CharField(choices=[('income', '수입'), ('expense', '지출')], max_length=10, verbose_name='거래 유형')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=12, verbose_name='금액')),
                ('description', models.CharField(max_length=200, verbose_name='설명')),
                ('transaction_date', models.DateField(verbose_name='거래 날짜')),
                ('memo', models.TextField(blank=True, null=True, verbose_name='메모')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='accounts.category')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': '거래 내역',
                'verbose_name_plural': '거래 내역들',
                'db_table': 'transactions',
                'ordering': ['-transaction_date', '-created_at'],
            },
        ),
    ]
