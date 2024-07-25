from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *

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

class OrderProductListCreate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderProductSerializer

    def get_queryset(self):
        # Managers have full access to the all objects in Order Product
        if(self.request.user.username == 'Jamie' or self.request.user.username == 'Scott' ):
            return OrderProduct.objects.all()
        else:
            # Workers have access to only Order Product obejects that belongs to their orders.
            userOrdered = self.request.user
            return OrderProduct.objects.filter(order__user = userOrdered).select_related('order')
            
class OrderProductUpdate(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = OrderProduct.objects.all()
    serializer_class = OrderProductUpdateSerializer

    def get_queryset(self):
        userOrdered = self.request.user
        return OrderProduct.objects.filter(order__user = userOrdered).select_related('order')

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
