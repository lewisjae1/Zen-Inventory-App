from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user', 'date', 'additionalMessage', 'expirationDate', 'isCompleted']
        extra_kwargs = {'user': {'read_only': True}}

class OrderManagerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['iscompleted']

class OrderWorkerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['additionalMessage']

class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProduct
        fields = ['id','order', 'product', 'numProduct']

class OrderProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProduct
        fields = ['id','numProduct']