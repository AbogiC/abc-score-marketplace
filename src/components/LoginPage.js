import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Music, Users, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Welcome back! Successfully logged in.');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(email, password, fullName);
      toast.success('Account created successfully! Welcome to the marketplace.');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Music className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold gradient-text font-crimson">
              Sheet Music Marketplace
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-montserrat">
            Discover, learn, and share beautiful sheet music with musicians worldwide
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-xl glass">
            <Music className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2 font-crimson">Vast Library</h3>
            <p className="text-slate-600">Browse thousands of sheet music pieces across all genres</p>
          </div>
          <div className="text-center p-6 rounded-xl glass">
            <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2 font-crimson">Learn Theory</h3>
            <p className="text-slate-600">Master music theory with interactive lessons and exercises</p>
          </div>
          <div className="text-center p-6 rounded-xl glass">
            <Users className="w-8 h-8 text-pink-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2 font-crimson">Community</h3>
            <p className="text-slate-600">Connect with fellow musicians and share your passion</p>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="max-w-md mx-auto">
          <Card className="backdrop-blur-sm bg-white/80 border-white/50 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-crimson">Welcome</CardTitle>
              <CardDescription>Sign in to your account or create a new one</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full btn-animated bg-indigo-600 hover:bg-indigo-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="registerEmail">Email</Label>
                      <Input
                        id="registerEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="registerPassword">Password</Label>
                      <Input
                        id="registerPassword"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full btn-animated bg-purple-600 hover:bg-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;