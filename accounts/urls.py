from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('users/', views.user_list, name='user_list'),
    path('users/<int:user_id>/', views.user_update, name='user_update'),
    path('users/<int:user_id>/delete/', views.user_delete, name='user_delete'),
    path('categories/', views.category_list, name='category_list'),
    path('categories/create/', views.category_create, name='category_create'),
    path('categories/<int:category_id>/', views.category_update, name='category_update'),
    path('categories/<int:category_id>/delete/', views.category_delete, name='category_delete'),
    
    # 거래 내역 관련 URL
    path('api/transactions/', views.transaction_list, name='transaction_list'),
    path('api/transactions/create/', views.transaction_create, name='transaction_create'),
    path('api/transactions/<int:transaction_id>/', views.transaction_update, name='transaction_update'),
    path('api/transactions/<int:transaction_id>/delete/', views.transaction_delete, name='transaction_delete'),
    path('api/transactions/bulk-delete/', views.transaction_bulk_delete, name='transaction_bulk_delete'),
] 