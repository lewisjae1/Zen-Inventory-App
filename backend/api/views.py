from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *
from rest_framework_simplejwt.authentication import JWTAuthentication

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
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if(self.request.user.username == 'Jamie' or self.request.user.username == 'Scott' ):
            return OrderManagerUpdateSerializer
        else:
            return OrderWorkerUpdateSerializer

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
    permission_classes = [AllowAny]
    queryset = Product.objects.all()