export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating: number;
  featured: boolean;
  stock: number;
  slug: string;
  sku: string;
  isActive: boolean;
}

