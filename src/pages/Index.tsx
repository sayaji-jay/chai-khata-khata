import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerManager } from '@/components/CustomerManager';
import { SalesTracker } from '@/components/SalesTracker';
import { PaymentManager } from '@/components/PaymentManager';
import { DashboardStats } from '@/components/DashboardStats';
import { Users, Clock, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  joinDate: string;
}

interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  quantity: number;
  pricePerCup: number;
  totalAmount: number;
  date: string;
  time: string;
  isPaid: boolean;
}

const Index = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCustomers = localStorage.getItem('chaiWalaCustomers');
    const savedSales = localStorage.getItem('chaiWalaSales');
    
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
    if (savedSales) {
      setSales(JSON.parse(savedSales));
    }
  }, []);

  // Save data to localStorage whenever customers or sales change
  useEffect(() => {
    localStorage.setItem('chaiWalaCustomers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('chaiWalaSales', JSON.stringify(sales));
  }, [sales]);

  const addCustomer = (customer: Omit<Customer, 'id' | 'joinDate'>) => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split('T')[0],
      ...customer
    };
    setCustomers(prev => [...prev, newCustomer]);
    toast({
      title: "Customer Added",
      description: `${customer.name} has been successfully onboarded!`,
    });
  };

  const addSale = (sale: Omit<Sale, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const newSale: Sale = {
      id: Date.now().toString(),
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-IN', { hour12: false }),
      ...sale
    };
    setSales(prev => [...prev, newSale]);
    toast({
      title: "Sale Recorded",
      description: `${sale.quantity} cups for ${sale.customerName} recorded successfully!`,
    });
  };

  const updatePaymentStatus = (saleId: string, isPaid: boolean) => {
    setSales(prev => prev.map(sale => 
      sale.id === saleId ? { ...sale, isPaid } : sale
    ));
    toast({
      title: isPaid ? "Payment Received" : "Payment Marked Pending",
      description: isPaid ? "Payment has been marked as received" : "Payment marked as pending",
    });
  };

  const totalSalesToday = sales.filter(sale => sale.date === new Date().toISOString().split('T')[0]);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const pendingPayments = sales.filter(sale => !sale.isPaid).reduce((sum, sale) => sum + sale.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-chai-50 to-tea-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-chai-500 to-chai-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">☕</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chai Wala Dashboard</h1>
                <p className="text-gray-600">Manage your chai business efficiently</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-IN')}</span>
              <Clock className="w-4 h-4 ml-4" />
              <span>{new Date().toLocaleTimeString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats 
            customers={customers}
            sales={sales}
            totalRevenue={totalRevenue}
            pendingPayments={pendingPayments}
            totalSalesToday={totalSalesToday}
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-chai-600" />
                    <span>Recent Customers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customers.slice(-5).reverse().map(customer => (
                      <div key={customer.id} className="flex items-center justify-between p-3 bg-chai-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-chai-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-chai-700" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            <p className="text-sm text-gray-600">{customer.phone}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-white">
                          {customer.joinDate}
                        </Badge>
                      </div>
                    ))}
                    {customers.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No customers yet. Add your first customer!</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-tea-600" />
                    <span>Today's Sales</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {totalSalesToday.slice(-5).reverse().map(sale => (
                      <div key={sale.id} className="flex items-center justify-between p-3 bg-tea-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{sale.customerName}</p>
                          <p className="text-sm text-gray-600">{sale.quantity} cups • {sale.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{sale.totalAmount}</p>
                          <Badge variant={sale.isPaid ? "default" : "destructive"} className="text-xs">
                            {sale.isPaid ? "Paid" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {totalSalesToday.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No sales today yet. Start recording!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManager customers={customers} onAddCustomer={addCustomer} />
          </TabsContent>

          <TabsContent value="sales">
            <SalesTracker customers={customers} sales={sales} onAddSale={addSale} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManager sales={sales} onUpdatePayment={updatePaymentStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
