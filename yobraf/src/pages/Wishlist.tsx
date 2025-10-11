import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Eye, Trash2 } from "lucide-react";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
}

export const Wishlist = () => {
  const [wishlistItems] = useState<WishlistItem[]>([
    {
      id: "1",
      name: "Gucci duffle bag",
      price: 960,
      originalPrice: 1160,
      image: "/placeholder.svg",
      discount: 35
    },
    {
      id: "2",
      name: "RGB liquid CPU Cooler",
      price: 1960,
      image: "/placeholder.svg"
    },
    {
      id: "3",
      name: "GP11 Shooter USB Gamepad",
      price: 550,
      image: "/placeholder.svg"
    },
    {
      id: "4",
      name: "Quilted Satin Jacket",
      price: 750,
      image: "/placeholder.svg"
    }
  ]);

  const moveAllToBag = () => {
    // Handle moving all items to bag
    console.log("Moving all items to bag");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl">Wishlist ({wishlistItems.length})</h1>
        <Button variant="outline" onClick={moveAllToBag}>
          Move All To Bag
        </Button>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="group relative overflow-hidden">
            <CardContent className="p-0">
              {/* Discount Badge */}
              {item.discount && (
                <div className="absolute top-3 left-3 bg-destructive text-white px-2 py-1 text-xs rounded z-10">
                  -{item.discount}%
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                <Button size="icon" variant="outline" className="h-8 w-8 bg-white">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Product Image */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Add to Cart Button */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add To Cart
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-medium mb-2">{item.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-destructive font-bold">${item.price}</span>
                  {item.originalPrice && (
                    <span className="text-gray-500 line-through text-sm">
                      ${item.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Just For You Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-5 h-10 bg-destructive rounded"></div>
            <h2 className="text-xl font-medium">Just For You</h2>
          </div>
          <Button variant="outline">See All</Button>
        </div>

        {/* Recommended Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.slice(0, 4).map((item) => (
            <Card key={`rec-${item.id}`} className="group relative overflow-hidden">
              <CardContent className="p-0">
                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                  <Button size="icon" variant="outline" className="h-8 w-8 bg-white">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="h-8 w-8 bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Product Image */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Add to Cart Button */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add To Cart
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-medium mb-2">{item.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-destructive font-bold">${item.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      ★★★★★
                    </div>
                    <span className="text-sm text-gray-500">(88)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};