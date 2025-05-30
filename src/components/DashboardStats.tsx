import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Calendar, User } from 'lucide-react';

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

interface DashboardStatsProps {
  customers: Customer[];
  sales: Sale[];
  totalRevenue: number;
  pendingPayments: number;
  totalSalesToday: Sale[];
}

export const DashboardStats = ({ 
  customers, 
  sales, 
  totalRevenue, 
  pendingPayments, 
  totalSalesToday 
}: DashboardStatsProps) => {
  const totalCupsToday = totalSalesToday.reduce((sum, sale) => sum + sale.quantity, 0);
  const todayRevenue = totalSalesToday.reduce((sum, sale) => sum + sale.totalAmount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-r from-chai-500 to-chai-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Customers</CardTitle>
          <Users className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customers.length}</div>
          <p className="text-xs opacity-90">
            Active customers registered
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-tea-500 to-tea-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Today's Sales</CardTitle>
          <Clock className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCupsToday}</div>
          <p className="text-xs opacity-90">
            Cups sold today
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
          <span className="text-lg">₹</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalRevenue}</div>
          <p className="text-xs opacity-90">
            All time earnings
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Pending Payments</CardTitle>
          <Calendar className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{pendingPayments}</div>
          <p className="text-xs opacity-90">
            Amount to collect
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
