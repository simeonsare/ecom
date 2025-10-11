from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)  
    product_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount = models.PositiveIntegerField(default=0)  # percentage discount
    image = models.ImageField(upload_to="products/", blank=True, null=True) 
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    brand = models.CharField(max_length=100)
    rating = models.FloatField(default=0.0)
    reviews = models.PositiveIntegerField(default=0)
    in_stock = models.BooleanField(default=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    features = models.JSONField(blank=True, null=True)  # list of features
    tags = models.JSONField(blank=True, null=True)         # list of tags
    is_todays_deals = models.BooleanField(default=False)
    is_best_seller = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)
    is_top_rated = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    is_flash_sale = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    colors = models.CharField(max_length=255, blank=True)  # Comma-separated color values

    def __str__(self):
        return self.name

class UserActivity(models.Model):
    user_id = models.CharField(max_length=50)  # Assuming user ID is string
    user_name = models.CharField(max_length=100)
    action = models.CharField(max_length=100)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL)
    timestamp = models.DateTimeField()
    details = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user_name} - {self.action} - {self.timestamp}"
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'product')  # prevents duplicate rows

    def __str__(self):
        return f"{self.user.id} - {self.product.name} ({self.quantity})"


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wishlist_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.id} - {self.product.id}"
    
