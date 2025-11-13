import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  Filter,
  MoreHorizontal,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';


export const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch("/api/getProducts/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem("authToken")}`,
      },
    })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, []); 

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== Number(productId)));
    fetch(`/api/delete/${productId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
         "Authorization": `Token ${localStorage.getItem("authToken") || ""}`,  },
    })
    .then(res => {
      if (res.ok) {
        toast({
          title: "Product deleted",
          description: "The product has been removed successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Could not delete the product.",
          variant: "destructive",
        });
      }   
    });
  };
const edit = (productId: number) => {
    navigate(`/admin/products/edit/${productId}`);
  };  
  const handleToggleTodaysDeals = async (productId: string) => {
  const product = products.find(p => String(p.id) === productId);
  if (!product) return;

  const newValue = !product.isTodaysDeals;

  try {
    const res = await fetch(`/api/products/${productId}/toggle-deal/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("authToken") || ""}`,
        },
      body: JSON.stringify({ isTodaysDeals: newValue }),
    });

    if (!res.ok) throw new Error("Failed to update product");

    // update state only if DB update succeeded
    setProducts(products.map(p =>
      String(p.id) === productId ? { ...p, isTodaysDeals: newValue } : p
    ));

    toast({
      title: newValue ? "Added to Today's Deals" : "Removed from Today's Deals",
      description: newValue
        ? "The product is now featured in Today's Deals."
        : "The product has been removed from deals.",
    });

  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: "Could not update Today's Deals in the database.",
      variant: "destructive",
    });
  }
};



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your store inventory</p>
        </div>
        <Button className="gradient-primary" onClick={() => navigate('/admin/products/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
        <Button className="gradient-primary" onClick={() => navigate('/admin/products/flashsale')}>
          <Plus className="h-4 w-4 mr-2" />
          Flash sale
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-foreground"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-fast gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.brand} • {product.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={product.inStock ? 'default' : 'destructive'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                      {product.discount && product.discount > 0 && (
                        <Badge className="bg-accent hover:bg-accent-hover">
                          -{product.discount}%
                        </Badge>
                      )}
                      {product.isTodaysDeals && (
                        <Badge className="gradient-primary">
                          <Zap className="h-3 w-3 mr-1" />
                          Today's Deal
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                  <div className="text-right">
                    <p className="font-semibold text-lg">ksh {product.price}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        ksh{product.originalPrice}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Stock: {product.stockQuantity}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={product.isTodaysDeals ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleToggleTodaysDeals(String(product.id))}
                      
                      title={product.isTodaysDeals ? "Remove from Today's Deals" : "Add to Today's Deals"}
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => edit(product.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteProduct(String(product.id))}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-sm text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{products.filter(p => p.inStock).length}</div>
            <p className="text-sm text-muted-foreground">In Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{products.filter(p => !p.inStock).length}</div>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};