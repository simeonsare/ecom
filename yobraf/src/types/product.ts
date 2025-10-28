export interface Product {
    createdAt: string | number | Date;
  
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
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  productId?: string;
  productName?: string;
  timestamp: string;
  details?: string;
}