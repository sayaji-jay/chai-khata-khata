import { Sale, SaleFrontend, Customer, CustomerFrontend, Delivery, DeliveryFrontend } from '@/types/database';

export const transformSaleToFrontend = (sale: Sale): SaleFrontend => ({
  id: sale.id,
  customerId: sale.customer_id,
  customerName: sale.customer_name,
  quantity: sale.quantity,
  pricePerCup: sale.price_per_cup,
  totalAmount: sale.total_amount,
  date: sale.sale_date,
  time: sale.sale_time,
  isPaid: sale.is_paid,
  paidAmount: sale.paid_amount,
  deliveredBy: sale.delivered_by,
  deliveredByName: sale.delivered_by_name
});

export const transformSaleToDatabase = (sale: Partial<SaleFrontend>): Partial<Sale> => ({
  customer_id: sale.customerId,
  customer_name: sale.customerName,
  quantity: sale.quantity,
  price_per_cup: sale.pricePerCup,
  total_amount: sale.totalAmount,
  sale_date: sale.date,
  sale_time: sale.time,
  is_paid: sale.isPaid,
  paid_amount: sale.paidAmount,
  delivered_by: sale.deliveredBy,
  delivered_by_name: sale.deliveredByName
});

export const transformCustomerToFrontend = (customer: Customer): CustomerFrontend => ({
  id: customer.id,
  name: customer.name,
  phone: customer.phone,
  address: customer.address,
  joinDate: customer.join_date
});

export const transformCustomerToDatabase = (customer: Partial<CustomerFrontend>): Partial<Customer> => ({
  name: customer.name,
  phone: customer.phone,
  address: customer.address,
  join_date: customer.joinDate
});

export const transformDeliveryToFrontend = (delivery: Delivery): DeliveryFrontend => ({
  id: delivery.id,
  customerId: delivery.customer_id,
  customerName: delivery.customer_name,
  quantity: delivery.quantity,
  deliveredBy: delivery.delivered_by,
  date: delivery.delivery_date,
  time: delivery.delivery_time
});

export const transformDeliveryToDatabase = (delivery: Partial<DeliveryFrontend>): Partial<Delivery> => ({
  customer_id: delivery.customerId,
  customer_name: delivery.customerName,
  quantity: delivery.quantity,
  delivered_by: delivery.deliveredBy,
  delivery_date: delivery.date,
  delivery_time: delivery.time
}); 