import { Product, Category, UserActivity } from '@/types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    description: 'Latest iPhone with advanced camera system and titanium design.',
    price: 1199,
    originalPrice: 1299,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    category: 'Smartphones',
    brand: 'Apple',
    rating: 4.8,
    reviews: 1247,
    inStock: true,
    stockQuantity: 25,
    features: ['A17 Pro chip', '48MP camera', 'Titanium design', '5G ready'],
    tags: ['popular', 'premium', 'new'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Powerful Android flagship with S Pen and incredible zoom capabilities.',
    price: 1099,
    originalPrice: 1199,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop',
    category: 'Smartphones',
    brand: 'Samsung',
    rating: 4.7,
    reviews: 892,
    inStock: true,
    stockQuantity: 18,
    features: ['S Pen included', '200MP camera', '100x zoom', 'AI features'],
    tags: ['featured', 'android'],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    name: 'MacBook Pro 14" M3',
    description: 'Professional laptop with M3 chip for creative professionals.',
    price: 1999,
    originalPrice: 2199,
    discount: 9,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    category: 'Laptops',
    brand: 'Apple',
    rating: 4.9,
    reviews: 567,
    inStock: true,
    stockQuantity: 12,
    features: ['M3 chip', '14" Liquid Retina XDR', '18-hour battery', 'Touch ID'],
    tags: ['professional', 'creative'],
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones.',
    price: 349,
    originalPrice: 399,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    category: 'Audio',
    brand: 'Sony',
    rating: 4.6,
    reviews: 2134,
    inStock: true,
    stockQuantity: 45,
    features: ['30-hour battery', 'Quick charge', 'Multipoint connection', 'Touch controls'],
    tags: ['bestseller', 'audio'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '5',
    name: 'iPad Air 11" M2',
    description: 'Versatile tablet perfect for work and creativity.',
    price: 799,
    originalPrice: 899,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop',
    category: 'Tablets',
    brand: 'Apple',
    rating: 4.7,
    reviews: 743,
    inStock: false,
    stockQuantity: 0,
    features: ['M2 chip', 'Apple Pencil Pro support', 'All-day battery', 'Ultra wide camera'],
    tags: ['creative', 'productivity'],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '6',
    name: 'Gaming Chair Pro',
    description: 'Ergonomic racing-style gaming chair with lumbar support.',
    price: 299,
    originalPrice: 349,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    category: 'Furniture',
    brand: 'GameZone',
    rating: 4.4,
    reviews: 456,
    inStock: true,
    stockQuantity: 8,
    features: ['Lumbar support', 'Adjustable armrests', 'PU leather', '360° swivel'],
    tags: ['gaming', 'comfort'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Smartphones',
    description: 'Latest mobile phones and accessories',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=150&fit=crop',
    productCount: 48
  },
  {
    id: '2',
    name: 'Laptops',
    description: 'Computers for work and gaming',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=150&fit=crop',
    productCount: 32
  },
  {
    id: '3',
    name: 'Audio',
    description: 'Headphones, speakers, and audio gear',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=150&fit=crop',
    productCount: 67
  },
  {
    id: '4',
    name: 'Tablets',
    description: 'iPads and Android tablets',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=150&fit=crop',
    productCount: 24
  },
  {
    id: '5',
    name: 'Furniture',
    description: 'Office and gaming furniture',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop',
    productCount: 156
  }
];

export const mockUserActivities: UserActivity[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'John Doe',
    action: 'Product Viewed',
    productId: '1',
    productName: 'iPhone 15 Pro Max 256GB',
    timestamp: '2024-01-15T10:30:00Z',
    details: 'Viewed product page for 2 minutes'
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Sarah Johnson',
    action: 'WhatsApp Order',
    productId: '4',
    productName: 'Sony WH-1000XM5 Headphones',
    timestamp: '2024-01-15T09:45:00Z',
    details: 'Clicked Order Now button'
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Mike Chen',
    action: 'Search Performed',
    timestamp: '2024-01-15T09:20:00Z',
    details: 'Searched for "gaming laptop"'
  },
  {
    id: '4',
    userId: 'u1',
    userName: 'John Doe',
    action: 'Category Browsed',
    timestamp: '2024-01-15T08:15:00Z',
    details: 'Browsed Smartphones category'
  },
  {
    id: '5',
    userId: 'u4',
    userName: 'Emma Wilson',
    action: 'Product Viewed',
    productId: '3',
    productName: 'MacBook Pro 14" M3',
    timestamp: '2024-01-14T16:30:00Z',
    details: 'Viewed product details and specifications'
  }
];