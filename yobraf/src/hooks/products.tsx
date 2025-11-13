import { useState, useEffect } from "react";

export type Product = {
  colors: string[];
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockQuantity: number;
  features?: string[];
  tags?: string[];
  isTodaysDeals?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isTopRated?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
};

export function useProducts(): Product[] {
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

  return products;
}
