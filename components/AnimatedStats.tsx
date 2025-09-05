"use client";

import { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Star,
  BarChart3,
  Globe
} from "lucide-react";

interface StatItem {
  id: string;
  icon: any;
  value: number;
  label: string;
  suffix: string;
  color: string;
  description: string;
}

const stats: StatItem[] = [
  {
    id: 'issues-resolved',
    icon: CheckCircle,
    value: 12547,
    label: 'Issues Resolved',
    suffix: '',
    color: 'from-green-500 to-emerald-500',
    description: 'Successfully completed civic improvements'
  },
  {
    id: 'active-users',
    icon: Users,
    value: 25000,
    label: 'Active Citizens',
    suffix: '+',
    color: 'from-blue-500 to-cyan-500',
    description: 'Engaged community members making a difference'
  },
  {
    id: 'cities-covered',
    icon: Globe,
    value: 150,
    label: 'Cities Covered',
    suffix: '+',
    color: 'from-purple-500 to-pink-500',
    description: 'Growing network of smart cities'
  },
  {
    id: 'response-time',
    icon: Clock,
    value: 24,
    label: 'Avg Response Time',
    suffix: 'h',
    color: 'from-orange-500 to-red-500',
    description: 'Quick acknowledgment of reported issues'
  },
  {
    id: 'satisfaction-rate',
    icon: Star,
    value: 96,
    label: 'Satisfaction Rate',
    suffix: '%',
    color: 'from-yellow-500 to-orange-500',
    description: 'Citizens satisfied with our platform'
  },
  {
    id: 'monthly-reports',
    icon: TrendingUp,
    value: 8500,
    label: 'Monthly Reports',
    suffix: '',
    color: 'from-indigo-500 to-blue-500',
    description: 'New issues reported every month'
  }
];

export default function AnimatedStats() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    stats.forEach((stat) => {
      let startValue = 0;
      const endValue = stat.value;
      const duration = 2000; // 2 seconds
      const increment = endValue / (duration / 16); // 60fps

      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= endValue) {
          startValue = endValue;
          clearInterval(timer);
        }
        
        setAnimatedValues(prev => ({
          ...prev,
          [stat.id]: Math.floor(startValue)
        }));
      }, 16);
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-6">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">Impact Metrics</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-primary">
            Making Real Impact
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            See how CivicSync is transforming communities worldwide with measurable results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const animatedValue = animatedValues[stat.id] || 0;
            
            return (
              <div
                key={stat.id}
                className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  animationDelay: `${index * 150}ms`
                }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg relative`}>
                  <Icon className="h-8 w-8 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
                </div>
                
                {/* Value */}
                <div className="mb-4">
                  <div className="text-4xl font-bold text-slate-800 mb-2 font-mono">
                    {stat.id === 'satisfaction-rate' || stat.id === 'response-time' 
                      ? animatedValue 
                      : formatNumber(animatedValue)
                    }
                    <span className="text-2xl text-slate-600">{stat.suffix}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all duration-2000 ease-out`}
                    style={{ 
                      width: isVisible ? '100%' : '0%',
                      transitionDelay: `${index * 150 + 500}ms`
                    }}
                  ></div>
                </div>
                
                {/* Trend Indicator */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{Math.floor(Math.random() * 20 + 5)}% this month
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-3 h-3 bg-gradient-to-br ${stat.color} rounded-full animate-ping`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Insights */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-100">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Growing Every Day
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Our platform continues to expand its reach and impact, connecting more citizens 
              with their local governments and creating positive change in communities worldwide.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'New Users Daily', value: '500+' },
                { label: 'Issues Reported Today', value: '1,200+' },
                { label: 'Government Partners', value: '75+' },
                { label: 'Success Stories', value: '2,500+' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{item.value}</div>
                  <div className="text-sm text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}