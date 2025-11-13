import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/ProductGrid';
import { mockProducts, mockCategories } from '@/data/mockData';
import { Product, Category } from '@/types/product';
import { ChevronRight, TrendingUp, Zap, Star } from 'lucide-react';

export const Store: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = selectedCategory
    ? mockProducts.filter(product => product.category === selectedCategory)
    : mockProducts;

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const featuredProducts = mockProducts.filter(p => p.tags.includes('featured') || p.tags.includes('popular'));
  const dealProducts = mockProducts.filter(p => p.discount && p.discount > 10);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to StoreHub
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Discover amazing products at unbeatable prices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="shadow-glow">
              <TrendingUp className="h-5 w-5 mr-2" />
              Shop Trending
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              <Zap className="h-5 w-5 mr-2" />
              Flash Deals
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mockCategories.map((category: Category) => (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-lg transition-normal group gradient-card"
                onClick={() => setSelectedCategory(category.name)}
              >
                <CardContent className="p-4 text-center">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover group-hover:scale-110 transition-slow"
                  />
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.productCount} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        {!selectedCategory && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Button variant="ghost" className="text-primary">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <ProductGrid products={featuredProducts} onViewDetails={handleViewDetails} />
          </section>
        )}

        {/* Flash Deals */}
        {!selectedCategory && dealProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold">Flash Deals</h2>
              <Badge className="gradient-accent">Limited Time</Badge>
            </div>
            <ProductGrid products={dealProducts} onViewDetails={handleViewDetails} />
          </section>
        )}

        {/* Category Products */}
        {selectedCategory && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedCategory}</h2>
                <p className="text-muted-foreground">{filteredProducts.length} products found</p>
              </div>
              <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                Clear Filter
              </Button>
            </div>
            <ProductGrid products={filteredProducts} onViewDetails={handleViewDetails} />
          </section>
        )}

        {/* All Products */}
        {!selectedCategory && (
          <section>
            <h2 className="text-2xl font-bold mb-6">All Products</h2>
            <ProductGrid products={mockProducts} onViewDetails={handleViewDetails} />
          </section>
        )}
      </div>

      {/* Product Detail Modal would go here */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover"
                />
                <Button 
                  variant="ghost" 
                  className="absolute top-4 right-4 bg-background/80"
                  onClick={() => setSelectedProduct(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{selectedProduct.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(selectedProduct.rating) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({selectedProduct.reviews} reviews)</span>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-primary">${selectedProduct.price}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${selectedProduct.originalPrice}
                    </span>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-6">{selectedProduct.description}</p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedProduct.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full gradient-primary"
                  onClick={() => {
                    // Handle WhatsApp order
                    const message = `I need this ${selectedProduct.name} - $${selectedProduct.price}`;
                    const encodedMessage = encodeURIComponent(message);
                    // TODO: Replace with your WhatsApp number
                    window.open(`https://wa.me/+254716735799?text=${encodedMessage}`, '_blank');
                  }}
                >
                  Order via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};