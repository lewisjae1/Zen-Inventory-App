from django.db import models

# Create your models here.
class Order(models.Model):
    Date = models.DateField(auto_now_add=True)
    Additional_Message = models.CharField(max_length=100, null=True)

class Product(models.Model):
    ProductName = models.CharField(max_length=50, null=False)

class OrderProduct(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    numProduct = models.IntegerField(null=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['order', 'product'], name='unique_order_product')
        ]