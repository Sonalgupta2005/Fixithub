import React from 'react';
import { Search, CalendarCheck, UserCheck, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Choose Service',
    description: 'Browse our services and select what you need. Describe your issue for accurate matching.',
  },
  {
    icon: CalendarCheck,
    title: 'Book Appointment',
    description: 'Pick your preferred date and time. Get instant confirmation via email notification.',
  },
  {
    icon: UserCheck,
    title: 'Pro Assigned',
    description: 'A verified professional accepts your request and contacts you with details.',
  },
  {
    icon: CheckCircle2,
    title: 'Job Completed',
    description: 'Your repair is done! Rate your experience and help maintain our quality standards.',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
            Simple Steps to Get Help
          </h2>
          <p className="text-muted-foreground text-lg">
            Our streamlined process connects you with the right professional in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative text-center opacity-0 animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
              >
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center shadow-glow z-10">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="bg-card rounded-2xl p-8 pt-10 border border-border h-full shadow-soft hover:shadow-elevated transition-shadow">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
