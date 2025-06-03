export interface Profile {
  id: string;
  name: string;
  phone: string;
  address?: string;
  role: 'admin' | 'customer' | 'deliverer';
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  join_date: string;
  created_at?: string;
}

export interface Sale {
  id: string;
  customer_id: string;
  customer_name: string;
  quantity: number;
  price_per_cup: number;
  total_amount: number;
  sale_date: string;
  sale_time: string;
  is_paid: boolean;
  paid_amount?: number;
  delivered_by?: string;
  delivered_by_name?: string;
  created_at?: string;
}

export interface Delivery {
  id: string;
  customer_id: string;
  customer_name: string;
  quantity: number;
  delivered_by: string;
  delivery_date: string;
  delivery_time: string;
  created_at?: string;
}

// Frontend types that use camelCase
export interface SaleFrontend {
  id: string;
  customerId: string;
  customerName: string;
  quantity: number;
  pricePerCup: number;
  totalAmount: number;
  date: string;
  time: string;
  isPaid: boolean;
  paidAmount?: number;
  deliveredBy?: string;
  deliveredByName?: string;
}

export interface CustomerFrontend {
  id: string;
  name: string;
  phone: string;
  address?: string;
  joinDate: string;
}

export interface DeliveryFrontend {
  id: string;
  customerId: string;
  customerName: string;
  quantity: number;
  deliveredBy: string;
  date: string;
  time: string;
}

export interface ProfileFrontend {
  id: string;
  name: string;
  phone: string;
  address?: string;
  role: 'admin' | 'customer' | 'deliverer';
  qrCode: string;
  joinDate: string;
}
