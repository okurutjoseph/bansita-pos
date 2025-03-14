import axios from 'axios';

// Create an axios instance for WooCommerce API
const woocommerceApi = axios.create({
  baseURL: process.env.WOOCOMMERCE_URL,
  params: {
    consumer_key: process.env.WOOCOMMERCE_CONSUMER_KEY,
    consumer_secret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  },
});

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
