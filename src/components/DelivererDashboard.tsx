
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Coffee, Scan, Plus, Clock, Package, LogOut, User } from 'lucide-react';
import { User as UserType, DeliveryRecord } from '@/types';
import { dummyUsers } from '@/data/dummyUsers';
import { useToast } from '@/hooks/use-toast';

interface DelivererDashboardProps {
  user: UserType;
  deliveries: DeliveryRecord[];
  onAddDelivery: (delivery: Omit<DeliveryRecord, 'id' | 'date' | 'time'>) => void;
  onLogout: () => void;
}

export const DelivererDashboard = ({ user, deliveries, onAddDelivery, onLogout }: DelivererDashboardProps) => {
  const [customerId, setCustomerId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [foundCustomer, setFoundCustomer] = useState<UserType | null>(null);
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const todayDeliveries = deliveries.filter(d => d.deliveredBy === user.id && d.date === today);
  const totalDeliveredToday = todayDeliveries.reduce((sum, d) => sum + d.quantity, 0);

  const handleScanOrSearch = () => {
    const customer = dummyUsers.find(u => u.role === 'customer' && (u.qrCode === customerId || u.id === customerId));
    if (customer) {
      setFoundCustomer(customer);
      toast({
        title: "Customer Found",
        description: `${customer.name} - ${customer.phone}`,
      });
    } else {
      setFoundCustomer(null);
      toast({
        title: "Customer Not Found",
        description: "Please check the ID or QR code",
        variant: "destructive"
      });
    }
  };

  const handleDelivery = () => {
    if (foundCustomer && quantity > 0) {
      onAddDelivery({
        customerId: foundCustomer.id,
        customerName: foundCustomer.name,
        quantity,
        deliveredBy: user.id
      });
      
      setCustomerId('');
      setQuantity(1);
      setFoundCustomer(null);
      
      toast({
        title: "Delivery Recorded",
        description: `${quantity} cups delivered to ${foundCustomer.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-chai-50 to-tea-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-tea-500 to-tea-600 rounded-lg flex items-center justify-center">
                <Package className="text-white font-bold text-lg" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Chai Deliverer</h1>
                <p className="text-gray-600 text-sm sm:text-base">Welcome, {user.name}</p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Today's Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-tea-500 to-tea-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Today's Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDeliveredToday} cups</div>
              <p className="text-xs opacity-90">{todayDeliveries.length} transactions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">Active</div>
              <p className="text-xs opacity-90">Ready for deliveries</p>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Scan className="w-5 h-5 text-tea-600" />
              <span>Record Delivery</span>
            </CardTitle>
            <CardDescription>Scan QR code or enter customer ID manually</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Label htmlFor="customer-id">Customer ID / QR Code</Label>
                <Input
                  id="customer-id"
                  placeholder="Enter ID or scan QR code"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                />
              </div>
              <div className="sm:self-end">
                <Button onClick={handleScanOrSearch} variant="outline" className="w-full sm:w-auto">
                  <Scan className="w-4 h-4 mr-2" />
                  Find Customer
                </Button>
              </div>
            </div>

            {foundCustomer && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">{foundCustomer.name}</p>
                    <p className="text-sm text-green-700">{foundCustomer.phone}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity (Cups)</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="sm:self-end">
                <Button 
                  onClick={handleDelivery} 
                  disabled={!foundCustomer}
                  className="w-full bg-tea-600 hover:bg-tea-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Record Delivery
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Customer IDs:</strong></p>
              <p>Rahul: cust-001, Priya: cust-002, Amit: cust-003</p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-chai-600" />
              <span>Today's Deliveries</span>
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayDeliveries.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries yet today</h3>
                <p className="text-gray-600">Start recording chai deliveries!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayDeliveries.reverse().map(delivery => (
                  <div key={delivery.id} className="flex items-center justify-between p-3 bg-tea-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Coffee className="w-5 h-5 text-tea-600" />
                      <div>
                        <p className="font-medium text-gray-900">{delivery.customerName}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {delivery.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-tea-600">
                      {delivery.quantity} cups
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
