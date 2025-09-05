"use client";

import { useState, useEffect } from "react";
import { 
  Camera, 
  MapPin, 
  BarChart3, 
  Users, 
  Shield, 
  Globe,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX
} from "lucide-react";

interface Feature {
  id: string;
  icon: any;
  title: string;
  description: string;
  color: string;
  demo: {
    type: 'animation' | 'video' | 'interactive';
    content: string;
  };
}

const features: Feature[] = [
  {
    id: 'photo-reporting',
    icon: Camera,
    title: 'Smart Photo Reporting',
    description: 'AI-powered image recognition automatically categorizes issues and suggests solutions',
    color: 'from-blue-500 to-cyan-500',
    demo: {
      type: 'animation',
      content: 'camera-demo'
    }
  },
  {
    id: 'gps-integration',
    icon: MapPin,
    title: 'GPS Integration',
    description: 'Precise location tracking ensures issues are reported exactly where they occur',
    color: 'from-green-500 to-emerald-500',
    demo: {
      type: 'interactive',
      content: 'map-demo'
    }
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Live dashboards show progress, trends, and impact metrics for your community',
    color: 'from-purple-500 to-pink-500',
    demo: {
      type: 'animation',
      content: 'chart-demo'
    }
  },
  {
    id: 'community-voting',
    icon: Users,
    title: 'Community Voting',
    description: 'Citizens can upvote issues to prioritize what matters most to the community',
    color: 'from-orange-500 to-red-500',
    demo: {
      type: 'interactive',
      content: 'voting-demo'
    }
  },
  {
    id: 'verified-updates',
    icon: Shield,
    title: 'Verified Updates',
    description: 'Official responses and resolution photos ensure transparency and accountability',
    color: 'from-indigo-500 to-blue-500',
    demo: {
      type: 'animation',
      content: 'verification-demo'
    }
  },
  {
    id: 'multi-platform',
    icon: Globe,
    title: 'Multi-Platform Access',
    description: 'Works seamlessly across web, mobile, and tablet devices for maximum accessibility',
    color: 'from-teal-500 to-green-500',
    demo: {
      type: 'animation',
      content: 'platform-demo'
    }
  }
];

export default function InteractiveFeatures() {
  const [activeFeature, setActiveFeature] = useState<string>(features[0].id);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setActiveFeature(current => {
        const currentIndex = features.findIndex(f => f.id === current);
        const nextIndex = (currentIndex + 1) % features.length;
        return features[nextIndex].id;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeFeatureData = features.find(f => f.id === activeFeature) || features[0];

  const renderDemo = (feature: Feature) => {
    switch (feature.demo.content) {
      case 'camera-demo':
        return (
          <div className="relative w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                  <Camera className="h-16 w-16 text-white" />
                </div>
                <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-white text-sm font-semibold">AI Processing...</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'map-demo':
        return (
          <div className="relative w-full h-64 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full">
                {[...Array(48)].map((_, i) => (
                  <div key={i} className="border border-white/20"></div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <MapPin className="h-12 w-12 text-white animate-bounce" />
                <div className="absolute -inset-4 border-2 border-white/50 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="text-white text-xs">GPS: Active</div>
              </div>
            </div>
          </div>
        );
      
      case 'chart-demo':
        return (
          <div className="relative w-full h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl overflow-hidden p-6">
            <div className="grid grid-cols-7 h-full items-end gap-2">
              {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                <div
                  key={i}
                  className="bg-white/30 rounded-t-lg animate-pulse"
                  style={{ 
                    height: `${height}%`,
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              ))}
            </div>
            <div className="absolute top-4 left-4">
              <div className="text-white text-sm font-semibold">Live Analytics</div>
            </div>
          </div>
        );
      
      case 'voting-demo':
        return (
          <div className="relative w-full h-64 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl overflow-hidden p-6">
            <div className="space-y-4">
              {[
                { label: 'Pothole on Main St', votes: 45 },
                { label: 'Broken Streetlight', votes: 32 },
                { label: 'Trash Collection', votes: 28 }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-medium">{item.label}</span>
                    <span className="text-white text-sm">{item.votes} votes</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full animate-pulse"
                      style={{ width: `${(item.votes / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'verification-demo':
        return (
          <div className="relative w-full h-64 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-white text-sm font-semibold">Status: Verified ✓</div>
                <div className="text-white/80 text-xs">Official response received</div>
              </div>
            </div>
          </div>
        );
      
      case 'platform-demo':
        return (
          <div className="relative w-full h-64 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl overflow-hidden p-6">
            <div className="flex justify-center items-center gap-4 h-full">
              {[
                { icon: '📱', label: 'Mobile' },
                { icon: '💻', label: 'Desktop' },
                { icon: '📟', label: 'Tablet' }
              ].map((device, i) => (
                <div
                  key={i}
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center animate-bounce"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  <div className="text-2xl mb-2">{device.icon}</div>
                  <div className="text-white text-xs font-medium">{device.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <div className="w-full h-64 bg-gray-200 rounded-xl"></div>;
    }
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-6">
            <Play className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">Interactive Demo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-primary">
            Experience Our Features
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            See how CivicSync transforms civic engagement with cutting-edge technology
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature List */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === feature.id;
              
              return (
                <div
                  key={feature.id}
                  className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-500 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg' 
                      : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setActiveFeature(feature.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-br ${feature.color} shadow-lg` 
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <Icon className={`h-6 w-6 transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                        isActive ? 'text-blue-900' : 'text-slate-800'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                        isActive ? 'text-blue-700' : 'text-slate-600'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                    
                    <ArrowRight className={`h-5 w-5 transition-all duration-300 ${
                      isActive 
                        ? 'text-blue-600 opacity-100 translate-x-0' 
                        : 'text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                    }`} />
                  </div>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Demo Area */}
          <div className="relative">
            <div className="sticky top-8">
              {/* Demo Controls */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800">
                  {activeFeatureData.title}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Play className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Demo Content */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {renderDemo(activeFeatureData)}
                
                {/* Demo Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                
                {/* Demo Label */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-xs font-semibold text-gray-800">LIVE DEMO</span>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center mt-6 gap-2">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeFeature === feature.id
                        ? 'bg-blue-600 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}