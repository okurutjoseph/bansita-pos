import axios from 'axios';

// Create an axios instance for WooCommerce API
const woocommerceApi = axios.create({
  baseURL: process.env.WOOCOMMERCE_URL || 'https://bansita.com/wp-json/wc/v3',
  params: {
    consumer_key: process.env.WOOCOMMERCE_CONSUMER_KEY || 'ck_6d7641137734b85184a7fc0581e6fc630646008c',
    consumer_secret: process.env.WOOCOMMERCE_CONSUMER_SECRET || 'cs_3478885befb5e76558a59dddce9792cd5ce44b66',
  },
});

// Add a response interceptor to handle errors
woocommerceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Create mock data for development when API fails
    if (error.response && error.response.status === 404) {
      const url = error.config.url;
      
      // Return mock data based on the endpoint
      if (url.includes('/products')) {
        console.log('Using mock product data due to API error');
        return Promise.resolve({
          data: Array(10).fill(null).map((_, index) => ({
            id: index + 1,
            name: `Mock Product ${index + 1}`,
            slug: `mock-product-${index + 1}`,
            permalink: `https://example.com/product/mock-product-${index + 1}`,
            date_created: new Date().toISOString(),
            type: 'simple',
            status: 'publish',
            featured: false,
            catalog_visibility: 'visible',
            description: 'This is a mock product for development',
            short_description: 'Mock product',
            sku: `SKU00${index + 1}`,
            price: `${(index + 1) * 10}.00`,
            regular_price: `${(index + 1) * 10}.00`,
            sale_price: '',
            stock_quantity: 100,
            stock_status: 'instock',
            images: [{
              id: index + 1,
              src: 'https://via.placeholder.com/300',
              alt: `Mock Product ${index + 1}`
            }],
            categories: [{
              id: 1,
              name: 'Mock Category',
              slug: 'mock-category'
            }]
          }))
        });
      } else if (url.includes('/orders')) {
        console.log('Using mock order data due to API error');
        return Promise.resolve({
          data: Array(5).fill(null).map((_, index) => ({
            id: index + 1,
            parent_id: 0,
            number: `${1000 + index}`,
            order_key: `mock_order_${index + 1}`,
            created_via: 'mock',
            status: index % 2 === 0 ? 'processing' : 'completed',
            currency: 'USD',
            date_created: new Date().toISOString(),
            date_modified: new Date().toISOString(),
            discount_total: '0.00',
            discount_tax: '0.00',
            shipping_total: '5.00',
            shipping_tax: '0.00',
            cart_tax: '0.00',
            total: `${(index + 1) * 25 + 5}.00`,
            total_tax: '0.00',
            customer_id: index + 1,
            customer_note: '',
            billing: {
              first_name: 'Mock',
              last_name: `Customer ${index + 1}`,
              company: 'Mock Company',
              address_1: '123 Mock St',
              address_2: '',
              city: 'Mock City',
              state: 'MC',
              postcode: '12345',
              country: 'US',
              email: `mock${index + 1}@example.com`,
              phone: '123-456-7890'
            },
            shipping: {
              first_name: 'Mock',
              last_name: `Customer ${index + 1}`,
              company: 'Mock Company',
              address_1: '123 Mock St',
              address_2: '',
              city: 'Mock City',
              state: 'MC',
              postcode: '12345',
              country: 'US'
            },
            line_items: [
              {
                id: index + 1,
                name: `Mock Product ${index + 1}`,
                product_id: index + 1,
                variation_id: 0,
                quantity: 2,
                tax_class: '',
                subtotal: `${(index + 1) * 20}.00`,
                subtotal_tax: '0.00',
                total: `${(index + 1) * 20}.00`,
                total_tax: '0.00',
                sku: `SKU00${index + 1}`,
                price: (index + 1) * 10
              }
            ]
          }))
        });
      } else if (url.includes('/customers')) {
        console.log('Using mock customer data due to API error');
        return Promise.resolve({
          data: Array(5).fill(null).map((_, index) => ({
            id: index + 1,
            date_created: new Date().toISOString(),
            email: `mock${index + 1}@example.com`,
            first_name: 'Mock',
            last_name: `Customer ${index + 1}`,
            username: `mock_user_${index + 1}`,
            billing: {
              first_name: 'Mock',
              last_name: `Customer ${index + 1}`,
              company: 'Mock Company',
              address_1: '123 Mock St',
              address_2: '',
              city: 'Mock City',
              state: 'MC',
              postcode: '12345',
              country: 'US',
              email: `mock${index + 1}@example.com`,
              phone: '123-456-7890'
            },
            shipping: {
              first_name: 'Mock',
              last_name: `Customer ${index + 1}`,
              company: 'Mock Company',
              address_1: '123 Mock St',
              address_2: '',
              city: 'Mock City',
              state: 'MC',
              postcode: '12345',
              country: 'US'
            }
          }))
        });
      }
    }
    
    // If not handled above, reject with the original error
    return Promise.reject(error);
  }
);

// Types for WooCommerce data
export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_quantity: number;
  stock_status: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export interface Order {
  id: number;
  parent_id: number;
  number: string;
  order_key: string;
  created_via: string;
  status: string;
  currency: string;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  customer_note: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    sku: string;
    price: number;
  }>;
}

export interface Customer {
  id: number;
  date_created: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

// API functions
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await woocommerceApi.get('/products', {
      params: {
        per_page: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const response = await woocommerceApi.get('/orders', {
      params: {
        per_page: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await woocommerceApi.get('/customers', {
      params: {
        per_page: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export interface CreateOrderData {
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  billing?: Order['billing'];
  shipping?: Order['shipping'];
  line_items: Array<{
    product_id: number;
    quantity: number;
    variation_id?: number;
  }>;
  shipping_lines?: Array<{
    method_id: string;
    method_title: string;
    total: string;
  }>;
}

export async function createOrder(orderData: CreateOrderData): Promise<Order | null> {
  try {
    const response = await woocommerceApi.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function updateOrderStatus(orderId: number, status: string): Promise<Order | null> {
  try {
    const response = await woocommerceApi.put(`/orders/${orderId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
}

export async function syncData() {
  try {
    await Promise.all([
      getProducts(),
      getOrders(),
      getCustomers(),
    ]);
    return true;
  } catch (error) {
    console.error('Error syncing data:', error);
    return false;
  }
}

export default {
  getProducts,
  getOrders,
  getCustomers,
  createOrder,
  updateOrderStatus,
  syncData,
};
