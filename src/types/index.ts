export interface User {
  id: string;
  name: string;
  phone: string;
  address: string;
  role: 'admin' | 'customer' | 'deliverer';
  qrCode: string;
  joinDate: string;
}

export interface Sale {
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
  deliveredBy: string;
  deliveredByName?: string;
}

export interface DeliveryRecord {
  id: string;
  customerId: string;
  customerName: string;
  quantity: number;
  deliveredBy: string;
  date: string;
  time: string;
}
