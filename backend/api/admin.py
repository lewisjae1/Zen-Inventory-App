from django.contrib import admin
from .models import *
# Register your models here.
class OrderAdmin(admin.ModelAdmin):
  list_display = [
    'user',
    'date',
    'additionalMessage'
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

admin.site.register(Order)
admin.site.register(Product)
admin.site.register(OrderProduct)