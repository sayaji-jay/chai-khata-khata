
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { clock, calendar, User } from 'lucide-react';

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

interface SalesTrackerProps {
  customers: Customer[];
  sales: Sale[];
  onAddSale: (sale: Omit<Sale, 'id' | 'date' | 'time'>) => void;
}

export const SalesTracker = ({ customers, sales, onAddSale }: SalesTrackerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    quantity: 1,
    pricePerCup: 10,
    isPaid: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerId && formData.customerName) {
      const totalAmount = formData.quantity * formData.pricePerCup;
      onAddSale({
        ...formData,
        totalAmount
      });
      setFormData({
        customerId: '',
        customerName: '',
        quantity: 1,
        pricePerCup: 10,
        isPaid: false
      });
      setIsOpen(false);
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerId,
        customerName: customer.name
      }));
    }
  };

  const groupedSales = sales.reduce((acc, sale) => {
    const date = sale.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(sale);
    return acc;
  }, {} as Record<string, Sale[]>);

  const sortedDates = Object.keys(groupedSales).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <clock className="w-5 h-5 text-tea-600" />
                <span>Sales Tracker</span>
              </CardTitle>
              <CardDescription>
                Record daily chai sales with quantity and payment status
              </CardDescription>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-tea-600 hover:bg-tea-700">
                  Record Sale
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Record New Sale</DialogTitle>
                  <DialogDescription>
                    Add chai sale details with customer information.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Select Customer *</Label>
                    <Select onValueChange={handleCustomerSelect} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity (Cups) *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Cup (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="1"
                        value={formData.pricePerCup}
                        onChange={(e) => setFormData(prev => ({ ...prev, pricePerCup: parseInt(e.target.value) || 10 }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="isPaid"
                      type="checkbox"
                      checked={formData.isPaid}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPaid: e.target.checked }))}
                      className="w-4 h-4 text-tea-600 bg-gray-100 border-gray-300 rounded focus:ring-tea-500"
                    />
                    <Label htmlFor="isPaid">Payment received</Label>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">Total Amount: ₹{formData.quantity * formData.pricePerCup}</p>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-tea-600 hover:bg-tea-700">
                      Record Sale
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">Add customers first to start recording sales.</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-12">
              <clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sales recorded yet</h3>
              <p className="text-gray-600 mb-4">Start recording your chai sales to track your business.</p>
              <Button 
                onClick={() => setIsOpen(true)}
                className="bg-tea-600 hover:bg-tea-700"
              >
                Record First Sale
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map(date => (
                <div key={date}>
                  <div className="flex items-center space-x-2 mb-3">
                    <calendar className="w-4 h-4 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {new Date(date).toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <Badge variant="outline">
                      {groupedSales[date].length} sales
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedSales[date].map(sale => (
                      <Card key={sale.id} className="border-l-4 border-l-tea-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{sale.customerName}</h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>{sale.quantity} cups × ₹{sale.pricePerCup} = ₹{sale.totalAmount}</p>
                                <p className="flex items-center space-x-1">
                                  <clock className="w-3 h-3" />
                                  <span>{sale.time}</span>
                                </p>
                              </div>
                            </div>
                            <Badge variant={sale.isPaid ? "default" : "destructive"}>
                              {sale.isPaid ? "Paid" : "Pending"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
