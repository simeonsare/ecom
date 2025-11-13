from rest_framework import serializers
from .models import Category, Cart, Product, ProductImage


# -------------------------
# CATEGORY SERIALIZER
# -------------------------
class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

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


# -------------------------
# PRODUCT IMAGE SERIALIZER
# -------------------------
class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None
    
class ProductimageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None


# -------------------------
# PRODUCT SERIALIZER
# -------------------------
class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'price','image', 'images']


# -------------------------
# CART SERIALIZER
# -------------------------
class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # nested serializer for product details

    class Meta:
        model = Cart
        fields = ['id', 'product', 'quantity']
