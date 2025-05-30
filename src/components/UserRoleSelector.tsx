
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Users } from 'lucide-react';

interface UserRoleSelectorProps {
  currentRole: 'user' | 'admin';
  onRoleChange: (role: 'user' | 'admin') => void;
}

export const UserRoleSelector = ({ currentRole, onRoleChange }: UserRoleSelectorProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Select Role</span>
          <Badge variant={currentRole === 'admin' ? 'default' : 'secondary'}>
            {currentRole === 'admin' ? 'Admin' : 'User'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Switch between user and admin roles to test the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Button
            variant={currentRole === 'user' ? 'default' : 'outline'}
            onClick={() => onRoleChange('user')}
            className="flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>User</span>
          </Button>
          <Button
            variant={currentRole === 'admin' ? 'default' : 'outline'}
            onClick={() => onRoleChange('admin')}
            className="flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Admin</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
