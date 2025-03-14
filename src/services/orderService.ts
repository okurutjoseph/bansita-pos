import api from '@/lib/woocommerce';

export interface LineItem {
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
  taxes: Array<{
    id: number;
    total: string;
    subtotal: string;
  }>;
  meta_data: Array<{
    id: number;
    key: string;
    value: string;
  }>;
  sku: string;
  price: number;
  image: {
    id: string;
    src: string;
  };
}

export interface Order {
  id: number;
  parent_id: number;
  number: string;
  order_key: string;
  created_via: string;
  version: string;
  status: string;
  currency: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  prices_include_tax: boolean;
  customer_id: number;
  customer_ip_address: string;
  customer_user_agent: string;
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
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  line_items: LineItem[];
}

export interface CreateOrderData {
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  billing?: Order['billing'];
  shipping?: Order['shipping'];
  customer_id?: number;
  customer_note?: string;
  line_items: Array<{
    product_id: number;
    quantity: number;
    variation_id?: number;
    price?: number;
  }>;
  shipping_lines?: Array<{
    method_id: string;
    method_title: string;
    total: string;
  }>;
}

export interface OrderParams {
  status?: string;
  customer?: number;
  per_page?: number;
  page?: number;
  search?: string;
  after?: string;
  before?: string;
  order?: 'asc' | 'desc';
  orderby?: string;
}

export async function getOrders(params: OrderParams = {}): Promise<Order[]> {
  try {
    const response = await api.get<Order[]>('orders', params);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getOrder(id: number): Promise<Order | null> {
  try {
    const response = await api.get<Order>(`orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    return null;
  }
}

export async function createOrder(orderData: CreateOrderData): Promise<Order | null> {
  try {
    const response = await api.post<Order>('orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
} 