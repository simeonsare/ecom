import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const cookieTrimmed = cookie.trim();
      if (cookieTrimmed.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookieTrimmed.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");


interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export const AddCategory: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    description: "",
    image: "",
    productCount: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleInputChange = (field: keyof Category, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      handleInputChange("image", ""); // clear URL field as file is selected
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name || "");
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append(
      "productCount",
      formData.productCount?.toString() || "0"
    );
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    try {
      const res = await fetch("/api/addCategories/", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
        headers: {
          "X-CSRFToken": csrftoken || "",
        },

        // NOTE: Do NOT set Content-Type header with FormData
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        console.error("Failed to save category:", errorMsg);
        return;
      }

      console.log("Category added successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add New Category</h1>
          <p className="text-muted-foreground">
            Create a new category for your store
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/categories")}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe this category..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="productCount">Product Count *</Label>
                <Input
                  id="productCount"
                  type="number"
                  min="0"
                  value={formData.productCount}
                  onChange={(e) =>
                    handleInputChange("productCount", parseInt(e.target.value))
                  }
                  placeholder="0"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="imageFile">Select Image File</Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
              </div>

              {imagePreview && (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-full h-48 object-cover"
                    onError={() => setImagePreview("")}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            Save Category
          </Button>
        </div>
      </form>
    </div>
  );
};
