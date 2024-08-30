from django.db.models import Q
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from rest_framework.response import Response
from firebase_admin import messaging

def sendFCMNotification(token, title, body, url):
    message = messaging.Message(
        data = {
            'title' : title,
            'body' : body,
            'url' : url
        },
        token = token
    )
    try:
        response = messaging.send(message)
    except messaging.UnregisteredError:
        deleteToken = FCMToken.objects.filter(token = token)
        deleteToken.delete()
    else:
        return response

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
            instance = serializer.save(user=self.request.user)
            managerTokens = FCMToken.objects.filter(
                Q(user__username = 'Jamie') | Q(user__username = 'Scott')
            )
            workerTokens = FCMToken.objects.filter(user = instance.user)
            for token in managerTokens:
                sendFCMNotification(
                    token = token.token,
                    title = 'New Order Created',
                    body = f'Order is created by {instance.user.username} on {instance.date}.\n주문이 {instance.user.username}님 의해 {instance.date}에 요청 되었습니다.',
                    url = '/order/' + str(instance.id) + '/manager'
                )
            for token in workerTokens:
                sendFCMNotification(
                    token = token.token,
                    title = 'New Order Created',
                    body = f'Order is successfully created by {instance.date}.\n주문이 {instance.date}에 성공적으로 요청 되었습니다.',
                    url = '/order/' + str(instance.id) + '/worker'
                )
        else:
            print(serializer.errors)

class OrderUpdate(generics.UpdateAPIView):
    queryset = Order.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if(self.request.user.username == 'Jamie' or self.request.user.username == 'Scott'):
            return OrderManagerUpdateSerializer
        else:
            return OrderSerializer
    
    def perform_update(self, serializer):
        if serializer.is_valid():
            instance = serializer.save()
            if(self.request.user.username == 'Jamie' or self.request.user.username == 'Scott'):
                workerTokens = FCMToken.objects.filter(user = instance.user)
                for token in workerTokens:
                    sendFCMNotification(
                        token = token.token,
                        title = 'Order Completed',
                        body = f'Order created on {instance.date} is completed.\n{instance.date}에 요청된 주문이 완료 되었습니다.',
                        url = '/order/' + str(instance.id) + '/worker'
                    )
            else:
                managerTokens = FCMToken.objects.filter(
                    Q(user__username = 'Jamie') | Q(user__username = 'Scott')
                )
                for token in managerTokens:
                    sendFCMNotification(
                        token = token.token,
                        title = 'Order Updated',
                        body = f'Order created by {instance.user.username} on {instance.date} has been updated\n{instance.user.username}님에 의해 {instance.date}에 요청된 주문이 수정 되었습니다.',
                        url = '/order/' + str(instance.id) + '/manager'
                    )
        else:
            print(serializer.errors)
        

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
    
