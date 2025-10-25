"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,re_path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from .views import FrontendAppView

from django.views.generic import TemplateView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
import os
from django.views.static import serve


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/register/', views.register_user, name='register'),
    path('api/login/', views.login_user , name='login'),    
    path('api/profile/', views.get_profile ,name='profile'),
    path('api/addCategories/', views.add_category, name='add_category'),
    path('api/getCategories/', views.get_categories, name='get_categories'),
    path('api/addProduct/', views.add_product, name='add_product'),
    path('api/delete/<int:productId>/', views.delete_product, name='delete_product'),
    path('api/getProducts/', views.get_products, name='get_products'),
    path('api/getProduct/<int:productId>/', views.get_product, name='get_product'),
    path("api/products/<int:productId>/toggle-deal/", views.toggle_deal, name="toggle-deal"),
    path("api/products/edit/<int:productId>/", views.edit_product, name = "edit_product"),
    path('api/updateProduct/<int:productId>/', views.update_product, name='update_product'),
    path('api/add_to_cart/', views.add_to_cart, name = 'add_to_cart'),
    path('api/get_cart/', views.get_cart , name="get_cart"),
    path('api/remove_from_cart/', views.remove_from_cart, name = 'remove_from_cart'),
    path('api/logout/', views.logout_user, name ="logout_user"),
    path('api/wishlist/',views.toggle_wishlist, name = "toggle_wishlist"),
    path('api/create_order/', views.create_order, name ="create_order"),
    path('api/getOrders/', views.getOrders , name ="totalOrders"),
    path('api/getOrder/<int:orderId>/', views.getOrder, name="getOrder"),
    path('api/orders/<int:orderId>/update_status/', views.update_order_status, name="update_order_status"),
    path('api/addUser/', views.addUser, name="addUser"),
    path('api/getUsers/', views.getUsers, name="getUsers"),
    path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),




    # Catch all for the frontend routes
    re_path(r'^(?!api/).*$', FrontendAppView.as_view(), name='spa'),
]


# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
