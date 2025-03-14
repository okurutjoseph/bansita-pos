import api from '@/lib/woocommerce';

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  regular_price: string;
  stock_quantity: number;
  images: { id: number; src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
}

export async function getProducts(params = {}): Promise<Product[]> {
  try {
    const response = await api.get('products', params);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(id: number): Promise<Product | null> {
  try {
    const response = await api.get(`products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
} 