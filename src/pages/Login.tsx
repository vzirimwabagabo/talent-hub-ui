// src/pages/Login.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Github, Linkedin, Twitter } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
// no comments
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(formData);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated floating blobs for 3D depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-hero opacity-10 blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] rounded-full bg-gradient-primary opacity-5 blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to continue your journey
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/90 border border-border/50 shadow-large hover:shadow-xl transition-all duration-500">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                labelIcon={<Mail className="h-4 w-4" />}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="animate-fade-in"
              />

              <Input
                label="Password"
                labelIcon={<Lock className="h-4 w-4" />}
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                startIcon={<Lock className="h-5 w-5" />}
                endIcon={
                  showPassword ? (
                    <EyeOff
                      className="h-5 w-5 cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      className="h-5 w-5 cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )
                }
                className="animate-fade-in"
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="sr-only" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>



              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-border"></div>
              <span className="mx-4 text-muted-foreground text-sm">or continue with</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Social Login (Placeholders) */}
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" size="icon" className="hover:bg-muted/50">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-muted/50">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-muted/50">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;