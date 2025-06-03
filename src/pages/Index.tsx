
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerManager } from '@/components/CustomerManager';
import { SalesTracker } from '@/components/SalesTracker';
import { SimplePaymentManager } from '@/components/SimplePaymentManager';
import { DashboardStats } from '@/components/DashboardStats';
import { CustomerDashboard } from '@/components/CustomerDashboard';
import { DelivererDashboard } from '@/components/DelivererDashboard';
import { Auth } from '@/components/Auth';
import { Users, Clock, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { SaleFrontend, CustomerFrontend, DeliveryFrontend, ProfileFrontend } from '@/types/database';

const Index = () => {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const { 
    customers, 
    sales, 
    deliveries, 
    loading: dataLoading,
    addCustomer, 
    addSale, 
    addDelivery, 
    markPaymentDone 
  } = useSupabaseData();

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chai-50 to-tea-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-chai-500 to-chai-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-lg">☕</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth if no user is logged in
  if (!user || !profile) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  // Show customer dashboard for customers
  if (profile.role === 'customer') {
    return (
      <CustomerDashboard 
        user={{
          id: profile.id,
          name: profile.name,
          phone: profile.phone,
          address: profile.address || '',
          role: profile.role,
          qrCode: '',
          joinDate: profile.created_at
        }}
        sales={sales.map(sale => ({
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
          deliveredBy: sale.delivered_by || '',
          deliveredByName: sale.delivered_by_name
        }))}
        onLogout={logout} 
      />
    );
  }

  // Show deliverer dashboard for deliverers
  if (profile.role === 'deliverer') {
    return (
      <DelivererDashboard 
        user={{
          id: profile.id,
          name: profile.name,
          phone: profile.phone,
          address: profile.address || '',
          role: profile.role,
          qrCode: '',
          joinDate: profile.created_at
        }}
        deliveries={deliveries.map(delivery => ({
          id: delivery.id,
          customerId: delivery.customer_id,
          customerName: delivery.customer_name,
          quantity: delivery.quantity,
          deliveredBy: delivery.delivered_by,
          date: delivery.delivery_date,
          time: delivery.delivery_time
        }))}
        onAddDelivery={async (deliveryData) => {
          await addDelivery({
            customer_id: deliveryData.customerId,
            customer_name: deliveryData.customerName,
            quantity: deliveryData.quantity,
            delivered_by: deliveryData.deliveredBy
          });
        }}
        onLogout={logout} 
      />
    );
  }

  // Admin dashboard
  const totalSalesToday = sales.map(sale => ({
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
  })).filter(sale => sale.date === new Date().toISOString().split('T')[0]);
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.paid_amount || sale.total_amount), 0);
  const pendingPayments = sales.filter(sale => !sale.is_paid).reduce((sum, sale) => sum + sale.total_amount, 0);

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
                <p className="text-gray-600 text-sm sm:text-base">Welcome, {profile.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="text-sm">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} Mode
              </Badge>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats 
            customers={customers.map(customer => ({
              id: customer.id,
              name: customer.name,
              phone: customer.phone,
              address: customer.address,
              joinDate: customer.join_date
            }))}
            sales={sales.map(sale => ({
              id: sale.id,
              customerId: sale.customer_id,
              customerName: sale.customer_name,
              quantity: sale.quantity,
              pricePerCup: sale.price_per_cup,
              totalAmount: sale.total_amount,
              date: sale.sale_date,
              time: sale.sale_time,
              isPaid: sale.is_paid
            }))}
            totalRevenue={totalRevenue}
            pendingPayments={pendingPayments}
            totalSalesToday={totalSalesToday.map(sale => ({
              id: sale.id,
              customerId: sale.customerId,
              customerName: sale.customerName,
              quantity: sale.quantity,
              pricePerCup: sale.pricePerCup,
              totalAmount: sale.totalAmount,
              date: sale.date,
              time: sale.time,
              isPaid: sale.isPaid
            }))}
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
                    {customers.slice(0, 5).map(customer => (
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
                          {customer.join_date}
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
                    {totalSalesToday.slice(0, 5).map(sale => (
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
            <CustomerManager 
              customers={customers.map(customer => ({
                id: customer.id,
                name: customer.name,
                phone: customer.phone,
                address: customer.address,
                joinDate: customer.join_date
              }))}
              onAddCustomer={async (customerData) => {
                await addCustomer({
                  name: customerData.name,
                  phone: customerData.phone,
                  address: customerData.address,
                  join_date: new Date().toISOString().split('T')[0]
                });
              }}
            />
          </TabsContent>

          <TabsContent value="sales">
            <SalesTracker 
              customers={customers.map(customer => ({
                id: customer.id,
                name: customer.name,
                phone: customer.phone,
                address: customer.address,
                joinDate: customer.join_date
              }))}
              sales={sales.map(sale => ({
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
                deliveredBy: sale.delivered_by || '',
                deliveredByName: sale.delivered_by_name
              }))}
              onAddSale={async (saleData) => {
                await addSale({
                  customer_id: saleData.customerId,
                  customer_name: saleData.customerName,
                  quantity: saleData.quantity,
                  price_per_cup: saleData.pricePerCup,
                  total_amount: saleData.totalAmount,
                  is_paid: saleData.isPaid,
                  delivered_by: profile.id
                });
              }}
            />
          </TabsContent>

          <TabsContent value="payments">
            <SimplePaymentManager 
              sales={sales.map(sale => ({
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
                deliveredBy: sale.delivered_by || '',
                deliveredByName: sale.delivered_by_name
              }))}
              onMarkPaid={markPaymentDone}
              isAdmin={profile.role === 'admin'}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
