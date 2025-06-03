import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coffee, User, LogIn, UserPlus, KeyRound, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgotPassword';

export const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'admin' | 'customer' | 'deliverer'>('customer');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Logged in successfully!"
      });
      
      onAuthSuccess();
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !name || !phone || !address) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            address,
            role
          }
        }
      });

      if (authError) throw authError;

      // Create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              name,
              phone,
              address,
              role
            }
          ]);

        if (profileError) throw profileError;
      }

      toast({
        title: "Success",
        description: "Account created successfully! Please check your email for verification."
      });
      
      setMode('login');
    } catch (error: any) {
      toast({
        title: "Signup Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password reset instructions sent to your email"
      });
      
      setMode('login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-chai-50 to-tea-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-chai-500 to-chai-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {mode === 'forgotPassword' ? (
              <KeyRound className="w-8 h-8 text-white" />
            ) : (
              <Coffee className="w-8 h-8 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {mode === 'login' && 'Chai Wala Login'}
            {mode === 'signup' && 'Join Chai Wala'}
            {mode === 'forgotPassword' && 'Reset Password'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'forgotPassword' && 'Enter your email to reset password'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === 'forgotPassword' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleForgotPassword}
                className="w-full bg-chai-600 hover:bg-chai-700"
                disabled={loading}
              >
                {loading ? 'Please wait...' : 'Send Reset Instructions'}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setMode('login')}
                  className="text-chai-600 hover:text-chai-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            </>
          )}

          {mode === 'login' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleLogin}
                className="w-full bg-chai-600 hover:bg-chai-700"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </>
                )}
              </Button>

              <div className="flex justify-between items-center">
                <Button
                  variant="link"
                  onClick={() => setMode('signup')}
                  className="text-chai-600 hover:text-chai-700"
                >
                  Don't have an account? Sign up
                </Button>
                <Button
                  variant="link"
                  onClick={() => setMode('forgotPassword')}
                  className="text-chai-600 hover:text-chai-700"
                >
                  Forgot Password?
                </Button>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value: 'admin' | 'customer' | 'deliverer') => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="deliverer">Deliverer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleSignup}
                className="w-full bg-chai-600 hover:bg-chai-700"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setMode('login')}
                  className="text-chai-600 hover:text-chai-700"
                >
                  Already have an account? Login
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
