
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Server, Shield, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero-gradient py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-hosting-gray leading-tight mb-6">
              Fast & Secure <span className="gradient-text">Web Hosting</span> for Your Business
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Reliable, high-performance hosting with 99.9% uptime guarantee. Launch your website in minutes with our easy-to-use platform.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button className="bg-hosting-blue hover:bg-hosting-dark-blue text-white px-8 py-6 text-base">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-hosting-blue text-hosting-blue hover:bg-hosting-blue/5 px-8 py-6 text-base">
                View Plans
              </Button>
            </div>
            <div className="flex items-center mt-8 text-sm text-gray-500">
              <span className="flex items-center mr-6">
                <Zap className="h-4 w-4 text-hosting-blue mr-2" />
                Blazing Fast
              </span>
              <span className="flex items-center mr-6">
                <Shield className="h-4 w-4 text-hosting-blue mr-2" />
                Secure
              </span>
              <span className="flex items-center">
                <Server className="h-4 w-4 text-hosting-blue mr-2" />
                99.9% Uptime
              </span>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="bg-white rounded-xl shadow-lg p-8 relative z-10 animate-fade-in">
              <div className="bg-hosting-light-blue/30 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-500">mywebsite.com</div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-hosting-light-blue/50 rounded w-full"></div>
                  <div className="h-4 bg-hosting-light-blue/50 rounded w-3/4"></div>
                  <div className="h-4 bg-hosting-light-blue/50 rounded w-5/6"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Domain</div>
                  <div className="w-3/4 text-sm">yourdomain.com</div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Plan</div>
                  <div className="w-3/4 text-sm">Premium Cloud</div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Storage</div>
                  <div className="w-3/4 text-sm">50GB SSD</div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Bandwidth</div>
                  <div className="w-3/4 text-sm">Unmetered</div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/4 text-sm font-medium text-gray-500">Status</div>
                  <div className="w-3/4 text-sm flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse-slow"></span>
                    Running
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-hosting-blue to-hosting-teal rounded-xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
