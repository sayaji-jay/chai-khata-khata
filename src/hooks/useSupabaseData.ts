import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sale, Customer, Delivery } from '@/types/database';
import { transformSaleToFrontend, transformSaleToDatabase, transformCustomerToFrontend, transformCustomerToDatabase, transformDeliveryToFrontend, transformDeliveryToDatabase } from '@/utils/dataTransformers';
import { useToast } from './use-toast';

export const useSupabaseData = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch initial data
  useEffect(() => {
    fetchCustomers();
    fetchSales();
    fetchDeliveries();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const customersSubscription = supabase
      .channel('customers-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => {
        fetchCustomers();
      })
      .subscribe();

    const salesSubscription = supabase
      .channel('sales-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, () => {
        fetchSales();
      })
      .subscribe();

    const deliveriesSubscription = supabase
      .channel('deliveries-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deliveries' }, () => {
        fetchDeliveries();
      })
      .subscribe();

    return () => {
      customersSubscription.unsubscribe();
      salesSubscription.unsubscribe();
      deliveriesSubscription.unsubscribe();
    };
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching customers",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching sales",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliveries(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching deliveries",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const addCustomer = async (customerData: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer added successfully!"
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error adding customer",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const addSale = async (saleData: Partial<Sale>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([{
          ...saleData,
          sale_date: new Date().toISOString().split('T')[0],
          sale_time: new Date().toLocaleTimeString()
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sale recorded successfully!"
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error recording sale",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const addDelivery = async (deliveryData: Partial<Delivery>) => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .insert([{
          ...deliveryData,
          delivery_date: new Date().toISOString().split('T')[0],
          delivery_time: new Date().toLocaleTimeString()
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery recorded successfully!"
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error recording delivery",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const markPaymentDone = async (saleId: string, paidAmount: number) => {
    try {
      const { error } = await supabase
        .from('sales')
        .update({
          is_paid: true,
          paid_amount: paidAmount
        })
        .eq('id', saleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment marked as done!"
      });
    } catch (error: any) {
      toast({
        title: "Error updating payment status",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    customers: customers.map(transformCustomerToFrontend),
    sales: sales.map(transformSaleToFrontend),
    deliveries: deliveries.map(transformDeliveryToFrontend),
    loading,
    addCustomer: async (data: any) => {
      const dbData = transformCustomerToDatabase(data);
      return await addCustomer(dbData);
    },
    addSale: async (data: any) => {
      const dbData = transformSaleToDatabase(data);
      return await addSale(dbData);
    },
    addDelivery: async (data: any) => {
      const dbData = transformDeliveryToDatabase(data);
      return await addDelivery(dbData);
    },
    markPaymentDone
  };
}; 