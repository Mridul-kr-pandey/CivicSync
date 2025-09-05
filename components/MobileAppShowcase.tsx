"use client";

import { useState, useEffect } from "react";
import { 
  Smartphone, 
  Download, 
  Star, 
  Users, 
  Zap,
  Shield,
  Camera,
  MapPin,
  Bell,
  MessageSquare
} from "lucide-react";

export default function MobileAppShowcase() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const screens = [
    {
      title: "Report Issues",
      description: "Snap a photo and report civic issues instantly",
      image: "report-screen",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Track Progress",
      description: "Monitor the status of your reports in real-time",
      image: "track-screen",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Community Feed",
      description: "See what's happening in your neighborhood",
      image: "community-screen",
      color: "from-purple-500 to-pink-500"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderMockScreen = (screenType: string, color: string) => {
    switch (screenType) {
      case 'report-screen':
        return (
          <div className={`w-full h-full bg-gradient-to-br ${color} p-4 flex flex-col`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-semibold">New Report</span>
              </div>
              <div className="bg-white/20 rounded-lg h-24 flex items-center justify-center">
                <Camera className="h-8 w-8 text-white/60" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="text-white text-xs">Category: Pothole</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="text-white text-xs">Location: Main Street</div>
              </div>
            </div>
            <div className="mt-auto">
              <button className="w-full bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white text-sm font-semibold">
                Submit Report
              </button>
            </div>
          </div>
        );
      
      case 'track-screen':
        return (
          <div className={`w-full h-full bg-gradient-to-br ${color} p-4`}>
            <div className="space-y-3">
              {[
                { title: 'Pothole Report #123', status: 'In Progress', progress: 75 },
                { title: 'Streetlight Issue #124', status: 'Acknowledged', progress: 25 },
                { title: 'Trash Collection #125', status: 'Resolved', progress: 100 }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-white text-sm font-semibold mb-1">{item.title}</div>
                  <div className="text-white/80 text-xs mb-2">{item.status}</div>
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div 
                      className="bg-white h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'community-screen':
        return (
          <div className={`w-full h-full bg-gradient-to-br ${color} p-4`}>
            <div className="space-y-3">
              {[
                { user: 'John D.', action: 'reported a pothole', time: '2m ago', votes: 12 },
                { user: 'Sarah M.', action: 'updated streetlight issue', time: '5m ago', votes: 8 },
                { user: 'Mike R.', action: 'resolved trash issue', time: '1h ago', votes: 24 }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{item.user[0]}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-xs">
                        <span className="font-semibold">{item.user}</span> {item.action}
                      </div>
                      <div className="text-white/60 text-xs">{item.time}</div>
                    </div>
                    <div className="text-white text-xs">{item.votes} ↑</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <div className="w-full h-full bg-gray-200"></div>;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Smartphone className="h-5 w-5 text-blue-400" />
              <span className="text-blue-100 font-semibold">Mobile App</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              CivicSync on the Go
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Take civic engagement with you wherever you go. Our mobile app makes it easier than ever to report issues, track progress, and stay connected with your community.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {[
                { icon: Camera, text: "Instant photo reporting with AI categorization" },
                { icon: MapPin, text: "GPS-powered location accuracy" },
                { icon: Bell, text: "Real-time push notifications" },
                { icon: MessageSquare, text: "Community discussions and updates" }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Icon className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-blue-100">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* App Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { number: "4.8", label: "App Rating", icon: Star },
                { number: "50K+", label: "Downloads", icon: Download },
                { number: "10K+", label: "Active Users", icon: Users }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                <div className="w-6 h-6 bg-gray-900 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs">📱</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-600">Download on the</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </button>
              
              <button className="flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                <div className="w-6 h-6 bg-gray-900 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs">🤖</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-600">Get it on</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative mx-auto" style={{ width: '280px', height: '560px' }}>
              {/* Phone Frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] shadow-2xl">
                {/* Screen */}
                <div className="absolute inset-4 bg-black rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-black h-8 flex items-center justify-between px-6 text-white text-xs">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 border border-white rounded-sm">
                        <div className="w-3 h-1 bg-white rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Screen Content */}
                  <div className="h-full">
                    {screens.map((screen, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 top-8 transition-all duration-1000 ${
                          currentScreen === index 
                            ? 'opacity-100 translate-x-0' 
                            : index < currentScreen 
                              ? 'opacity-0 -translate-x-full' 
                              : 'opacity-0 translate-x-full'
                        }`}
                      >
                        {renderMockScreen(screen.image, screen.color)}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Bell className="h-4 w-4 text-white" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                <Zap className="h-6 w-6 text-white" />
              </div>
              
              <div className="absolute top-1/2 -right-8 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-ping">
                <Shield className="h-3 w-3 text-white" />
              </div>
            </div>

            {/* Screen Indicators */}
            <div className="flex justify-center mt-8 gap-2">
              {screens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentScreen(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentScreen === index
                      ? 'bg-blue-400 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}