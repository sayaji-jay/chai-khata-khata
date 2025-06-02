
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
  user_id?: string;
  name: string;
  phone: string;
  address: string;
  qr_code: string;
  join_date: string;
  created_at: string;
}

export interface Sale {
  id: string;
  customer_id: string;
  customer_name: string;
  quantity: number;
  price_per_cup: number;
  total_amount: number;
  is_paid: boolean;
  paid_amount?: number;
  delivered_by?: string;
  delivered_by_name?: string;
  created_at: string;
  sale_date: string;
  sale_time: string;
}

export interface DeliveryRecord {
  id: string;
  customer_id: string;
  customer_name: string;
  quantity: number;
  delivered_by: string;
  created_at: string;
  delivery_date: string;
  delivery_time: string;
}
