from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

# Create your models here.
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    additionalMessage = models.CharField(max_length=100, null=True, blank=True)
    expirationDate = models.DateTimeField(editable=False)
    isCompleted = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.expirationDate:
            self.expirationDate = timezone.now() + timedelta(days=90)
        super().save(*args,**kwargs)


class Product(models.Model):
    productName = models.CharField(max_length=50, null=False)

class OrderProduct(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    numProduct = models.IntegerField(null=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['order', 'product'], name='unique_order_product')
        ]