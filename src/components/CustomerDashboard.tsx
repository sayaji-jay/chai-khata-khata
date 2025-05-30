
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Clock, Calendar, QrCode, LogOut } from 'lucide-react';
import { User, Sale } from '@/types';

interface CustomerDashboardProps {
  user: User;
  sales: Sale[];
  onLogout: () => void;
}

export const CustomerDashboard = ({ user, sales, onLogout }: CustomerDashboardProps) => {
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(sale => sale.customerId === user.id && sale.date === today);
  const totalCupsToday = todaySales.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalSpentToday = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  
  const allUserSales = sales.filter(sale => sale.customerId === user.id);
  const totalCupsAllTime = allUserSales.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalSpentAllTime = allUserSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-chai-50 to-tea-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-chai-500 to-chai-600 rounded-lg flex items-center justify-center">
                <Coffee className="text-white font-bold text-lg" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome, {user.name}!</h1>
                <p className="text-gray-600 text-sm sm:text-base">Your chai consumption dashboard</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-chai-500 to-chai-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Today's Chai</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCupsToday} cups</div>
              <p className="text-xs opacity-90">₹{totalSpentToday} spent</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-tea-500 to-tea-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Chai</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCupsAllTime} cups</div>
              <p className="text-xs opacity-90">₹{totalSpentAllTime} total</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center">
                <QrCode className="w-4 h-4 mr-2" />
                Your QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white text-black p-2 rounded text-center font-mono text-sm">
                ID: {user.qrCode}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Chai Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-chai-600" />
              <span>Today's Chai History</span>
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
            {todaySales.length === 0 ? (
              <div className="text-center py-8">
                <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No chai today yet!</h3>
                <p className="text-gray-600">Your chai deliveries will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySales.map(sale => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-chai-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Coffee className="w-5 h-5 text-chai-600" />
                      <div>
                        <p className="font-medium text-gray-900">{sale.quantity} cups</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {sale.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{sale.totalAmount}</p>
                      <Badge variant={sale.isPaid ? "default" : "destructive"} className="text-xs">
                        {sale.isPaid ? "Paid" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-tea-600" />
              <span>Recent History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allUserSales.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No chai history yet!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allUserSales.slice(-5).reverse().map(sale => (
                  <div key={sale.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{sale.quantity} cups</p>
                      <p className="text-sm text-gray-600">
                        {new Date(sale.date).toLocaleDateString('en-IN')} at {sale.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{sale.totalAmount}</p>
                      <Badge variant={sale.isPaid ? "default" : "destructive"} className="text-xs">
                        {sale.isPaid ? "Paid" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
