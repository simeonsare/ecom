import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { Product } from '@/types/product';

const token = localStorage.getItem("authToken");

export const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  // ✅ Fetch product
  useEffect(() => {
    if (!productId) return;

    fetch(`/api/getProduct/${productId}/`, {
      headers: { "Authorization": `Token ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then(data => {
        setFormData(data);
        setImagePreview(data.image || "");
      })
      .catch(() => {
        toast({
          title: "Error loading product",
          description: "Could not fetch product details.",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, [productId, toast]);

  // ✅ Fetch categories
  useEffect(() => {
    fetch("/api/getCategories/", {
      headers: { "Authorization": `Token ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        toast({
          title: "Error loading categories",
          description: "Unable to load category list.",
          variant: "destructive",
        });
      });
  }, [toast]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      if (formData) setFormData({ ...formData, image: "" });
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData?.name || !formData?.brand || formData?.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("price", formData.price.toString());
    formDataToSend.append("originalPrice", (formData.originalPrice || 0).toString());
    formDataToSend.append("discount", (formData.discount || 0).toString());
    formDataToSend.append("category", formData.category);
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("inStock", String(formData.inStock));
    formDataToSend.append("stockQuantity", (formData.stockQuantity || 0).toString());
    formDataToSend.append("isTodaysDeals", String(formData.isTodaysDeals));
    if (imageFile) formDataToSend.append("image", imageFile);

    try {
      const res = await fetch(`/api/updateProduct/${productId}/`, {
        method: "POST",
        body: formDataToSend,
        headers: { "Authorization": `Token ${token}` },
      });

      if (!res.ok) throw new Error("Update failed");

      toast({
        title: "Product Updated",
        description: `${formData.name} updated successfully.`,
      });
      navigate("/admin/products");
    } catch (error) {
      toast({
        title: "Error updating product",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (!formData) return <p>Product not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice || 0}
                  onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount || 0}
                  onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                />
              </div>

              {/* ✅ Dynamically fetched categories */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories found</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity || 0}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                />
              </div>

              {/* ✅ Image File Upload like Category */}
              <div className="space-y-2">
                <Label htmlFor="imageFile">Select Image File</Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
                {imagePreview && (
                  <div className="border rounded-lg overflow-hidden mt-2">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-48 object-cover"
                      onError={() => setImagePreview("")}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Enter product description..."
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="inStock">In Stock</Label>
                <p className="text-sm text-muted-foreground">Product is available for purchase</p>
              </div>
              <Switch
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="todaysDeals">Add to Today's Deals</Label>
                <p className="text-sm text-muted-foreground">Feature this product in Today's Deals section</p>
              </div>
              <Switch
                id="todaysDeals"
                checked={formData.isTodaysDeals}
                onCheckedChange={(checked) => setFormData({ ...formData, isTodaysDeals: checked })}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
                Cancel
              </Button>
              <Button type="submit" size="lg" className="gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Update Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
