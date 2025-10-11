# serializers.py
from rest_framework import serializers
from .models import Category,Cart,Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'image', 'product_count']
def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None 
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image'] 

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # nested serializer for product details

    class Meta:
        model = Cart
        fields = ['id', 'product', 'quantity']


