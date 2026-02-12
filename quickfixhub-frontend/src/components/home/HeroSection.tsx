import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, Star, CheckCircle } from 'lucide-react';

const HeroSection: React.FC = () => {
  const features = [
    { icon: Shield, text: 'Verified Professionals' },
    { icon: Clock, text: 'Same-Day Service' },
    { icon: Star, text: '5-Star Rated' },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full text-accent text-sm font-medium animate-fade-in">
              <CheckCircle className="w-4 h-4" />
              Trusted by 10,000+ Homeowners
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight animate-slide-up">
              Your Home Repairs,{' '}
              <span className="text-gradient">Solved Fast</span>
            </h1>

            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto lg:mx-0 animate-slide-up stagger-1">
              Connect with skilled professionals for plumbing, electrical, and all home repair needs. Book instantly, get real-time updates, and enjoy peace of mind.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up stagger-2">
              <Button size="xl" variant="hero" asChild>
                <Link to="/signup">
                  Book a Service
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="xl" variant="hero-outline" asChild>
                <Link to="/signup?role=provider">
                  Join as Pro
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4 animate-fade-in stagger-3">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-primary-foreground/70">
                  <Icon className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image/Stats Card */}
          <div className="relative hidden lg:block animate-slide-in-right">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-card rounded-2xl p-8 shadow-floating">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-secondary rounded-xl">
                    <div className="text-4xl font-display font-bold text-foreground">500+</div>
                    <div className="text-sm text-muted-foreground mt-1">Verified Pros</div>
                  </div>
                  <div className="text-center p-6 bg-secondary rounded-xl">
                    <div className="text-4xl font-display font-bold text-foreground">10K+</div>
                    <div className="text-sm text-muted-foreground mt-1">Jobs Done</div>
                  </div>
                  <div className="text-center p-6 bg-secondary rounded-xl">
                    <div className="text-4xl font-display font-bold text-foreground">4.9</div>
                    <div className="text-sm text-muted-foreground mt-1">Avg Rating</div>
                  </div>
                  <div className="text-center p-6 bg-secondary rounded-xl">
                    <div className="text-4xl font-display font-bold text-accent">2hr</div>
                    <div className="text-sm text-muted-foreground mt-1">Avg Response</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full shadow-glow font-semibold text-sm animate-float">
                ⚡ Quick Response
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
