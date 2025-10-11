from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Category, Product, Cart, Wishlist
from .serializers import CategorySerializer,CartSerializer
from rest_framework.decorators import api_view, authentication_classes, permission_classes


import json

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    if User.objects.filter(username=data["email"]).exists():
        return Response({"detail": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create(
        first_name=data.get("name", ""),
        username=data["email"],  # Django uses "username", we’ll store email here
        email=data["email"],
        password=make_password(data["password"])
    )
    return Response({"detail": "User created successfully"}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(request, username=email, password=password)
    if user is not None:
        login(request, user)  # sets sessionid cookie
        user_data = {
            "id": user.id,
            "is_superuser": user.is_superuser,
        }
        return Response(
            {
                "detail": "Login successful",
                "user": user_data
            },
            status=status.HTTP_200_OK,
        )
    else:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def add_category(request):
    name = request.POST.get("name", "")
    if Category.objects.filter(name=name).exists():
        return JsonResponse({"message": "Category already exists"}, status=400)

    description = request.POST.get("description", "")
    product_count = request.POST.get("productCount", 0)

    image = request.FILES.get("image")  # Match frontend key: "image"

    category = Category.objects.create(
        name=name,
        description=description,
        product_count=product_count,
        image=image
    )

    return JsonResponse({"message": "Category added successfully"}, status=200)
@api_view(["GET"])
@permission_classes([AllowAny])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True, context={'request': request} )
    return Response(serializer.data)

@api_view(["POST"])
#TODO add permission classes 
@permission_classes([AllowAny])

def add_product(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    name = request.POST.get("name", "").strip()
    category_value = request.POST.get("category")  # frontend sends "category"

    if not category_value:
        return JsonResponse({"error": "Category is required"}, status=400)

    # ✅ Handle category (ID or Name)
    category = None
    if category_value.isdigit():
        try:
            category = Category.objects.get(id=int(category_value))
        except Category.DoesNotExist:
            return JsonResponse({"error": "Category ID does not exist"}, status=400)
    else:
        # Allow category by name → auto-create if not found
        category, _ = Category.objects.get_or_create(name=category_value.strip())

    # ✅ Prevent duplicate product names
    if Product.objects.filter(name=name).exists():
        return JsonResponse({"message": "Product already exists"}, status=400)

    # ✅ Create the product
    product = Product.objects.create(
        name=name,
        description=request.POST.get("description", ""),
        price=request.POST.get("price", 0),
        original_price=request.POST.get("originalPrice"),
        discount=request.POST.get("discount", 0),
        image=request.FILES.get("image"),
        category=category,
        brand=request.POST.get("brand", ""),
        rating=request.POST.get("rating", 0),
        reviews=request.POST.get("reviews", 0),
        in_stock = request.POST.get("inStock", "false").lower() in ["true", "1"],
        is_todays_deals = request.POST.get("isTodaysDeals", "false").lower() in ["true", "1"],

        stock_quantity=request.POST.get("stockQuantity", 0),
    )

    # ✅ Handle list fields (features & tags)
    features = request.POST.getlist("features[]")
    tags = request.POST.getlist("tags[]")

    if features:
        product.features = features  # assuming JSONField or ManyToMany
    if tags:
        product.tags = tags

    product.save()

    return JsonResponse({"message": "Product added successfully"}, status=200)

def get_products(request):
    products = Product.objects.all()
    product_list = []
    for product in products:
        product_data = {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": str(product.price),
            "originalPrice": str(product.original_price) if product.original_price else None,
            "discount": product.discount,
            "image": request.build_absolute_uri(product.image.url) if product.image else None,  
            "category": product.category.name if product.category else None,
            "brand": product.brand,
            "rating": product.rating,
            "reviews": product.reviews,
            "inStock": product.in_stock,
            "stockQuantity": product.stock_quantity,
            "features": product.features if product.features else [],
            "tags": product.tags if product.tags else [],
            "isTodaysDeals": product.is_todays_deals,
            "isBestSeller": product.is_best_seller,
            "isFeatured": product.is_featured,
            "isNewArrival": product.is_new_arrival,
            "isTopRated": product.is_top_rated,
            "isTrending": product.is_trending,
            "isFlashSale": product.is_flash_sale,
            "createdAt": product.created_at.isoformat(),
            "updatedAt": product.updated_at.isoformat(),
        }
        product_list.append(product_data)
    return JsonResponse(product_list, safe=False)


def toggle_deal(request, productId):
    try:
        product = Product.objects.get(id=productId)
        product.is_todays_deals = not product.is_todays_deals
        product.save()
        return JsonResponse({"message": "Product deal status toggled successfully"}, status=200)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)     
    
def edit_product(request, productId):
    try:
        product = Product.objects.get(id=productId)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    name = request.POST.get("name", "").strip()
    category_value = request.POST.get("category")  # frontend sends "category"

    if not category_value:
        return JsonResponse({"error": "Category is required"}, status=400)

    # ✅ Handle category (ID or Name)
    category = None
    if category_value.isdigit():
        try:
            category = Category.objects.get(id=int(category_value))
        except Category.DoesNotExist:
            return JsonResponse({"error": "Category ID does not exist"}, status=400)
    else:
        # Allow category by name → auto-create if not found
        category, _ = Category.objects.get_or_create(name=category_value.strip())

    # ✅ Prevent duplicate product names (excluding current product)
    if Product.objects.filter(name=name).exclude(id=productId).exists():
        return JsonResponse({"message": "Another product with this name already exists"}, status=400)

    # ✅ Update the product
    product.name = name
    product.description = request.POST.get("description", "")
    product.price = request.POST.get("price", 0)
    product.original_price = request.POST.get("originalPrice")
    product.discount = request.POST.get("discount", 0)
    
    if "image" in request.FILES:
        product.image = request.FILES.get("image")
        
    product.category = category
    product.brand = request.POST.get("brand", "")
    product.rating = request.POST.get("rating", 0)
    product.reviews = request.POST.get("reviews", 0)
    product.in_stock = request.POST.get("inStock", "false").lower() in ["true", "1"]
    product.is_todays_deals = request.POST.get("isTodaysDeals", "false").lower() in ["true", "1"]
    product.stock_quantity = request.POST.get("stockQuantity", 0)

    # ✅ Handle list fields (features & tags)
    features = request.POST.getlist("features[]")
    tags = request.POST.getlist("tags[]")

    if features:
        product.features = features  # assuming JSONField or ManyToMany
    if tags:
        product.tags = tags     
    product.save()
    return JsonResponse({"message": "Product updated successfully"}, status=200)
#TODO: add permission classes 
@api_view(["POST"])
@permission_classes([AllowAny])
def add_to_cart(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    
    data = json.loads(request.body)
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)
    user_id =data.get("id",1)

    if not product_id:
        return JsonResponse({"error": "product_id is required"}, status=400)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    #  create or update cart item
    cart_item, created = Cart.objects.get_or_create(user_id = user_id, product=product)
    if not created:
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity
    cart_item.save()

    return JsonResponse({"message": "Added to cart successfully"})


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def remove_from_cart(request):
    Cart.objects.filter(user=request.user, product_id=product_id).delete()
    return Response({"message": "Removed from cart"})

# WISHLIST

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def toggle_wishlist(request):
    product = Product.objects.get(id=productId)
    wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
    if not created:
        wishlist_item.delete()
        return Response({"message": "Removed from wishlist"})
    return Response({"message": "Added to wishlist"})



@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def logout_user(request):
    """
    Logs out the current user and deletes the session cookie.
    """
    # Log out the user
    logout(request)

    # Create a response and delete the sessionid cookie
    response = Response(
        {"detail": "Logout successful"},
        status=status.HTTP_200_OK
    )

    # Delete the session cookie
    response.delete_cookie("sessionid")

    return response
@api_view(['GET'])
@authentication_classes([])  # Disable authentication
@permission_classes([])
#TODO: implement user based cart viewing 
def get_cart(request):

    carts = Cart.objects.filter(user_id=4)
    serializer = CartSerializer(carts, many=True, context={'request': request})
    return Response(serializer.data)








