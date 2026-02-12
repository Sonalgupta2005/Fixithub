import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  Award, 
  Heart, 
  Target, 
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'All professionals undergo thorough background checks and skill verification.',
  },
  {
    icon: Clock,
    title: 'Reliability',
    description: 'We guarantee timely service with real-time tracking and notifications.',
  },
  {
    icon: Award,
    title: 'Quality First',
    description: 'Only top-rated professionals with proven track records join our platform.',
  },
  {
    icon: Heart,
    title: 'Customer Care',
    description: '24/7 support to ensure your complete satisfaction with every service.',
  },
];

const stats = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '500+', label: 'Verified Pros' },
  { value: '50,000+', label: 'Jobs Completed' },
  { value: '4.9/5', label: 'Average Rating' },
];

const About: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Connecting Homes with{' '}
              <span className="text-gradient">Trusted Professionals</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              QuickFixHub is a cloud-native platform built to solve the disconnect between homeowners needing repairs and skilled technicians looking for work. We make home services simple, reliable, and transparent.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Mission</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                Making Home Repairs Effortless
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We believe every homeowner deserves quick access to reliable repair services, and every skilled professional deserves a steady stream of quality jobs. Our platform bridges this gap with cutting-edge technology.
              </p>
              <ul className="space-y-4">
                {[
                  'Real-time notifications via AWS SNS',
                  'Scalable cloud architecture on AWS EC2',
                  'Secure data management with DynamoDB',
                  'Role-based access with AWS IAM',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-card rounded-2xl p-6 border border-border text-center card-hover"
                >
                  <div className="font-display text-3xl font-bold text-accent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              What Drives Us Forward
            </h2>
            <p className="text-muted-foreground text-lg">
              These core principles guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-card rounded-xl p-6 border border-border card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-hero rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Ready to Experience Better Home Services?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Join thousands of satisfied customers and professional technicians on QuickFixHub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/signup">
                    Get Started Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="hero-outline" size="lg" asChild>
                  <Link to="/services">
                    View Services
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
