// src/pages/Register.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Mail,
  Lock,
  Heart,
  Users,
  Eye,
  EyeOff,
  Check,
  X,
} from 'lucide-react';
import type { RegisterableRole, SupporterType } from '@/types/auth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

// 🔒 Password validation helper
const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= minLength;

  return {
    valid: isLongEnough && hasUpperCase && hasLowerCase && hasNumbers && hasSymbols,
    errors: {
      minLength: !isLongEnough,
      hasUpperCase: !hasUpperCase,
      hasLowerCase: !hasLowerCase,
      hasNumbers: !hasNumbers,
      hasSymbols: !hasSymbols,
    },
  };
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'participant' as RegisterableRole,
    supporterType: null as SupporterType,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<{
    valid: boolean;
    errors: Record<string, boolean>;
  } | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Real-time password validation
  useEffect(() => {
    if (formData.password) {
      setPasswordValidation(validatePassword(formData.password));
    } else {
      setPasswordValidation(null);
    }
  }, [formData.password]);

  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validatePassword(formData.password);
    if (!validation.valid) {
      setError('Password does not meet security requirements.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const submitData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      supporterType: formData.role === 'supporter' ? formData.supporterType : null,
    };

    const result = await register(submitData);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
  };

  // Role Option Component (reused)
  const RoleOption = ({
    role,
    icon: Icon,
    label,
    active,
    onClick,
  }: {
    role: RegisterableRole;
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <Button
      type="button"
      variant={active ? 'default' : 'outline'}
      onClick={onClick}
      className="flex flex-col h-auto p-4 rounded-xl"
    >
      <Icon className="h-6 w-6 mb-2" />
      <span className="font-medium">{label}</span>
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/3 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-hero opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-primary opacity-5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create Your Account
          </h1>
          <p className="text-muted-foreground mt-2">
            Join our community and unlock new opportunities
          </p>
        </div>

        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                labelIcon={<User className="h-4 w-4" />}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />

              <Input
                label="Email Address"
                labelIcon={<Mail className="h-4 w-4" />}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                required
              />

              {/* Password with real-time validation */}
              <div className="space-y-2">
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
                  // Show error only on submit or if user types something invalid
                  error={
                    formData.password && passwordValidation && !passwordValidation.valid
                      ? 'Password does not meet requirements'
                      : ''
                  }
                />

                {/* Real-time validation checklist (optional but helpful) */}
                {formData.password && (
                  <div className="text-xs space-y-1">
                    {[
                      { key: 'minLength', label: 'At least 8 characters', valid: !passwordValidation?.errors.minLength },
                      { key: 'hasUpperCase', label: 'One uppercase letter', valid: !passwordValidation?.errors.hasUpperCase },
                      { key: 'hasLowerCase', label: 'One lowercase letter', valid: !passwordValidation?.errors.hasLowerCase },
                      { key: 'hasNumbers', label: 'One number', valid: !passwordValidation?.errors.hasNumbers },
                      { key: 'hasSymbols', label: 'One symbol (!@#$%^&*)', valid: !passwordValidation?.errors.hasSymbols },
                    ].map(({ key, label, valid }) => (
                      <div key={key} className="flex items-center">
                        {valid ? (
                          <Check className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-destructive mr-1" />
                        )}
                        <span className={valid ? 'text-green-500' : 'text-muted-foreground'}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                labelIcon={<Lock className="h-4 w-4" />}
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
                startIcon={<Lock className="h-5 w-5" />}
                endIcon={
                  showConfirmPassword ? (
                    <EyeOff
                      className="h-5 w-5 cursor-pointer"
                      onClick={() => setShowConfirmPassword(false)}
                    />
                  ) : (
                    <Eye
                      className="h-5 w-5 cursor-pointer"
                      onClick={() => setShowConfirmPassword(true)}
                    />
                  )
                }
                error={formData.confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''}
              />

              {/* Role & Supporter Type (unchanged) */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground">I am a...</h3>
                <div className="grid grid-cols-2 gap-3">
                  <RoleOption
                    role="participant"
                    icon={Users}
                    label="Participant"
                    active={formData.role === 'participant'}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        role: 'participant',
                        supporterType: null,
                      })
                    }
                  />
                  <RoleOption
                    role="supporter"
                    icon={Heart}
                    label="Supporter"
                    active={formData.role === 'supporter'}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        role: 'supporter',
                        supporterType: 'donor',
                      })
                    }
                  />
                </div>
              </div>

              {formData.role === 'supporter' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Supporter Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['employer', 'donor', 'volunteer'] as const).map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={formData.supporterType === type ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setFormData({ ...formData, supporterType: type })
                        }
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !passwordValidation?.valid || !passwordsMatch}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;