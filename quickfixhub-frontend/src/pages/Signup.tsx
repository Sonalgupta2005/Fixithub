import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole, ServiceType } from '@/types';
import {
  Wrench,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Loader2,
  Users,
  Briefcase,
  Check
} from 'lucide-react';

const PROVIDER_SERVICE_TYPES: { label: string; value: ServiceType }[] = [
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'Carpentry', value: 'carpentry' },
  { label: 'Painting', value: 'painting' },
  { label: 'HVAC', value: 'hvac' },
  { label: 'Appliances', value: 'appliance' },
  { label: 'Cleaning', value: 'cleaning' },
  { label: 'General', value: 'general' },
];

const Signup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'homeowner';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: initialRole as UserRole,
    address: '',
    serviceTypes: [] as ServiceType[],
  });

  const { signup, isLoading} = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role,
      address: '',
      serviceTypes: [],
    }));
  };

  const toggleServiceType = (type: ServiceType) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(type)
        ? prev.serviceTypes.filter(t => t !== type)
        : [...prev.serviceTypes, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast({ title: 'Missing fields', variant: 'destructive' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    if (formData.role === 'provider') {
      if (!formData.address || formData.serviceTypes.length === 0) {
        toast({
          title: 'Provider details required',
          description: 'Service providers must select service types and address.',
          variant: 'destructive',
        });
        return;
      }
    }

    const payload: any = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role,
    };

    if (formData.role === 'provider') {
      payload.address = formData.address;
      payload.serviceTypes = formData.serviceTypes;
    }

    const success = await signup(payload);

    if (success) {
      navigate(
        formData.role === 'provider'
          ? '/provider/dashboard'
          : '/homeowner/dashboard'
      );
    } else {
      toast({
        title: 'Signup failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h1 className="text-2xl font-bold text-center mb-6">
              Create Account
            </h1>

            {/* ROLE SELECT */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => handleRoleSelect('homeowner')}
                className={`p-4 rounded-xl border-2 ${
                  formData.role === 'homeowner'
                    ? 'border-accent bg-accent/10'
                    : 'border-border'
                }`}
              >
                <Users className="mx-auto mb-2" />
                Homeowner
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('provider')}
                className={`p-4 rounded-xl border-2 ${
                  formData.role === 'provider'
                    ? 'border-accent bg-accent/10'
                    : 'border-border'
                }`}
              >
                <Briefcase className="mx-auto mb-2" />
                Provider
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" placeholder="Full Name" onChange={handleChange} />
              <Input name="email" type="email" placeholder="Email" onChange={handleChange} />
              <Input name="phone" placeholder="Phone" onChange={handleChange} />
              <Input name="password" type="password" placeholder="Password" onChange={handleChange} />
              <Input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} />

              {/* PROVIDER ONLY */}
              {formData.role === 'provider' && (
                <>
                  <Input
                    name="address"
                    placeholder="Business Address"
                    onChange={handleChange}
                  />

                  <div>
                    <Label>Services You Provide *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {PROVIDER_SERVICE_TYPES.map(s => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => toggleServiceType(s.value)}
                          className={`p-2 border rounded-lg flex items-center gap-2 ${
                            formData.serviceTypes.includes(s.value)
                              ? 'border-accent bg-accent/10'
                              : 'border-border'
                          }`}
                        >
                          {formData.serviceTypes.includes(s.value) && (
                            <Check className="w-4 h-4 text-accent" />
                          )}
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
              </Button>
            </form>

            <p className="text-center mt-4 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-accent underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
