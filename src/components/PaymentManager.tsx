import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Users } from 'lucide-react';

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

interface PaymentManagerProps {
  sales: Sale[];
  onUpdatePayment: (saleId: string, isPaid: boolean) => void;
}

export const PaymentManager = ({ sales, onUpdatePayment }: PaymentManagerProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const pendingSales = sales.filter(sale => !sale.isPaid);
  const paidSales = sales.filter(sale => sale.isPaid);

  const filteredPendingSales = pendingSales.filter(sale =>
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPaidSales = paidSales.filter(sale =>
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group pending payments by customer
  const pendingByCustomer = pendingSales.reduce((acc, sale) => {
    if (!acc[sale.customerName]) {
      acc[sale.customerName] = [];
    }
    acc[sale.customerName].push(sale);
    return acc;
  }, {} as Record<string, Sale[]>);

  const customerTotals = Object.entries(pendingByCustomer).map(([customerName, customerSales]) => ({
    customerName,
    totalAmount: customerSales.reduce((sum, sale) => sum + sale.totalAmount, 0),
    totalTransactions: customerSales.length,
    sales: customerSales
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-lg">₹</span>
            <span>Payment Management</span>
          </CardTitle>
          <CardDescription>
            Track and manage pending and completed payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="search">Search by Customer Name</Label>
            <Input
              id="search"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingSales.length})
              </TabsTrigger>
              <TabsTrigger value="paid">
                Paid ({paidSales.length})
              </TabsTrigger>
              <TabsTrigger value="summary">
                Customer Summary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {filteredPendingSales.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">💰</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No matching pending payments' : 'No pending payments'}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms.' : 'All payments are up to date!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPendingSales.map(sale => (
                    <Card key={sale.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{sale.customerName}</h4>
                            <div className="text-sm text-gray-600 space-y-1 mt-1">
                              <p>{sale.quantity} cups × ₹{sale.pricePerCup} = <span className="font-semibold">₹{sale.totalAmount}</span></p>
                              <div className="flex items-center space-x-4 text-xs">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(sale.date).toLocaleDateString('en-IN')}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{sale.time}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => onUpdatePayment(sale.id, true)}
                            className="bg-green-600 hover:bg-green-700 text-xs"
                          >
                            Mark Paid
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="paid" className="space-y-4">
              {filteredPaidSales.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">✅</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No matching paid sales' : 'No paid sales yet'}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Completed payments will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPaidSales.map(sale => (
                    <Card key={sale.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{sale.customerName}</h4>
                            <div className="text-sm text-gray-600 space-y-1 mt-1">
                              <p>{sale.quantity} cups × ₹{sale.pricePerCup} = <span className="font-semibold">₹{sale.totalAmount}</span></p>
                              <div className="flex items-center space-x-4 text-xs">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(sale.date).toLocaleDateString('en-IN')}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{sale.time}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <Badge variant="default" className="bg-green-600">
                              Paid
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onUpdatePayment(sale.id, false)}
                              className="text-xs"
                            >
                              Mark Pending
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              {customerTotals.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending payments</h3>
                  <p className="text-gray-600">All customer payments are up to date!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Customers with Pending Payments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customerTotals.map(customer => (
                      <Card key={customer.customerName} className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{customer.customerName}</h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-red-600">₹{customer.totalAmount} pending</p>
                                <p>{customer.totalTransactions} unpaid transactions</p>
                              </div>
                              <div className="mt-2 space-y-1">
                                {customer.sales.map(sale => (
                                  <div key={sale.id} className="text-xs text-gray-500 flex justify-between">
                                    <span>{new Date(sale.date).toLocaleDateString('en-IN')}</span>
                                    <span>₹{sale.totalAmount}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
