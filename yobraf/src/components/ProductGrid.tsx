import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  onViewDetails?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onViewDetails }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};