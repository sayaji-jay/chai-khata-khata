
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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
  paidAmount?: number;
}

interface SimplePaymentManagerProps {
  sales: Sale[];
  onMarkPaid: (saleId: string, paidAmount: number) => void;
  isAdmin: boolean;
}

export const SimplePaymentManager = ({ sales, onMarkPaid, isAdmin }: SimplePaymentManagerProps) => {
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const pendingSales = sales.filter(sale => !sale.isPaid);
  const totalPending = pendingSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  const handlePaymentDone = (sale: Sale) => {
    const amountStr = paymentAmounts[sale.id] || sale.totalAmount.toString();
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    onMarkPaid(sale.id, amount);
    setPaymentAmounts(prev => ({ ...prev, [sale.id]: '' }));
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>View your payment status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">Only admin can manage payments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Management (Admin)</CardTitle>
          <CardDescription>
            Total Pending: ₹{totalPending} ({pendingSales.length} transactions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingSales.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">✅</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Payments Done!</h3>
              <p className="text-gray-600">No pending payments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSales.map(sale => (
                <Card key={sale.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{sale.customerName}</h4>
                        <p className="text-sm text-gray-600">
                          {sale.quantity} cups × ₹{sale.pricePerCup} = ₹{sale.totalAmount}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(sale.date).toLocaleDateString('en-IN')} at {sale.time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div>
                          <Label htmlFor={`amount-${sale.id}`} className="text-xs">Amount Received</Label>
                          <Input
                            id={`amount-${sale.id}`}
                            type="number"
                            placeholder={sale.totalAmount.toString()}
                            value={paymentAmounts[sale.id] || ''}
                            onChange={(e) => setPaymentAmounts(prev => ({ 
                              ...prev, 
                              [sale.id]: e.target.value 
                            }))}
                            className="w-24 text-sm"
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handlePaymentDone(sale)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Payment Done
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
