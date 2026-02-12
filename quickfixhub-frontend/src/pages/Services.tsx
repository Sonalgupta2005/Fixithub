import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Droplets, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Wind, 
  Refrigerator,
  Sparkles,
  Wrench,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const services = [
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    icon: Droplets,
    color: 'bg-blue-500',
    description: 'From leaky faucets to complete pipe installations, our certified plumbers handle all your water system needs.',
    features: ['Leak Detection & Repair', 'Drain Cleaning', 'Pipe Installation', 'Water Heater Services', 'Toilet Repairs', 'Fixture Installation'],
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    icon: Zap,
    color: 'bg-yellow-500',
    description: 'Licensed electricians for safe and reliable electrical work in your home or office.',
    features: ['Wiring & Rewiring', 'Panel Upgrades', 'Lighting Installation', 'Outlet Repairs', 'Ceiling Fan Installation', 'Safety Inspections'],
  },
  {
    id: 'carpentry',
    name: 'Carpentry Services',
    icon: Hammer,
    color: 'bg-amber-600',
    description: 'Skilled carpenters for custom woodwork, repairs, and installations.',
    features: ['Custom Furniture', 'Cabinet Installation', 'Door & Window Repair', 'Deck Building', 'Trim Work', 'Shelving Installation'],
  },
  {
    id: 'hvac',
    name: 'HVAC Services',
    icon: Wind,
    color: 'bg-cyan-500',
    description: 'Keep your home comfortable year-round with our heating and cooling experts.',
    features: ['AC Repair & Installation', 'Heating System Service', 'Duct Cleaning', 'Thermostat Installation', 'Ventilation Solutions', 'Maintenance Plans'],
  },
  {
    id: 'painting',
    name: 'Painting Services',
    icon: Paintbrush,
    color: 'bg-pink-500',
    description: 'Transform your space with professional interior and exterior painting.',
    features: ['Interior Painting', 'Exterior Painting', 'Cabinet Refinishing', 'Wallpaper Installation', 'Color Consultation', 'Surface Preparation'],
  },
  {
    id: 'appliance',
    name: 'Appliance Repair',
    icon: Refrigerator,
    color: 'bg-purple-500',
    description: 'Fast repairs for all major home appliances to keep your household running.',
    features: ['Refrigerator Repair', 'Washer/Dryer Service', 'Dishwasher Repair', 'Oven & Range Service', 'Microwave Repair', 'Garbage Disposal'],
  },
];

const Services: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBookNow = (serviceId: string) => {
    if (isAuthenticated) {
      navigate(`/homeowner/new-request?service=${serviceId}`);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(`/homeowner/new-request?service=${serviceId}`)}`);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Our Professional Services
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Browse our comprehensive range of home repair and maintenance services, all provided by verified professionals.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {service.name}
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Button variant="accent" onClick={() => handleBookNow(service.id)}>
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className={`bg-card rounded-2xl p-8 border border-border ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <h3 className="font-semibold text-foreground mb-4">What's Included:</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            Can't find what you need?
          </h2>
          <p className="text-muted-foreground mb-6">
            We also offer general handyman services for all your miscellaneous home needs.
          </p>
          <Button variant="default" size="lg" asChild>
            <Link to="/signup">
              Request Custom Service
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
