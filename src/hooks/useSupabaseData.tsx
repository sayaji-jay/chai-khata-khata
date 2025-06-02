
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Customer, Sale, DeliveryRecord } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseData = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [customersRes, salesRes, deliveriesRes] = await Promise.all([
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('sales').select('*').order('created_at', { ascending: false }),
        supabase.from('delivery_records').select('*').order('created_at', { ascending: false })
      ]);

      if (customersRes.error) throw customersRes.error;
      if (salesRes.error) throw salesRes.error;
      if (deliveriesRes.error) throw deliveriesRes.error;

      setCustomers(customersRes.data || []);
      setSales(salesRes.data || []);
      setDeliveries(deliveriesRes.data || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add customer
  const addCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'qr_code'>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;

      setCustomers(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: `Customer ${customerData.name} added successfully!`
      });
      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add customer",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  // Add sale
  const addSale = async (saleData: Omit<Sale, 'id' | 'created_at' | 'sale_date' | 'sale_time'>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([saleData])
        .select()
        .single();

      if (error) throw error;

      setSales(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: `Sale recorded for ${saleData.customer_name}!`
      });
      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add sale",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  // Add delivery
  const addDelivery = async (deliveryData: Omit<DeliveryRecord, 'id' | 'created_at' | 'delivery_date' | 'delivery_time'>) => {
    try {
      const { data, error } = await supabase
        .from('delivery_records')
        .insert([deliveryData])
        .select()
        .single();

      if (error) throw error;

      // Also create a sale record for the delivery
      const saleData = {
        customer_id: deliveryData.customer_id,
        customer_name: deliveryData.customer_name,
        quantity: deliveryData.quantity,
        price_per_cup: 10.00,
        total_amount: deliveryData.quantity * 10.00,
        is_paid: false,
        delivered_by: deliveryData.delivered_by
      };

      await addSale(saleData);
      setDeliveries(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: `Delivery recorded for ${deliveryData.customer_name}!`
      });
      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add delivery",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  // Mark payment as done
  const markPaymentDone = async (saleId: string, paidAmount: number) => {
    try {
      const { error } = await supabase
        .from('sales')
        .update({ is_paid: true, paid_amount: paidAmount })
        .eq('id', saleId);

      if (error) throw error;

      setSales(prev => prev.map(sale => 
        sale.id === saleId 
          ? { ...sale, is_paid: true, paid_amount: paidAmount }
          : sale
      ));

      toast({
        title: "Success",
        description: `Payment of ₹${paidAmount} marked as done!`
      });
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  return {
    customers,
    sales,
    deliveries,
    loading,
    addCustomer,
    addSale,
    addDelivery,
    markPaymentDone,
    refetch: fetchData
  };
};
