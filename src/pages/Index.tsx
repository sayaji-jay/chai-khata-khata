
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerManager } from '@/components/CustomerManager';
import { SalesTracker } from '@/components/SalesTracker';
import { SimplePaymentManager } from '@/components/SimplePaymentManager';
import { UserRoleSelector } from '@/components/UserRoleSelector';
import { DashboardStats } from '@/components/DashboardStats';
import { LoginForm } from '@/components/LoginForm';
import { CustomerDashboard } from '@/components/CustomerDashboard';
import { DelivererDashboard } from '@/components/DelivererDashboard';
import { Users, Clock, Calendar, User, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User as UserType, Sale, DeliveryRecord } from '@/types';
import { dummyUsers } from '@/data/dummyUsers';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  joinDate: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('admin');
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCustomers = localStorage.getItem('chaiWalaCustomers');
    const savedSales = localStorage.getItem('chaiWalaSales');
    const savedDeliveries = localStorage.getItem('chaiWalaDeliveries');
    const savedUser = localStorage.getItem('chaiWalaCurrentUser');
    const savedRole = localStorage.getItem('chaiWalaUserRole');
    
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      // Convert dummy users to customers format
      const customerData = dummyUsers
        .filter(u => u.role === 'customer')
        .map(u => ({ 
          id: u.id, 
          name: u.name, 
          phone: u.phone, 
          address: u.address, 
          joinDate: u.joinDate 
        }));
      setCustomers(customerData);
    }
    
    if (savedSales) {
      setSales(JSON.parse(savedSales));
    }
    
    if (savedDeliveries) {
      setDeliveries(JSON.parse(savedDeliveries));
    }
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    if (savedRole) {
      setUserRole(savedRole as 'user' | 'admin');
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('chaiWalaCustomers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('chaiWalaSales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('chaiWalaDeliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('chaiWalaCurrentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('chaiWalaUserRole', userRole);
  }, [userRole]);

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setUserRole('admin');
    } else {
      setUserRole('user');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('chaiWalaCurrentUser');
  };

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

  const addDelivery = (delivery: Omit<DeliveryRecord, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const newDelivery: DeliveryRecord = {
      id: Date.now().toString(),
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-IN', { hour12: false }),
      ...delivery
    };
    setDeliveries(prev => [...prev, newDelivery]);
    
    // Also add to sales
    const newSale: Sale = {
      id: Date.now().toString() + '-sale',
      customerId: delivery.customerId,
      customerName: delivery.customerName,
      quantity: delivery.quantity,
      pricePerCup: 10,
      totalAmount: delivery.quantity * 10,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-IN', { hour12: false }),
      isPaid: false,
      deliveredBy: delivery.deliveredBy
    };
    setSales(prev => [...prev, newSale]);
  };

  const markPaymentDone = (saleId: string, paidAmount: number) => {
    setSales(prev => prev.map(sale => 
      sale.id === saleId ? { ...sale, isPaid: true, paidAmount } : sale
    ));
    toast({
      title: "Payment Done",
      description: `Payment of ₹${paidAmount} received and marked as done`,
    });
  };

  // Show login if no user is logged in
  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Show customer dashboard for customers
  if (currentUser.role === 'customer') {
    return (
      <CustomerDashboard 
        user={currentUser} 
        sales={sales} 
        onLogout={handleLogout} 
      />
    );
  }

  // Show deliverer dashboard for deliverers
  if (currentUser.role === 'deliverer') {
    return (
      <DelivererDashboard 
        user={currentUser} 
        deliveries={deliveries} 
        onAddDelivery={addDelivery}
        onLogout={handleLogout} 
      />
    );
  }

  // Admin dashboard (existing code)
  const totalSalesToday = sales.filter(sale => sale.date === new Date().toISOString().split('T')[0]);
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.paidAmount || sale.totalAmount), 0);
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Chai Wala Dashboard</h1>
                <p className="text-gray-600 text-sm sm:text-base">Welcome, {currentUser.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="text-sm">
                {userRole === 'admin' ? 'Admin Mode' : 'User Mode'}
              </Badge>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* User Role Selector */}
        <UserRoleSelector currentRole={userRole} onRoleChange={setUserRole} />

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
            {userRole === 'admin' ? (
              <CustomerManager customers={customers} onAddCustomer={addCustomer} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Customers</CardTitle>
                  <CardDescription>Only admin can manage customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-600">Switch to admin mode to manage customers</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sales">
            {userRole === 'admin' ? (
              <SalesTracker customers={customers} sales={sales} onAddSale={addSale} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Sales</CardTitle>
                  <CardDescription>Only admin can record sales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-600">Switch to admin mode to record sales</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="payments">
            <SimplePaymentManager 
              sales={sales} 
              onMarkPaid={markPaymentDone} 
              isAdmin={userRole === 'admin'}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
