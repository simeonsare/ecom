import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/ProductGrid';
import { mockCategories, mockProducts } from '@/data/mockData';
import { Category, Product } from '@/types/product';
import { ChevronRight, Filter, Grid, List } from 'lucide-react';

export const Categories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('name');

  const categoryProducts = selectedCategory 
    ? mockProducts.filter(p => p.category === selectedCategory.name)
    : [];

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {!selectedCategory ? (
          <>
            {/* Categories Overview */}
            <section className="mb-12">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
                <p className="text-xl text-muted-foreground">
                  Discover products organized by category
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockCategories.map((category) => (
                  <Card 
                    key={category.id}
                    className="group cursor-pointer hover:shadow-lg transition-normal gradient-card overflow-hidden"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="relative">
                      <img 
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-slow"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                        <p className="text-white/90 text-sm mb-3">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-white/20 text-white">
                            {category.productCount} products
                          </Badge>
                          <ChevronRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-fast" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Featured Categories */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockCategories.slice(0, 4).map((category) => (
                  <Card 
                    key={`popular-${category.id}`}
                    className="p-4 hover:shadow-md transition-normal cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="text-center">
                      <img 
                        src={category.image}
                        alt={category.name}
                        className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
                      />
                      <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">{category.productCount} items</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Category Products View */}
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategory(null)}
                className="mb-4"
              >
                ← Back to Categories
              </Button>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{selectedCategory.name}</h1>
                  <p className="text-muted-foreground">{categoryProducts.length} products found</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background text-foreground text-sm"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <ProductGrid products={sortedProducts} />
            ) : (
              <div className="space-y-4">
                {sortedProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <img 
                          src={product.image}
                          alt={product.name}
                          className="w-full md:w-48 h-48 object-cover"
                        />
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                              <div className="flex items-center gap-4 mb-4">
                                <span className="text-2xl font-bold text-primary">${product.price}</span>
                                {product.originalPrice && (
                                  <span className="text-lg text-muted-foreground line-through">
                                    ${product.originalPrice}
                                  </span>
                                )}
                                <Badge variant={product.inStock ? 'default' : 'destructive'}>
                                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 md:ml-6">
                              <Button className="gradient-primary">
                                Order Now
                              </Button>
                              <Button variant="outline">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};