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
        fields = ['isCompleted']

class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProduct
        fields = ['id', 'product', 'numProduct']

class OrderProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProduct
        fields = ['id', 'order', 'product', 'numProduct']

class OrderSerializer(serializers.ModelSerializer):
    products = OrderProductSerializer(many=True, write_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'date', 'additionalMessage', 'expirationDate', 'isCompleted', 'location', 'products']
        extra_kwargs = {'user': {'read_only': True}}

    def validate(self, data):
        user = data.get('user')
        isCompleted = data.get('isCompleted', False)
        if not isCompleted:
            incompleteOrders = Order.objects.filter(user = user, isCompleted = False)
            if self.instance:
                incompleteOrders = incompleteOrders.exclude(pk = self.instance.pk)
            if incompleteOrders.exists():
                raise serializers.ValidationError('Only one incomplete order is allowed per user.')
            
        return data


    def create(self, validated_data):
        products_data = validated_data.pop('products')
        order = Order.objects.create(**validated_data)
        for product_data in products_data:
            OrderProduct.objects.create(order=order, **product_data)
        return order

    def update(self, instance, validated_data):
        if instance.isCompleted == True:
            raise serializers.ValidationError('Order has been completed.')
        products_data = validated_data.pop('products')
        instance.date = validated_data.get('date', instance.date)
        instance.additionalMessage = validated_data.get('additionalMessage', instance.additionalMessage)
        instance.location = validated_data.get('location', instance.location)
        instance.save()

        existing_order_products = {op.product.id: op for op in OrderProduct.objects.filter(order=instance)}

        updatedProducts = set()

        for product_data in products_data:
            product_id = product_data['product'].id
            numProduct = product_data['numProduct']

            if product_id in existing_order_products:
                existing_product = existing_order_products[product_id]
                if existing_product.numProduct != numProduct:
                    existing_product.numProduct = numProduct
                    existing_product.save()
                updatedProducts.add(product_id)
            else:
                OrderProduct.objects.create(order=instance, **product_data)
                updatedProducts.add(product_id)

        for product, existing_product in existing_order_products.items():
            if product not in updatedProducts or existing_product.numProduct == 0:
                existing_product.delete()

        return instance

class OrderProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProduct
        fields = ['id','numProduct']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'productName']

class FCMTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = FCMToken
        fields = ['id', 'user', 'token']
        extra_kwargs = {'user': {'read_only': True}}