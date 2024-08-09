from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta

# Create your models here.
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    additionalMessage = models.CharField(max_length=100, null=True, blank=True)
    expirationDate = models.DateField(editable=False)
    isCompleted = models.BooleanField(default=False)
    location = models.CharField(max_length=50, null=False)

    def __str__(self) -> str:
        return str(self.id)
    
    def clean(self):
        if not self.isCompleted:
            incompleteOrders = Order.objects.filter(user = self.user, isCompleted = False)
            if self.pk:
                incompleteOrders = incompleteOrders.exclude(pk = self.pk)
            if incompleteOrders.exists():
                raise ValidationError("only one incomplete order is allowd per user.")

    def save(self, *args, **kwargs):
        if not self.expirationDate:
            self.expirationDate = timezone.now().date() + timedelta(days=90)
        self.clean()
        super().save(*args,**kwargs)


class Product(models.Model):
    productName = models.CharField(max_length=50, null=False)

    def __str__(self) -> str:
        return str(self.id)

class OrderProduct(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=10, unique=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    numProduct = models.IntegerField(null=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['order', 'product'], name='unique_order_product')
        ]

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.order.__str__() + '-' + self.product.__str__()
        super().save(*args,**kwargs)