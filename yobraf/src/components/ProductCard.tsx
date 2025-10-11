import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { redirectToWhatsApp } from '@/utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const handleOrder = () => {
    redirectToWhatsApp(product.name, product.price);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-normal gradient-card border-0">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover transition-slow group-hover:scale-105"
        />
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-accent hover:bg-accent-hover">
            -{discountPercentage}%
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-fast h-8 w-8 p-0 bg-background/80 hover:bg-background"
        >
          <Heart className="h-4 w-4" />
        </Button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-fast cursor-pointer"
                    onClick={() => onViewDetails?.(product)}>
                  {product.name}
                </h3>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1 gradient-primary hover:shadow-glow transition-normal"
              onClick={handleOrder}
              disabled={!product.inStock}
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Order Now
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails?.(product)}
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};