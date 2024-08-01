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
        fields = ['id', 'product', 'numProduct']

class OrderSerializer(serializers.ModelSerializer):
    products = OrderProductSerializer(many=True, write_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'date', 'additionalMessage', 'expirationDate', 'isCompleted', 'products']
        extra_kwargs = {'user': {'read_only': True}}

    def create(self, validated_data):
        products_data = validated_data.pop('products')
        order = Order.objects.create(**validated_data)
        for product_data in products_data:
            OrderProduct.objects.create(order=order, **product_data)
        return order




class OrderProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProduct
        fields = ['id','numProduct']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'productName']