
import React from 'react';
import { Server, Shield, Zap, Globe, Database, Clock, Lock, BarChart, HelpCircle } from 'lucide-react';

const features = [
  {
    icon: <Server className="h-8 w-8 text-hosting-blue" />,
    title: "High-Performance Servers",
    description: "Blazing fast SSD storage and the latest CPU technology for optimal performance."
  },
  {
    icon: <Shield className="h-8 w-8 text-hosting-blue" />,
    title: "Advanced Security",
    description: "Free SSL certificates, DDoS protection, and regular security updates."
  },
  {
    icon: <Zap className="h-8 w-8 text-hosting-blue" />,
    title: "Instant Setup",
    description: "Get your website up and running in minutes with our one-click installations."
  },
  {
    icon: <Globe className="h-8 w-8 text-hosting-blue" />,
    title: "Global CDN",
    description: "Content delivery network ensures fast loading times for visitors worldwide."
  },
  {
    icon: <Database className="h-8 w-8 text-hosting-blue" />,
    title: "Daily Backups",
    description: "Automated daily backups with one-click restore for peace of mind."
  },
  {
    icon: <Clock className="h-8 w-8 text-hosting-blue" />,
    title: "99.9% Uptime",
    description: "We guarantee your website stays online with our reliable infrastructure."
  },
  {
    icon: <Lock className="h-8 w-8 text-hosting-blue" />,
    title: "Domain Privacy",
    description: "Keep your personal information private with our domain privacy protection."
  },
  {
    icon: <BarChart className="h-8 w-8 text-hosting-blue" />,
    title: "Detailed Analytics",
    description: "Monitor your website's performance with comprehensive analytics."
  },
  {
    icon: <HelpCircle className="h-8 w-8 text-hosting-blue" />,
    title: "24/7 Support",
    description: "Our expert support team is available around the clock to help you."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Your <span className="gradient-text">Hosting Needs</span>
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to build, launch, and manage your websites and applications with ease.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card bg-white p-6 rounded-lg border border-gray-100 hover:border-hosting-blue/20 transition-all duration-300"
            >
              <div className="mb-4 p-3 bg-hosting-light-blue/20 inline-block rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-hosting-gray">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
