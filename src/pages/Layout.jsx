

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  User as UserIcon,
  Settings,
  LogOut,
  Crown,
  Bookmark,
  Trophy,
  Plane,
  Mail,
  Globe, // Changed from Home to Globe
  Languages,
  Luggage,
  Hand,
  Shield,
  Trash2,
  FileText,
  Info,
  Heart // Added Heart icon for Favorites
} from "lucide-react";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import NotificationBell from '@/components/notifications/NotificationBell';

// This inner component now consumes the context
const AppLayout = ({ children, currentPageName }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isLoadingUser } = useAuth();
  const location = useLocation();
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('culturecompass_cookie_consent');
      const privacyAccepted = localStorage.getItem('culturecompass_privacy_accepted');

      if (!consent) {
        setShowCookieBanner(true);
      }

      if (!privacyAccepted && user) {
        setShowPrivacyNotice(true);
      }
    }
  }, [user]);

  const handleAcceptCookies = () => {
    localStorage.setItem('culturecompass_cookie_consent', 'true');
    setShowCookieBanner(false);
  };

  const handleAcceptPrivacy = () => {
    localStorage.setItem('culturecompass_privacy_accepted', 'true');
    setShowPrivacyNotice(false);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      localStorage.removeItem('culturecompass_privacy_accepted');
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.reload();
    }
  };

  const isActivePage = (pageName) => {
    if (pageName === 'index' && (currentPageName === 'index' || location.pathname === '/')) {
      return true;
    }
    return currentPageName === pageName || location.pathname === `/${pageName}`;
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const translatorUrl = user ? createPageUrl("Translator") : createPageUrl("GoPro");

  // Native mobile-first navigation
  const navigationItems = [
    { name: "Browse", href: createPageUrl("Browse"), icon: Globe, current: isActivePage("Browse") }, // Changed from Explore and index to Browse and Globe
    { name: "Favorites", href: createPageUrl("Favorites"), icon: Heart, current: isActivePage("Favorites") },
    { name: "Planner", href: createPageUrl("TravelPlanner"), icon: Plane, current: isActivePage("TravelPlanner") },
    { name: "Pack Smart", href: createPageUrl("PackingAssistant"), icon: Luggage, current: isActivePage("PackingAssistant") },
    { name: "Gestures", href: createPageUrl("GestureGuide"), icon: Hand, current: isActivePage("GestureGuide") },
    { name: "Translate", href: translatorUrl, icon: Languages, current: isActivePage("Translator") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
       <style>
        {`
          :root {
            --cc-primary: #1e40af;
            --cc-primary-light: #3b82f6;
            --cc-primary-dark: #1e3a8a;
            --cc-secondary: #f97316;
            --cc-secondary-light: #fb923c;
            --cc-accent: #8b5cf6;
            --cc-accent-light: #a78bfa;
            --cc-surface: #ffffff;
            --cc-surface-elevated: #f8fafc;
            --cc-text-primary: #1e293b;
            --cc-text-secondary: #64748b;
            --cc-text-muted: #94a3b8;
            --cc-border: #e2e8f0;
            --cc-border-light: #f1f5f9;

            --cc-gradient-hero: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #8b5cf6 100%);
            --cc-gradient-warm: linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%);
            --cc-gradient-cool: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
            --cc-gradient-surface: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%);

            --cc-shadow-sm: 0 1px 2px 0 rgba(30, 64, 175, 0.05);
            --cc-shadow-md: 0 4px 6px -1px rgba(30, 64, 175, 0.1), 0 2px 4px -1px rgba(30, 64, 175, 0.06);
            --cc-shadow-lg: 0 10px 15px -3px rgba(30, 64, 175, 0.1), 0 4px 6px -2px rgba(30, 64, 175, 0.05);
            --cc-shadow-xl: 0 20px 25px -5px rgba(30, 64, 175, 0.1), 0 10px 10px -5px rgba(30, 64, 175, 0.04);
          }

          .cc-card {
            background: var(--cc-gradient-surface);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: var(--cc-shadow-lg);
            border-radius: 16px;
          }

          .cc-button-primary {
            background: var(--cc-gradient-hero);
            border: none;
            color: white;
            font-weight: 600;
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: var(--cc-shadow-md);
          }

          .cc-button-primary:hover {
            transform: translateY(-2px);
            box-shadow: var(--cc-shadow-xl);
          }

          .cc-nav-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border-radius: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            text-decoration: none;
          }

          .cc-nav-item.active {
            background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
            color: var(--cc-primary-dark);
            box-shadow: var(--cc-shadow-sm);
          }

          .cc-nav-item:hover {
            background: rgba(30, 64, 175, 0.05);
            transform: translateX(2px);
          }

          .cc-mobile-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid var(--cc-border-light);
            padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
            z-index: 50;
          }

          .cc-mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px 4px;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.2s ease;
            min-width: 0;
          }

          .cc-mobile-nav-item.active {
            color: var(--cc-primary);
          }

          .cc-mobile-nav-item:not(.active) {
            color: var(--cc-text-muted);
          }

          .cc-mobile-nav-item:active {
            transform: scale(0.95);
          }

          @keyframes cc-fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes cc-slide-up {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .cc-animate-fade-in {
            animation: cc-fade-in 0.6s ease-out;
          }

          .cc-animate-slide-up {
            animation: cc-slide-up 0.8s ease-out;
          }

          @media (max-width: 768px) {
            .cc-mobile-only {
              display: block;
            }
            .cc-desktop-only {
              display: none;
            }
            main {
              padding-bottom: 80px;
            }
          }

          @media (min-width: 769px) {
            .cc-mobile-only {
              display: none;
            }
            .cc-desktop-only {
              display: block;
            }
          }
        `}
      </style>

      {/* Desktop Header */}
      <header className="cc-desktop-only bg-white/90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <Link to={createPageUrl("index")} className="flex items-center space-x-3 group">
                <div className="relative">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/aa7ddde06_ChatGPTImageAug16202507_51_36PM.png"
                    alt="CultureCompass"
                    className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                  CultureCompass
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1 mx-8 flex-1 justify-center">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`cc-nav-item text-sm whitespace-nowrap ${
                    item.current ? 'active' : ''
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
              {user ? (
                <>
                  {user.role === 'admin' && !isLoadingUser && <NotificationBell />}
                  <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <Avatar className="h-10 w-10 cursor-pointer">
                          <AvatarImage src="" alt={user.full_name || "User"} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-semibold cursor-pointer">
                            {getUserInitials(user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        {user.pro_member && (
                          <Crown className="absolute -top-1 -right-1 h-4 w-4 text-amber-500" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 cc-card border-0 z-50" align="end" sideOffset={5}>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.full_name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                          {user.pro_member && (
                            <Badge className="w-fit bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs border-amber-200">
                              <Crown className="w-3 h-3 mr-1" />
                              Pro Member
                            </Badge>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("MyAccount")} className="flex items-center cursor-pointer w-full">
                          <UserIcon className="w-4 h-4 mr-2" />
                          My Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Bookmarks")} className="flex items-center cursor-pointer w-full">
                          <Bookmark className="w-4 h-4 mr-2" />
                          Bookmarks
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Achievements")} className="flex items-center cursor-pointer w-full">
                          <Trophy className="w-4 h-4 mr-2" />
                          Achievements
                        </Link>
                      </DropdownMenuItem>
                      {!user.pro_member && (
                        <DropdownMenuItem asChild>
                          <Link to={createPageUrl("GoPro")} className="flex items-center cursor-pointer w-full">
                            <Crown className="w-4 h-4 mr-2" />
                            Go Pro
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Security")} className="flex items-center cursor-pointer w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Security
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Contact")} className="flex items-center cursor-pointer w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {/* CRITICAL: Privacy & Legal Links - App Store Requirement */}
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("PrivacyPolicy")} className="flex items-center cursor-pointer w-full">
                          <Shield className="w-4 h-4 mr-2" />
                          Privacy Policy
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("TermsAndConditions")} className="flex items-center cursor-pointer w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          Terms & Conditions
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("DataUsage")} className="flex items-center cursor-pointer w-full">
                          <Info className="w-4 h-4 mr-2" />
                          Data Usage
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("DeleteDataRequest")} className="flex items-center cursor-pointer w-full text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account & Data
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button onClick={() => User.login()} className="cc-button-primary px-4 py-2 text-sm">
                    Sign In
                  </Button>
                  <Link to={createPageUrl("Browse")}>
                    <Button variant="ghost" className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                      Continue as Guest
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 cc-card border-0">
                  <SheetHeader>
                    <SheetTitle className="text-blue-800">Navigation</SheetTitle>
                    <SheetDescription>
                      Access all CultureCompass features
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="mt-6">
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`cc-nav-item text-base ${
                            item.current ? 'active' : ''
                          }`}
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </Link>
                      ))}

                      {/* CRITICAL: Legal links in mobile menu for App Store compliance */}
                      <div className="border-t border-gray-200 mt-4 pt-4">
                        <p className="text-sm font-semibold text-gray-500 mb-2 px-4">Legal & Privacy</p>
                        <Link
                          to={createPageUrl("PrivacyPolicy")}
                          onClick={() => setIsSidebarOpen(false)}
                          className="cc-nav-item text-base"
                        >
                          <Shield className="w-5 h-5 mr-3" />
                          Privacy Policy
                        </Link>
                        <Link
                          to={createPageUrl("TermsAndConditions")}
                          onClick={() => setIsSidebarOpen(false)}
                          className="cc-nav-item text-base"
                        >
                          <FileText className="w-5 h-5 mr-3" />
                          Terms & Conditions
                        </Link>
                        <Link
                          to={createPageUrl("DataUsage")}
                          onClick={() => setIsSidebarOpen(false)}
                          className="cc-nav-item text-base"
                        >
                          <Info className="w-5 h-5 mr-3" />
                          Data Usage
                        </Link>
                      </div>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="cc-mobile-only bg-white/90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("index")} className="flex items-center space-x-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/aa7ddde06_ChatGPTImageAug16202507_51_36PM.png"
                alt="CultureCompass"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CultureCompass
              </span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' && !isLoadingUser && <NotificationBell />}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.full_name || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 text-xs font-semibold">
                          {getUserInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 cc-card border-0 z-50" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("MyAccount")} className="flex items-center cursor-pointer w-full">
                        <UserIcon className="w-4 h-4 mr-2" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("Bookmarks")} className="flex items-center cursor-pointer w-full">
                        <Bookmark className="w-4 h-4 mr-2" />
                        Bookmarks
                      </Link>
                    </DropdownMenuItem>
                    {/* CRITICAL: Privacy & Account Deletion in Mobile Menu */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("PrivacyPolicy")} className="flex items-center cursor-pointer w-full">
                        <Shield className="w-4 h-4 mr-2" />
                        Privacy Policy
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("DeleteDataRequest")} className="flex items-center cursor-pointer w-full text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button onClick={() => User.login()} size="sm" className="cc-button-primary text-xs px-3 py-1">
                  Sign In
                </Button>
                <Link to={createPageUrl("Browse")}>
                  <Button variant="ghost" size="sm" className="text-xs px-2 py-1 text-slate-600">
                    Guest
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="cc-animate-fade-in">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="cc-mobile-nav cc-mobile-only">
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`cc-mobile-nav-item flex-1 ${
                item.current ? 'active' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Footer */}
      <footer className="cc-desktop-only bg-slate-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/aa7ddde06_ChatGPTImageAug16202507_51_36PM.png"
                  alt="CultureCompass"
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-bold">CultureCompass</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your ultimate cultural learning companion for meaningful travel experiences worldwide.
              </p>
              <div className="text-xs text-slate-500">
                <p>© 2025 The Language Club Limited</p>
                <p>All rights reserved</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div><Link to={createPageUrl("Browse")} className="hover:text-white transition-colors">Countries</Link></div> {/* Changed from index to Browse */}
                <div><Link to={createPageUrl("Favorites")} className="hover:text-white transition-colors">My Favorites</Link></div>
                <div><Link to={createPageUrl("TravelPlanner")} className="hover:text-white transition-colors">AI Travel Planner</Link></div>
                <div><Link to={createPageUrl("PackingAssistant")} className="hover:text-white transition-colors">Smart Packing</Link></div>
                <div><Link to={translatorUrl} className="hover:text-white transition-colors">Smart Translator</Link></div>
                <div><Link to={createPageUrl("Achievements")} className="hover:text-white transition-colors">Achievements</Link></div>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div><Link to={createPageUrl("Contact")} className="hover:text-white transition-colors">Contact Support</Link></div>
                <div><a href="mailto:info@culturecompass.app" className="hover:text-white transition-colors">Email Support</a></div>
                <div><Link to={createPageUrl("GoPro")} className="hover:text-white transition-colors">Go Pro</Link></div>
              </div>
            </div>

            {/* Legal & Privacy - Made Prominent */}
            <div>
              <h3 className="font-semibold mb-4 text-blue-300">Legal & Privacy</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div><Link to={createPageUrl("PrivacyPolicy")} className="hover:text-white transition-colors font-medium">Privacy Policy</Link></div>
                <div><Link to={createPageUrl("TermsAndConditions")} className="hover:text-white transition-colors font-medium">Terms & Conditions</Link></div>
                <div><Link to={createPageUrl("DataUsage")} className="hover:text-white transition-colors">Data Usage</Link></div>
                <div><Link to={createPageUrl("DeleteDataRequest")} className="hover:text-white transition-colors">Delete My Data</Link></div>
              </div>
              <div className="mt-4 text-xs text-slate-500">
                <p>The Language Club Limited</p>
                <p>London, UK | UK Company Registration</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar - Prominent Legal Links */}
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">
              © 2025 The Language Club Limited - Built for cultural explorers worldwide
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0 text-sm text-slate-400">
              <Link to={createPageUrl("PrivacyPolicy")} className="hover:text-white transition-colors font-medium">
                Privacy
              </Link>
              <span>•</span>
              <Link to={createPageUrl("TermsAndConditions")} className="hover:text-white transition-colors font-medium">
                Terms
              </Link>
              <span>•</span>
              <a href="mailto:info@culturecompass.app" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm text-white p-4 z-[200] border-t border-slate-700">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-300 text-center md:text-left">
              We use essential cookies to make our site work. By using our site, you acknowledge you have read and understand our{' '}
              <Link to={createPageUrl("PrivacyPolicy")} className="font-semibold underline hover:text-white transition-colors">
                Cookie & Privacy Policy
              </Link>.
            </p>
            <Button onClick={handleAcceptCookies} className="cc-button-primary flex-shrink-0 px-6 py-2">
              Accept
            </Button>
          </div>
        </div>
      )}

      {/* Privacy Notice for New Users */}
      {showPrivacyNotice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="cc-card max-w-md w-full p-6 mx-4">
            <h3 className="text-lg font-bold text-blue-800 mb-4">Welcome to CultureCompass!</h3>
            <p className="text-sm text-slate-600 mb-4">
              We collect and use your data to provide personalized cultural insights, track your learning progress, and improve our services.
            </p>
            <div className="text-xs text-slate-500 mb-4 space-y-2">
              <p><strong>We collect:</strong> Account info, learning progress, bookmarks, and usage analytics</p>
              <p><strong>We use it for:</strong> Personalization, progress tracking, and service improvement</p>
              <p><strong>We share:</strong> Only anonymized data for analytics, never personal information</p>
              </div>
            <div className="flex gap-3">
              <Button onClick={handleAcceptPrivacy} className="cc-button-primary flex-1">
                Accept & Continue
              </Button>
              <Link to={createPageUrl("PrivacyPolicy")}>
                <Button variant="outline" className="px-3 py-2 text-sm">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// The default export now wraps the AppLayout with the AuthProvider
export default function Layout({ children, currentPageName }) {
  return (
    <AuthProvider>
      <AppLayout currentPageName={currentPageName}>
        {children}
      </AppLayout>
    </AuthProvider>
  );
}

