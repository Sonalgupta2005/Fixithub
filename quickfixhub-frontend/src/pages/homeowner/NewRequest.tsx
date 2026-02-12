import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ServiceType } from '@/types';
import {
  Droplets,
  Zap,
  Hammer,
  Paintbrush,
  Wind,
  Refrigerator,
  Sparkles,
  Wrench,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  Loader2,
  Send
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const serviceTypes: { type: ServiceType; name: string; icon: React.ElementType }[] = [
  { type: 'plumbing', name: 'Plumbing', icon: Droplets },
  { type: 'electrical', name: 'Electrical', icon: Zap },
  { type: 'carpentry', name: 'Carpentry', icon: Hammer },
  { type: 'painting', name: 'Painting', icon: Paintbrush },
  { type: 'hvac', name: 'HVAC', icon: Wind },
  { type: 'appliance', name: 'Appliances', icon: Refrigerator },
  { type: 'cleaning', name: 'Cleaning', icon: Sparkles },
  { type: 'general', name: 'General', icon: Wrench },
];

const NewRequest: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') as ServiceType | null;

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    serviceType: initialService || '' as ServiceType | '',
    description: '',
    address: '',
    phone: user?.phone || '',
    preferredDate: '',
    preferredTime: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleServiceSelect = (type: ServiceType) => {
    setFormData(prev => ({ ...prev, serviceType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.serviceType ||
      !formData.description ||
      !formData.address ||
      !formData.preferredDate
    ) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/service/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          serviceType: formData.serviceType,
          description: formData.description,
          address: formData.address,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit request');
      }

      toast({
        title: 'Request Submitted!',
        description:
          'Your service request has been submitted. Providers will be notified.',
      });

      navigate('/homeowner/dashboard');
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate('/homeowner/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="bg-card rounded-2xl border border-border p-8">
            <h1 className="font-display text-2xl font-bold mb-2">
              Request a Service
            </h1>
            <p className="text-muted-foreground mb-8">
              Tell us what you need and we’ll connect you with the right
              professional.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Service Type */}
              <div className="space-y-3">
                <Label>Select Service Type *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {serviceTypes.map(({ type, name, icon: Icon }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleServiceSelect(type)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.serviceType === type
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-xs font-medium">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Describe the Issue *</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              {/* Address */}
              <div>
                <Label>Service Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5" />
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Phone (read-only snapshot helper) */}
              {/* <div>
                <Label>Contact Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5" />
                  <Input
                    name="phone"
                    value={formData.phone}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
              </div> */}

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preferred Date *</Label>
                  <Input
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label>Preferred Time</Label>
                  <Input
                    name="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewRequest;
