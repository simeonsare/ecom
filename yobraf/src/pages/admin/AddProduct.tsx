import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Upload, Save, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { toast } from 'sonner';

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    brand: '',
    stockQuantity: 0,
    inStock: true,
    isTodaysDeals: false,
    features: [],
    tags: [],
  });

  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  type Category = {
    id: number;
    name: string;
    image: string;
    active?: boolean;
  };

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/getCategories/")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const tagSuggestions = [
    'popular',
    'featured',
    'new',
    'bestseller',
    'premium',
    'gaming',
    'professional',
    'creative',
    'limited edition',
    'trending',
    'flashsale',
    'top rated',
  ];

  const handleInputChange = (field: keyof Product, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      handleInputChange('features', [...(formData.features || []), newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = formData.features?.filter((_, i) => i !== index) || [];
    handleInputChange('features', updatedFeatures);
  };

  const addTag = (tag: string) => {
    if (!formData.tags?.includes(tag)) {
      handleInputChange('tags', [...(formData.tags || []), tag]);
    }
  };

  const removeTag = (index: number) => {
    const updatedTags = formData.tags?.filter((_, i) => i !== index) || [];
    handleInputChange('tags', updatedTags);
  };
  // handle main image upload
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file); // preview only
  }
};

  //  handle multiple image files
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files);
      setImageFiles(selectedFiles);

      // preview
      const previews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const calculateDiscount = () => {
    if (formData.originalPrice && formData.price && formData.originalPrice > formData.price) {
      return Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100);
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name || "");
    form.append("description", formData.description || "");
    form.append("price", String(formData.price || 0));
    form.append("originalPrice", String(formData.originalPrice || 0));
    form.append("discount", String(calculateDiscount()));
    form.append("category", formData.category || "");
    form.append("brand", formData.brand || "");
    form.append("stockQuantity", String(formData.stockQuantity || 0));
    form.append("inStock", String(formData.inStock || true));
    form.append("isTodaysDeals", String(formData.isTodaysDeals || false));
    form.append("features", JSON.stringify(formData.features || []));
    form.append("tags", JSON.stringify(formData.tags || []));
    // ✅ append main image
    if (imageFile) {
      form.append("image", imageFile); // backend should expect "image" field
    }

    // ✅ append multiple images
    imageFiles.forEach((file) => {
      form.append("images", file); // backend should expect "images" array
    });

    try {
      const res = await fetch("/api/addProduct/", {
        method: "POST",
        body: form,
        credentials: "include",
        headers: {
          "Authorization": `Token ${localStorage.getItem("authToken")}`,
        },
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        toast.warning(errorMsg);
        console.error("Failed to save product:", errorMsg);
        return;
      }

      toast.success("Product created successfully!", {
        position: "top-center",
      });

      // wait 3 seconds before reloading to show the toast
      await new Promise(resolve => setTimeout(resolve, 3000));
      window.location.reload();
    } catch (error) {
      toast.warning(String(error));
      console.error("Error submitting product:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product listing for your store</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Product Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your product..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Brand name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Selling Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice || ''}
                    onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {calculateDiscount() > 0 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent hover:bg-accent-hover">
                    {calculateDiscount()}% OFF
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Savings: ksh{((formData.originalPrice || 0) - (formData.price || 0)).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange('stockQuantity', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => handleInputChange('inStock', checked)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg bg-accent/5">
                <Switch
                  id="isTodaysDeals"
                  checked={formData.isTodaysDeals}
                  onCheckedChange={(checked) => handleInputChange('isTodaysDeals', checked)}
                />
                <div>
                  <Label htmlFor="isTodaysDeals" className="cursor-pointer">Add to Today's Deals</Label>
                  <p className="text-sm text-muted-foreground">Feature this product on the deals page</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a product feature"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.features?.map((feature, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {feature}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeFeature(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="imageFiles">Main image</Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                />
              </div>
              <div>
                <Label htmlFor="imageFiles">Select Images</Label>
                <Input
                  id="imageFiles"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Add Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tagSuggestions.map(tag => (
                    <Badge
                      key={tag}
                      variant={formData.tags?.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add custom tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag.trim()), setNewTag(''))}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newTag.trim()) {
                        addTag(newTag.trim());
                        setNewTag('');
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
                    <Badge key={index} className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            Save Product
          </Button>
        </div>
      </form>
    </div>
  );
};
