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
  description?: string;
  short_description?: string;
}

// Cache for products
const productCache: Record<string, { data: Product[]; timestamp: number }> = {};
const productDetailCache: Record<number, { data: Product; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper to generate cache key from params
const generateCacheKey = (params: Record<string, string | number | boolean> = {}): string => {
  return Object.entries(params)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

export async function getProducts(params = {}): Promise<Product[]> {
  try {
    const cacheKey = generateCacheKey(params);
    const cachedData = productCache[cacheKey];
    const now = Date.now();

    // Return cached data if it exists and is not expired
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    // Fetch fresh data
    const response = await api.get<Product[]>('products', params);
    
    // Cache the response
    productCache[cacheKey] = {
      data: response.data,
      timestamp: now
    };
    
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return cached data even if expired in case of error
    const cacheKey = generateCacheKey(params);
    if (productCache[cacheKey]) {
      console.log('Returning stale cached data due to API error');
      return productCache[cacheKey].data;
    }
    
    return [];
  }
}

export async function getProduct(id: number): Promise<Product | null> {
  try {
    const cachedData = productDetailCache[id];
    const now = Date.now();

    // Return cached data if it exists and is not expired
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    // Check if the product exists in any of the list caches first
    for (const cacheKey in productCache) {
      const cachedProducts = productCache[cacheKey].data;
      const cachedProduct = cachedProducts.find(p => p.id === id);
      
      // If we find a complete product with description, use it
      if (cachedProduct && cachedProduct.description) {
        productDetailCache[id] = {
          data: cachedProduct,
          timestamp: now
        };
        return cachedProduct;
      }
    }

    // Fetch fresh data
    const response = await api.get<Product>(`products/${id}`);
    
    // Cache the response
    productDetailCache[id] = {
      data: response.data,
      timestamp: now
    };
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    
    // Return cached data even if expired in case of error
    if (productDetailCache[id]) {
      console.log(`Returning stale cached data for product ${id} due to API error`);
      return productDetailCache[id].data;
    }
    
    return null;
  }
}

// Prefetch products in the background
export function prefetchProducts(params = {}): void {
  getProducts(params).catch(error => 
    console.error('Error prefetching products:', error)
  );
}
