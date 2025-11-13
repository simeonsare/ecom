import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ToastAction } from "@radix-ui/react-toast";
import { toast } from "sonner";
import { fromTheme } from "tailwind-merge";



interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  email: string;
}
const token = localStorage.getItem("authToken");


export const AddStore: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Store>>({
    name: "",
    description: "",
    logo: "",
    email: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleInputChange = (field: keyof Store, value: unknown) => {
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
      handleInputChange("logo", ""); // clear URL field as file is selected
    } else {
      setImagePreview("");
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name || "");
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("email", formData.email || "");
  
    if (imageFile) {
      formDataToSend.append("logo", imageFile);
    }

    try {
      const res = await fetch("/api/create_store/", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
        headers: {
          "Authorization": `Token ${token}`
                                
          
        },

        // NOTE: Do NOT set Content-Type header with FormData
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        toast.warning(errorMsg)
        console.error("Failed to save Store:", errorMsg);
        return;
      }
       toast.success("Store created successfully! Please add products.", {
        position: "top-center",
      });
      navigate("/admin");
    } catch (error) {
      
      toast.warning(error)

    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add New Store</h1>
          <p className="text-muted-foreground">
            Create a new Store for your store
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin")}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Store Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter Store name"
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
                  placeholder="Describe this Store..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter Store email"
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
              <CardTitle>Store Image</CardTitle>
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
                    alt="Store preview"
                    className="w-full h-48 object-cover"
                    onError={() => setImagePreview("")}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            Save Store
          </Button>
        </div>
      </form>
    </div>
  );
};
