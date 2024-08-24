from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from rest_framework.response import Response

# Create your views here.
class OrderListCreate(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Managers have full access to all objects
        if(self.request.user.username == 'Jamie' or self.request.user.username == 'Scott' ):
            return Order.objects.all()
        else:
            # Workers have access to only the order that belongs to themselves
            userOrdered = self.request.user
            return Order.objects.filter(user=userOrdered)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class OrderUpdate(generics.UpdateAPIView):
    queryset = Order.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if(self.request.user.username == 'Jamie' or self.request.user.username == 'Scott' ):
            return OrderManagerUpdateSerializer
        else:
            return OrderSerializer

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ListUserView(generics.ListAPIView):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
class ListAllUserView(generics.ListAPIView):
    serializer_class= UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    
class ListProductView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()

class ListOrderProduct(generics.ListAPIView):
    serializer_class = OrderProductDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Managers have full access to all objects
        if(self.request.user.username == 'Jamie' or self.request.user.username == 'Scott' ):
            return OrderProduct.objects.all()
        else:
            # Workers have access to only the order that belongs to themselves
            userOrdered = self.request.user
            return OrderProduct.objects.filter(order__user=userOrdered)

class DeleteExpiredOrder(generics.DestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def delete(self, request, *args, **kwargs):
        currentDate = timezone.now().date()
        expiredOrder = self.queryset.filter(expirationDate__lte = currentDate)

        expiredOrder.delete()

        return Response()
    
class SaveFCMToken(generics.CreateAPIView):
    queryset = FCMToken.objects.all()
    serializer_class = FCMTokenSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.is_valid():
            validatedData = serializer.validated_data
            deleteData = FCMToken.objects.filter(token = validatedData['token'])
            deleteData.delete()
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class GetFCMToken(generics.ListAPIView):
    queryset = FCMToken.objects.all()
    serializer_class = FCMTokenSerializer
    permission_classes = [IsAuthenticated]

class DeleteFCMToken(generics.DestroyAPIView):
    serializer_class = FCMTokenSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return FCMToken.objects.filter(user = self.request.user)
    
