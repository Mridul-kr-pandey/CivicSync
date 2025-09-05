"use client";

import Link from "next/link";
import HomepageNavigation from "@/components/HomepageNavigation";
import {
  ArrowRight,
  Camera,
  MapPin,
  Clock,
  CheckCircle,
  Star,
  BarChart3,
  Shield,
  Users,
  Eye,
  Globe,
  Zap,
  Award,
  Heart,
  Lightbulb,
  Rocket,
  Play,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const heroSlides = [
    {
      title: "Report Issues Instantly",
      subtitle: "Transform your city with just a photo",
      icon: Camera,
      color: "from-blue-600 to-purple-600"
    },
    {
      title: "Track Progress Live",
      subtitle: "Watch your reports come to life",
      icon: BarChart3,
      color: "from-green-600 to-blue-600"
    },
    {
      title: "Build Better Communities",
      subtitle: "Together we make cities smarter",
      icon: Users,
      color: "from-purple-600 to-pink-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Issues Resolved", icon: CheckCircle },
    { number: "95%", label: "Success Rate", icon: Star },
    { number: "24/7", label: "Monitoring", icon: Clock },
    { number: "50+", label: "Cities", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"
          style={{
            left: mousePosition.x * 0.02 + 'px',
            top: mousePosition.y * 0.02 + 'px',
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"
          style={{
            right: mousePosition.x * -0.01 + 'px',
            bottom: mousePosition.y * -0.01 + 'px',
            animationDelay: '2s'
          }}
        />
      </div>

      <HomepageNavigation />
      
      {/* Hero Section with 3D Elements */}
      <section className="min-h-screen flex flex-col items-center justify-center text-white px-6 py-12 relative">
        {/* 3D City Skyline */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="city-skyline">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`building building-${i + 1}`}
                style={{
                  left: `${i * 8}%`,
                  height: `${Math.random() * 200 + 100}px`,
                  animationDelay: `${i * 0.2}s`
                }}
              >
                <div className="building-lights">
                  {[...Array(Math.floor(Math.random() * 6) + 2)].map((_, j) => (
                    <div key={j} className="light" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        
        {/* Hero Content */}
        <div className={`relative z-10 text-center max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Animated Logo */}
          <div className="mb-8 relative">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="relative">
                <Shield className="h-8 w-8 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
              </div>
              <span className="text-lg font-bold">CivicSync Platform</span>
            </div>
          </div>
          
          {/* Dynamic Hero Title */}
          <div className="mb-8 h-32">
            {heroSlides.map((slide, index) => {
              const Icon = slide.icon;
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    currentSlide === index 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-4 rounded-full bg-gradient-to-r ${slide.color} shadow-2xl animate-pulse`}>
                      <Icon className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-bold mb-4 leading-tight drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <p className="text-2xl md:text-3xl text-slate-200 leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Interactive CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link href="/auth/signup" className="w-full sm:w-auto group">
              <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 w-full sm:w-64">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <Rocket className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Start Reporting
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </Link>
            
            <button className="group relative overflow-hidden border-2 border-white/30 text-white font-bold py-4 px-8 rounded-full text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 w-full sm:w-64">
              <div className="flex items-center justify-center gap-2">
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </div>
            </button>
          </div>
          
          {/* Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`text-center transform transition-all duration-1000 hover:scale-110 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="relative mb-3">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                      <Icon className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-ping"></div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2 counter" data-target={stat.number}>
                    {stat.number}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-6">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-semibold">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-primary">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Advanced tools and features designed to make civic engagement effortless and effective
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "Smart Photo Reporting",
                description: "AI-powered image recognition automatically categorizes issues and suggests solutions",
                color: "from-blue-500 to-cyan-500",
                delay: "0ms"
              },
              {
                icon: MapPin,
                title: "GPS Integration",
                description: "Precise location tracking ensures issues are reported exactly where they occur",
                color: "from-green-500 to-emerald-500",
                delay: "200ms"
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Live dashboards show progress, trends, and impact metrics for your community",
                color: "from-purple-500 to-pink-500",
                delay: "400ms"
              },
              {
                icon: Users,
                title: "Community Voting",
                description: "Citizens can upvote issues to prioritize what matters most to the community",
                color: "from-orange-500 to-red-500",
                delay: "600ms"
              },
              {
                icon: Shield,
                title: "Verified Updates",
                description: "Official responses and resolution photos ensure transparency and accountability",
                color: "from-indigo-500 to-blue-500",
                delay: "800ms"
              },
              {
                icon: Globe,
                title: "Multi-Platform Access",
                description: "Works seamlessly across web, mobile, and tablet devices for maximum accessibility",
                color: "from-teal-500 to-green-500",
                delay: "1000ms"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200"
                  style={{ animationDelay: feature.delay }}
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Hover Arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              See CivicSync in Action
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Experience how easy it is to report issues and track their resolution
            </p>
          </div>

          {/* Device Mockups */}
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {/* Mobile */}
            <div className="relative group">
              <div className="w-64 h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-4 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <Smartphone className="h-16 w-16 text-white/80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-white text-sm font-semibold">Mobile App</div>
                      <div className="text-white/80 text-xs">Report on the go</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Tablet */}
            <div className="relative group">
              <div className="w-80 h-60 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-3 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <Tablet className="h-20 w-20 text-white/80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-white text-sm font-semibold">Tablet Interface</div>
                      <div className="text-white/80 text-xs">Enhanced viewing</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Desktop */}
            <div className="relative group">
              <div className="w-96 h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <Monitor className="h-24 w-24 text-white/80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-white text-sm font-semibold">Web Dashboard</div>
                      <div className="text-white/80 text-xs">Full admin control</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        <div className="container-custom text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your City?
            </h2>
            <p className="text-2xl text-blue-100 mb-12 leading-relaxed">
              Join thousands of citizens making their communities better, one report at a time
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <Link href="/auth/signup" className="w-full sm:w-auto group">
                <button className="relative overflow-hidden bg-white text-blue-600 font-bold py-4 px-12 rounded-full text-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 active:scale-95 w-full sm:w-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <Rocket className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    Start Your Journey
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              </Link>
              
              <Link href="/about" className="w-full sm:w-auto">
                <button className="border-2 border-white/30 text-white font-bold py-4 px-12 rounded-full text-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 w-full sm:w-auto">
                  Learn More
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-8 text-white/80 flex-wrap">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span className="text-sm">Award Winning</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span className="text-sm">Community Loved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gradient-primary">CivicSync</h3>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
                Empowering communities through transparent civic engagement. 
                Together, we're building smarter, more responsive cities for everyone.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Globe, label: "Global Impact" },
                  { icon: Users, label: "Community Driven" },
                  { icon: Lightbulb, label: "Innovation First" }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-400">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Platform</h4>
              <ul className="space-y-3">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "How It Works", href: "/how-it-works" },
                  { label: "Success Stories", href: "/success-stories" },
                  { label: "API Documentation", href: "/api-docs" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Support</h4>
              <ul className="space-y-3">
                {[
                  { label: "Help Center", href: "/help" },
                  { label: "Contact Support", href: "/contact" },
                  { label: "Community Forum", href: "/forum" },
                  { label: "Status Page", href: "/status" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © 2025 CivicSync. Transforming communities worldwide.
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}