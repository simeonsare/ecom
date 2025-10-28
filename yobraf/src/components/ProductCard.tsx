import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { redirectToWhatsApp } from '@/utils/whatsapp';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden hover:shadow-lg gradient-card border-0">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition" />
        </Link>
        {discount > 0 && <Badge className="absolute top-2 left-2 bg-accent font-bold text-foreground">-{discount}%</Badge>}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <Link to={`/product/${product.id}`} className="font-semibold text-sm line-clamp-2 hover:text-primary">
          {product.name}
        </Link>

        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
          ))}
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-primary">ksh {product.price}</span>
          {product.originalPrice && <span className="text-sm line-through text-muted-foreground">ksh {product.originalPrice}</span>}
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            className="flex-1 gradient-primary"
            onClick={() => redirectToWhatsApp(product.name, product.price)}
            disabled={!product.inStock}
          >
            <ShoppingBag className="h-4 w-4 mr-1" /> Order
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={`/product/${product.id}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
