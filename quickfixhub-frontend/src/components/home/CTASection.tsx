import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Homeowners */}
          <div className="relative overflow-hidden bg-gradient-hero rounded-3xl p-10 text-primary-foreground group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              
              <h3 className="font-display text-2xl font-bold mb-4">
                For Homeowners
              </h3>
              <p className="text-primary-foreground/80 mb-8 max-w-sm">
                Get your home repairs done by trusted professionals. Book instantly and track your service requests in real-time.
              </p>
              
              <Button variant="hero" size="lg" asChild>
                <Link to="/signup?role=homeowner">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* For Service Providers */}
          <div className="relative overflow-hidden bg-card rounded-3xl p-10 border-2 border-accent group shadow-soft hover:shadow-glow transition-shadow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7 text-accent" />
              </div>
              
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                For Service Providers
              </h3>
              <p className="text-muted-foreground mb-8 max-w-sm">
                Join our network of professionals. Grow your business, manage bookings, and connect with customers efficiently.
              </p>
              
              <Button variant="accent" size="lg" asChild>
                <Link to="/signup?role=provider">
                  Join as Pro
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
