import api from '@/lib/woocommerce';

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
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
  avatar_url: string;
}

export interface CustomerParams {
  search?: string;
  per_page?: number;
  page?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
}

export async function getCustomers(params: CustomerParams = {}): Promise<Customer[]> {
  try {
    const response = await api.get<Customer[]>('customers', params);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function getCustomer(id: number): Promise<Customer | null> {
  try {
    const response = await api.get<Customer>(`customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    return null;
  }
} 