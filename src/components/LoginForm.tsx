
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Coffee } from 'lucide-react';
import { dummyUsers } from '@/data/dummyUsers';
import { User as UserType } from '@/types';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    const user = dummyUsers.find(u => u.id === selectedUserId);
    if (user && user.phone === phone) {
      onLogin(user);
    } else {
      alert('Invalid credentials! Please check user and phone number.');
    }
  };

  const getRoleUsers = (role: string) => dummyUsers.filter(u => u.role === role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-chai-50 to-tea-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-chai-500 to-chai-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Chai Wala Login</CardTitle>
          <CardDescription>Select your user and enter phone number</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">Select User</Label>
            <Select onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                <optgroup label="Admin">
                  {getRoleUsers('admin').map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </optgroup>
                <optgroup label="Customers">
                  {getRoleUsers('customer').map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </optgroup>
                <optgroup label="Deliverers">
                  {getRoleUsers('deliverer').map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </optgroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Button onClick={handleLogin} className="w-full bg-chai-600 hover:bg-chai-700">
            <User className="w-4 h-4 mr-2" />
            Login
          </Button>

          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Demo Credentials:</strong></p>
            <p>Admin: 9999999999</p>
            <p>Customers: 9876543210, 9876543211, 9876543212</p>
            <p>Deliverer: 9876543213</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
