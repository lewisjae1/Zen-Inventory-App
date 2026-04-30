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
    path('allusers/', ListAllUserView.as_view(), name='all-users-detail'),
    path('product/', ListProductView.as_view(), name='product-list'),
    path("product/create/", ProductCreate.as_view(), name="product-create"),
    path('product/update/<int:pk>/', ProductUpdate.as_view(), name='product-update'),
    path('product/delete/<int:pk>/', ProductDelete.as_view(), name='delete-product'),
    path('orderproduct/', ListOrderProduct.as_view(), name='order-product'),
    path('deleteexpiredorders/', DeleteExpiredOrder.as_view(), name='delete-expired-orders'),
    path('save-token/', SaveFCMToken.as_view(), name = 'save-token'),
    path('get-token/', GetFCMToken.as_view(), name='get-token'),
    path('delete-token/<int:pk>/', DeleteFCMToken.as_view(), name = 'delete-token'),
    path('userrole/register/', CreateUserRoleView.as_view(), name="register-user-role"),
    path('userrole/', ListUserRoleView.as_view(), name='user-role'),
    path('alluserroles/', ListAllUserRoleView.as_view(), name='all-user-role'),
    path('userrole/update/<int:pk>/', UpdateUserRoleView.as_view(), name='user-role-update')
]