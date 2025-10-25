import random
import string
from urllib import request
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.conf import settings
import os
from .models import Category, Product, Cart, Wishlist, Order, OrderItem
import requests

from .serializers import CategorySerializer,CartSerializer
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authtoken.models import Token


import json

class FrontendAppView(TemplateView):
    template_name = 'index.html'

    def get_template_names(self):
        # Override to use the React build index.html
        return [os.path.join(settings.FRONTEND_DIST_DIR, 'index.html')]

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
         token, _ = Token.objects.get_or_create(user=user)
         return Response({
            "detail": "Login successful",
            "token": token.key,
            "user": {
                "id": user.id,
                "is_superuser": user.is_superuser,
            }
        })
    else:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user=request.user
    return response({
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email":user.email,
    })


def generate_order_number():
        return "ORD-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
        try:
            data = request.data
            items = data.get("items", [])
            phone = data.get("phone")
            shipping_address = data.get("address")
            subtotal = float(data.get("total", 0))
            shipping = float(data.get("shipping", 0))
            tax = float(data.get("tax", 0))
            total = subtotal + shipping + tax
            payment_method = data.get("payment_method", "Cash on Delivery")

            # Get user info
            user = request.user
            customer_name = user.get_full_name() or user.username
            customer_email = user.email

            # Create order
            order = Order.objects.create(
                order_number=generate_order_number(),
                customer_name=customer_name,
                customer_email=customer_email,
                customer_phone=phone,
                shipping_address=shipping_address,
                subtotal=subtotal,
                shipping=shipping,
                tax=tax,
                total=total,
                payment_method=payment_method,
            )

            # Add order items
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    product_name=item["product"]["name"],
                    quantity=item["quantity"],
                    price=item["product"]["price"],
                    product_id=item["product"]["id"],
                )
           

            # Notify admin via WhatsApp
            whatsapp_number = getattr(settings, "ADMIN_WHATSAPP", None)
            api_key = getattr(settings, "CALLMEBOT_API_KEY", None)

            if whatsapp_number and api_key:
                message = (
                    f"🛍️ New Order!\n"
                    f"Order No: {order.order_number}\n"
                    f"Customer: {customer_name}\n"
                    f"Phone: {phone}\n"
                    f"Address:{shipping_address}\n"
                               
                
                    f"Total: Ksh {total:.2f}"
                )
                try:

                    cart = Cart.objects.get(user=request.user)
                    cart.delete()

                except Cart.DoesNotExist:
                    pass
                try:
                    requests.get(
                        f"https://api.callmebot.com/whatsapp.php?phone={whatsapp_number}"
                        f"&text={message}&apikey={api_key}"
                    )
                except Exception as e:
                    print("⚠️ WhatsApp notification failed:", e)

            return Response({"message": "Order created successfully"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("❌ Error creating order:", e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrder(request, orderId):
    user=request.user
    if not user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
    try:
        order = Order.objects.get(id=orderId)
        order_data = {
            "id": order.id,
            "orderNumber": order.order_number,
            "customerName": order.customer_name,
            "customerEmail": order.customer_email,
            "customerPhone": order.customer_phone,
            "shippingAddress": order.shipping_address,
            "date": order.date.isoformat(),
            "status": order.status,
            "subtotal": float(order.subtotal),
            "shipping": float(order.shipping),
            "tax": float(order.tax),
            "total": float(order.total),
            "paymentMethod": order.payment_method,
            "items": [
                {
                    "productName": item.product_name,
                    "quantity": item.quantity,
                    "price": float(item.price),
                    "image": Product.objects.get(id=item.product_id).image.url if Product.objects.filter(id=item.product_id).exists() else None,
                }
                for item in order.items.all()
            ],
        }
        return Response(order_data)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)


# API to update order status
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_order_status(request, orderId):  
    user = request.user
    if not user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    new_status = request.data.get("status")
    if new_status not in dict(Order.STATUS_CHOICES):
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        order = Order.objects.get(id=orderId)
        order.status = new_status
        order.save()
        return Response({"message": "Order status updated successfully"})
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)


#users
@api_view(["POST"])
@permission_classes([IsAuthenticated])  
def addUser(request):
    user = request.user
    if not user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
    data = request.data
    if User.objects.filter(username=data["email"]).exists():
        return Response({"detail": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    # determine role flags
    is_superuser_flag = True if data.get("role") == "admin" else False
    is_staff_flag = is_superuser_flag

    new_user = User.objects.create(
        first_name=data.get("name", ""),
        username=data["email"],  # Django uses "username", we'll store email here
        email=data["email"],
        password=make_password(data["password"]),
        is_superuser=is_superuser_flag,
        is_staff=is_staff_flag,
    )
    return Response({"detail": "User created successfully"}, status=status.HTTP_201_CREATED)    



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsers(request):
    user = request.user

    # Allow only admin/superuser access
    if not user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    users = User.objects.all()
    user_list = []

    for u in users:
        # Get all orders for this user
        user_orders = Order.objects.filter(customer_email=u.email)
        total_orders = user_orders.count()
        total_spent = sum(order.total for order in user_orders)
        address = user_orders.last().shipping_address if user_orders.exists() else "Unknown"
        phone = user_orders.last().customer_phone if user_orders.exists() else "Unknown"
        user_data = {
            "id": u.id,
            "name": f"{u.first_name} {u.last_name}" if u.first_name or u.last_name else u.username,
            "email": u.email,
            "phone": phone,
            "location": address,  # if your model doesn’t have location, set manually
            "joinDate": u.date_joined.date().isoformat(),
            "status": "active" if u.is_active else "inactive",
            "role": "customer" if not u.is_staff else "admin",
            "totalOrders": total_orders,
            "totalSpent": float(total_spent),
        }

        user_list.append(user_data)

    return Response({
        "total_users": len(user_list),
        "users": user_list
    })






@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_category(request):
    user = request.user
    if not user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
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
@permission_classes([IsAuthenticated])
def add_product(request):
    user = request.user
    if not user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    name = request.POST.get("name", "").strip()
    category_value = request.POST.get("category")  # frontend sends "category"

    if not category_value:
        return JsonResponse({"error": "Category is required"}, status=400)

    #  Handle category (ID or Name)
    category = None
    if category_value.isdigit():
        try:
            category = Category.objects.get(id=int(category_value))
        except Category.DoesNotExist:
            return JsonResponse({"error": "Category ID does not exist"}, status=400)
    else:
        # Allow category by name → auto-create if not found
        category, _ = Category.objects.get_or_create(name=category_value.strip())

    #  Prevent duplicate product names
    if Product.objects.filter(name=name).exists():
        return JsonResponse({"message": "Product already exists"}, status=400)

    # Create the product
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

    #  Handle list fields (features & tags)
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

@api_view(["GET"])
@permission_classes([AllowAny])
def get_product(request, productId):
    try:
        product = Product.objects.get(id=productId)
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
        return JsonResponse(product_data, safe=False)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_product(request, productId):
    user = request.user
    if not user.is_superuser:
        return JsonResponse({"error": "Permission denied"}, status=403)

    try:
        product = Product.objects.get(id=productId)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    # Extract form data
    product.name = request.POST.get("name", product.name)
    product.brand = request.POST.get("brand", product.brand)
    product.price = request.POST.get("price", product.price)
    product.discount = request.POST.get("discount", product.discount)
    product.description = request.POST.get("description", product.description)
    product.in_stock = request.POST.get("inStock", str(product.in_stock)).lower() == "true"
    product.stock_quantity = request.POST.get("stockQuantity", product.stock_quantity)
    product.is_todays_deals = request.POST.get("isTodaysDeals", str(product.is_todays_deals)).lower() == "true"
    product.original_price = request.POST.get("originalPrice", product.original_price)

    category_name_or_id = request.POST.get("category")
    if category_name_or_id:
        try:
            # Try by ID first, then by name
            if str(category_name_or_id).isdigit():
                category = Category.objects.get(id=int(category_name_or_id))
            else:
                category = Category.objects.get(name=category_name_or_id)
            product.category = category
        except Category.DoesNotExist:
            return JsonResponse({"error": f"Category '{category_name_or_id}' not found"}, status=400)
    # Handle image upload
    if "image" in request.FILES:
        product.image = request.FILES["image"]

    product.save()

    product_data = {
        "id": product.id,
        "name": product.name,
        "brand": product.brand,
        "price": product.price,
        "originalPrice": product.original_price,
        "discount": product.discount,
        "category": product.category.name if product.category else None,
        "description": product.description,
        "inStock": product.in_stock,
        "stockQuantity": product.stock_quantity,
        "isTodaysDeals": product.is_todays_deals,
        "image": product.image.url if product.image else None,
    }

    return JsonResponse({"message": "Product updated successfully", "product": product_data}, status=200)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_product(request, productId):
    user = request.user
    if not user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    try:
        product = Product.objects.get(id=productId)
        product.delete()
        return JsonResponse({"message": "Product deleted successfully"}, status=200)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrders(request):
    user=request.user
    if not user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
    orders = Order.objects.all()    
    order_list = []
    for order in orders:
        order_data = {
           "id": order.id,
            "orderNumber": order.order_number,
            "customerName": order.customer_name,
            "customerEmail": order.customer_email,
            "date": order.date.isoformat(),
            "status": order.status,
            "total": float(order.total),
            "items": order.items.count(),
        }
        order_list.append(order_data)
    return Response({"total_orders": len(order_list), "orders": order_list})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_deal(request, productId):
    user = request.user
    if not user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

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

    #  Handle category (ID or Name)
    category = None
    if category_value.isdigit():
        try:
            category = Category.objects.get(id=int(category_value))
        except Category.DoesNotExist:
            return JsonResponse({"error": "Category ID does not exist"}, status=400)
    else:
        # Allow category by name → auto-create if not found
        category, _ = Category.objects.get_or_create(name=category_value.strip())

    #  Prevent duplicate product names (excluding current product)
    if Product.objects.filter(name=name).exclude(id=productId).exists():
        return JsonResponse({"message": "Another product with this name already exists"}, status=400)

    #  Update the product
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

    #  Handle list fields (features & tags)
    features = request.POST.getlist("features[]")
    tags = request.POST.getlist("tags[]")

    if features:
        product.features = features  # assuming JSONField or ManyToMany
    if tags:
        product.tags = tags     
    product.save()
    return JsonResponse({"message": "Product updated successfully"}, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    user = request.user
    data = json.loads(request.body)
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)
    user_id = user.id

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
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    product_id = request.data.get("product_id")
    if not product_id:
        return Response({"error": "product_id is required"}, status=400)

    Cart.objects.filter(user=request.user, product_id=product_id).delete()
    return Response({"message": "Removed from cart"})

# WISHLIST

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def toggle_wishlist(request):
    productId = request.data.get("product_id")
    product = Product.objects.get(id=productId)
    wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
    if not created:
        wishlist_item.delete()
        return Response({"message": "Removed from wishlist"})
    return Response({"message": "Added to wishlist"})



@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def get_cart(request):        
    user = request.user
    carts = Cart.objects.filter(user=user)
    count=carts.count()
    serializer = CartSerializer(carts, many=True, context={'request': request})

    print("User:", request.user)
    print("Is authenticated:", request.user.is_authenticated)

    return Response({"data": serializer.data, "count": count})









