
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "E-commerce Owner",
    company: "FashionHub",
    content: "After switching to CloudHost, our website load time decreased by 40%. The customer support team is incredibly responsive and helpful. Best hosting decision we've made!",
    rating: 5
  },
  {
    name: "Mark Williams",
    role: "CTO",
    company: "TechStartup",
    content: "The scalability of CloudHost allowed our startup to grow without worrying about infrastructure. Their managed services saved us from hiring a dedicated DevOps team.",
    rating: 5
  },
  {
    name: "David Chen",
    role: "Web Developer",
    company: "PixelPerfect",
    content: "I've used many hosting providers over my 10-year career, and CloudHost offers the best performance-to-price ratio. The developer tools and staging environments are excellent.",
    rating: 4
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthAgency",
    content: "Our agency manages dozens of client websites, and CloudHost makes it easy to maintain them all. The admin interface is intuitive and the uptime is rock solid.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="gradient-text">Thousands</span> of Businesses
          </h2>
          <p className="text-lg text-gray-600">
            Here's what our customers have to say about their experience with CloudHost.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-hosting-light-gray p-6 md:p-8 rounded-lg border border-gray-100"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-hosting-blue to-hosting-teal flex items-center justify-center text-white font-semibold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-hosting-gray">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 p-8 rounded-lg bg-gradient-to-r from-hosting-blue/10 to-hosting-teal/10 text-center">
          <h3 className="text-2xl font-bold text-hosting-gray mb-4">Ready to experience the difference?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust CloudHost for their web hosting needs.
          </p>
          <button className="bg-hosting-blue hover:bg-hosting-dark-blue text-white font-medium px-6 py-3 rounded-lg transition-colors">
            Start Your 30-Day Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
