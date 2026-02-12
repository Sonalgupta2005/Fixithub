import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplets, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Wind, 
  Refrigerator,
  Sparkles,
  Wrench,
  ArrowRight
} from 'lucide-react';
import { ServiceType } from '@/types';

interface ServiceCard {
  type: ServiceType;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const services: ServiceCard[] = [
  {
    type: 'plumbing',
    name: 'Plumbing',
    description: 'Leaks, clogs, installations, and pipe repairs by certified plumbers.',
    icon: Droplets,
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    type: 'electrical',
    name: 'Electrical',
    description: 'Wiring, panel upgrades, lighting, and electrical troubleshooting.',
    icon: Zap,
    color: 'bg-yellow-500/10 text-yellow-600',
  },
  {
    type: 'carpentry',
    name: 'Carpentry',
    description: 'Custom woodwork, repairs, furniture assembly, and installations.',
    icon: Hammer,
    color: 'bg-amber-500/10 text-amber-700',
  },
  {
    type: 'painting',
    name: 'Painting',
    description: 'Interior and exterior painting, touch-ups, and wallpaper services.',
    icon: Paintbrush,
    color: 'bg-pink-500/10 text-pink-600',
  },
  {
    type: 'hvac',
    name: 'HVAC',
    description: 'Heating, cooling, ventilation repair, and maintenance services.',
    icon: Wind,
    color: 'bg-cyan-500/10 text-cyan-600',
  },
  {
    type: 'appliance',
    name: 'Appliances',
    description: 'Washer, dryer, refrigerator, and all appliance repairs.',
    icon: Refrigerator,
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    type: 'cleaning',
    name: 'Deep Cleaning',
    description: 'Professional cleaning services for homes and offices.',
    icon: Sparkles,
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    type: 'general',
    name: 'General Repairs',
    description: 'Handyman services for all your miscellaneous home needs.',
    icon: Wrench,
    color: 'bg-slate-500/10 text-slate-600',
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
            Expert Solutions for Every Home Need
          </h2>
          <p className="text-muted-foreground text-lg">
            From quick fixes to major repairs, our verified professionals handle it all with precision and care.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={service.type}
              to={`/signup?service=${service.type}`}
              className="group bg-card rounded-xl p-6 border border-border card-hover opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
                {service.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
              <div className="mt-4 flex items-center text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Book Now <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
