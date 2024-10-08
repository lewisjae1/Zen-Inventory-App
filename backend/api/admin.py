from django.contrib import admin
from .models import *
# Register your models here.
class OrderAdmin(admin.ModelAdmin):
  list_display = [
    'user',
    'date',
    'additionalMessage',
    'expirationDate',
    'isCompleted',
    'location'
  ]

class ProductAdmin(admin.ModelAdmin):
  list_display = [
    'productName'
  ]

class OrderProductAdmin(admin.ModelAdmin):
  list_display = [
    'numProduct',
    'order',
    'product'
  ]

class FCMTokenAdmin(admin.ModelAdmin):
  list_display = [
    'user',
    'token'
  ]

admin.site.register(Order, OrderAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(OrderProduct, OrderProductAdmin)
admin.site.register(FCMToken, FCMTokenAdmin)