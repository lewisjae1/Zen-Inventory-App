from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('auth/', include("rest_framework.urls")),
    path('order/', OrderListCreate.as_view(), name='order-list'),
    path('order/update/<int:pk>/', OrderUpdate.as_view(), name='order-update'),
    path('user/', ListUserView.as_view(), name='user-detail'),
    path('product/', ListProductView.as_view(), name='product-list')
]