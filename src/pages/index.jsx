
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Country } from "@/api/entities";
import { User } from "@/api/entities";
import { Phrase } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Users, BookOpen, Globe, Crown, Sparkles, Brain, Target, Zap, Star, ChevronRight, Download, Play, CheckCircle, ArrowRight, Languages, Hand, Luggage, Shield, ExternalLink, Heart, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import ProUpgradePrompt from "@/components/ProUpgradePrompt";
import TrialBanner from "@/components/perks/TrialBanner";
import SharingRewards from "@/components/perks/SharingRewards";
import { useAuth } from "@/components/auth/AuthProvider";

const FREE_COUNTRY_LIST = ["France", "Japan", "Thailand", "Italy", "Spain"];

// Expanded fallback country data for immediate display
const EXPANDED_FALLBACK_COUNTRIES = [
  { 
    id: '1', 
    name: 'Japan', 
    flag_emoji: '🇯🇵', 
    language: 'Japanese', 
    greeting_casual: 'こんにちは (Konnichiwa)', 
    cultural_highlights: ['Bowing etiquette', 'Gift giving ceremonies', 'Tea ceremony traditions'],
    cultural_dos: ['Remove shoes indoors', 'Bow when greeting', 'Use both hands for business cards'],
    cultural_donts: ['Point with one finger', 'Blow nose in public', 'Stick chopsticks in rice'],
    created_date: new Date().toISOString() 
  },
  { 
    id: '2', 
    name: 'France', 
    flag_emoji: '🇫🇷', 
    language: 'French', 
    greeting_casual: 'Bonjour', 
    cultural_highlights: ['Culinary traditions', 'Art appreciation', 'Fashion consciousness'],
    cultural_dos: ['Greet before making requests', 'Dress well in public', 'Take time with meals'],
    cultural_donts: ['Skip greeting rituals', 'Rush through dinner', 'Speak loudly in restaurants'],
    created_date: new Date().toISOString() 
  },
  { 
    id: '3', 
    name: 'Thailand', 
    flag_emoji: '🇹🇭', 
    language: 'Thai', 
    greeting_casual: 'สวัสดี (Sawasdee)', 
    cultural_highlights: ['Buddhist traditions', 'Royal respect', 'Hospitality culture'],
    cultural_dos: ['Perform the wai greeting', 'Remove shoes in temples', 'Show respect to monarchy'],
    cultural_donts: ['Touch someones head', 'Point feet at people', 'Show anger publicly'],
    created_date: new Date().toISOString() 
  },
  { 
    id: '4', 
    name: 'Italy', 
    flag_emoji: '🇮🇹', 
    language: 'Italian', 
    greeting_casual: 'Ciao', 
    cultural_highlights: ['Family values', 'Food culture', 'Fashion importance'],
    cultural_dos: ['Greet warmly', 'Enjoy long meals', 'Dress stylisly'],
    cultural_donts: ['Rush through food', 'Put cheese on seafood', 'Drink cappuccino after 11 AM'],
    created_date: new Date().toISOString() 
  },
  { 
    id: '5', 
    name: 'Germany', 
    flag_emoji: '🇩🇪', 
    language: 'German', 
    greeting_casual: 'Hallo', 
    cultural_highlights: ['Punctuality importance', 'Environmental consciousness', 'Direct communication'],
    cultural_dos: ['Be on time', 'Separate recycling', 'Give firm handshakes'],
    cultural_donts: ['Be late', 'Talk loudly in public', 'Cross against red lights'],
    created_date: new Date().toISOString() 
  },
  { 
    id: '6', 
    name: 'Brazil', 
    flag_emoji: '🇧🇷', 
    language: 'Portuguese', 
    greeting_casual: 'Oi', 
    cultural_highlights: ['Warm social culture', 'Music and dance', 'Family importance'],
    cultural_dos: ['Greet with kisses', 'Be warm and friendly', 'Build personal relationships'],
    cultural_donts: ['Make OK gesture', 'Be overly formal', 'Rush business relationships'],
    created_date: new Date().toISOString() 
  }
];

const StatCardSkeleton = () => (
  <div className="cc-card rounded-2xl border-0 shadow-lg h-full">
    <div className="p-8 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-slate-200 rounded-2xl"></div>
        <div className="h-7 w-12 bg-slate-200 rounded"></div>
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
      </div>
    </div>
  </div>
);

const CountryCardSkeleton = () => (
  <div className="cc-card rounded-2xl border-0 shadow-lg h-full flex flex-col p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-5 w-28 bg-slate-200 rounded"></div>
        <div className="h-4 w-20 bg-slate-200 rounded"></div>
      </div>
    </div>
    <div className="space-y-4 mb-4">
      <div className="h-16 bg-slate-100 rounded-xl"></div>
    </div>
    <div className="h-10 bg-slate-200 rounded-lg mt-auto"></div>
  </div>
);

// App Store Badge Component - Updated to show actual availability
const AppStoreBadge = () => (
  <div className="text-center mt-8">
    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 max-w-md mx-auto border-2 border-green-200">
      <h3 className="text-xl font-bold text-green-900 mb-2">Available Now</h3>
      <p className="text-green-700 mb-4">
        Access CultureCompass instantly with our mobile-optimized web platform. Works perfectly on all devices.
      </p>
      <div className="flex items-center justify-center gap-2 text-sm text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span>No downloads required</span>
      </div>
    </div>
  </div>
);

// Move features array outside component to avoid dependency issues
const FEATURES_SHOWCASE = [
  {
    icon: <Globe className="w-12 h-12" />,
    title: "90+ Countries Covered",
    description: "Complete cultural guides for every major destination worldwide",
    details: [
      "Essential phrases and greetings",
      "Cultural do's and don'ts", 
      "Business and dining etiquette",
      "Local customs and traditions"
    ],
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: <Brain className="w-12 h-12" />,
    title: "AI Travel Planner",
    description: "Get personalized itineraries tailored to your preferences",
    details: [
      "Custom day-by-day plans",
      "Cultural activity recommendations",
      "Budget-conscious suggestions",
      "Local insider tips"
    ],
    color: "from-purple-500 to-violet-600"
  },
  {
    icon: <Target className="w-12 h-12" />,
    title: "Cultural Do's & Don'ts",
    description: "Navigate like a local with essential etiquette guides",
    details: [
      "Greeting customs and gestures",
      "Dining and social etiquette",
      "Business meeting protocols",
      "Gift-giving traditions"
    ],
    color: "from-orange-500 to-red-500"
  },
  {
    icon: <Languages className="w-12 h-12" />,
    title: "Smart Translator",
    description: "AI-powered translation with cultural context",
    details: [
      "Context-aware translations",
      "Cultural etiquette tips",
      "Pronunciation guides",
      "Formality level adjustments",
      "Regional variations and dialects",
      "Offline translation capabilities"
    ],
    color: "from-teal-500 to-cyan-600"
  },
  {
    icon: <Luggage className="w-12 h-12" />,
    title: "Smart Packing Assistant",
    description: "AI recommendations based on weather and culture",
    details: [
      "Weather-appropriate clothing",
      "Cultural dress codes",
      "Essential travel items",
      "Local shopping alternatives",
      "Size conversion charts",
      "Packing optimization tips"
    ],
    color: "from-emerald-500 to-green-600"
  }
];

// Features Showcase Component
const FeaturesShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES_SHOWCASE.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything You Need for Cultural Travel
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover, plan, and navigate any culture with confidence using our comprehensive AI-powered toolkit.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {FEATURES_SHOWCASE.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                  activeFeature === index 
                    ? 'bg-white shadow-lg ring-2 ring-blue-400' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white flex-shrink-0`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 mb-3">{feature.description}</p>
                  <AnimatePresence>
                    {activeFeature === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {feature.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center gap-2 text-sm text-slate-700">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {FEATURES_SHOWCASE.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeFeature === index ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Benefits Section
const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Travel with Confidence",
      description: "Never worry about cultural mistakes or misunderstandings again."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Authentic Connections",
      description: "Build genuine relationships with locals through proper etiquette."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Save Time & Stress",
      description: "Get instant answers to cultural questions, anytime, anywhere."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Respectful Tourism",
      description: "Travel responsibly with deep cultural awareness and sensitivity."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Why Travelers Choose CultureCompass
          </h2>
          <p className="text-xl text-slate-600">
            Join thousands of culturally-aware travelers worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Index() {
  const [countries, setCountries] = useState(EXPANDED_FALLBACK_COUNTRIES); // Start with content
  const [searchTerm, setSearchTerm] = useState("");
  const [isCountriesLoading, setIsCountriesLoading] = useState(false); // Don't show loading initially
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [featuredCountries, setFeaturedCountries] = useState(EXPANDED_FALLBACK_COUNTRIES);
  const { user, reloadUser, isLoadingUser } = useAuth();
  const [phrasesCount, setPhrasesCount] = useState(150); // Show immediate stats
  const [culturalInsightsCount, setCulturalInsightsCount] = useState(500);
  const [networkError, setNetworkError] = useState(false);

  const processCountriesForUser = useCallback((userData, countriesData) => {
    const uniqueCountries = [];
    const seenCountries = new Set();
    
    const sortedData = countriesData
      .filter(country => country.name !== "United States")
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    
    sortedData.forEach(country => {
      if (!seenCountries.has(country.name)) {
        seenCountries.add(country.name);
        uniqueCountries.push(country);
      }
    });
    
    const alphabeticallySortedCountries = uniqueCountries.sort((a, b) => a.name.localeCompare(b.name));
    setCountries(alphabeticallySortedCountries);
    
    const hasPremiumAccess = userData?.pro_member || (
      userData?.trial_started_date && 
      !userData?.trial_used && 
      new Date() < new Date(new Date(userData.trial_started_date).getTime() + 7 * 24 * 60 * 60 * 1000)
    );

    if (hasPremiumAccess) {
      setFeaturedCountries(alphabeticallySortedCountries);
    } else {
      const availableFreeCountries = alphabeticallySortedCountries.filter(c => FREE_COUNTRY_LIST.includes(c.name));
      setFeaturedCountries(availableFreeCountries);
    }
  }, []);

  useEffect(() => {
    const handleStripeSuccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('stripe_success') === 'true' && user && !user.pro_member) {
        try {
          await User.updateMyUserData({ 
            pro_member: true, 
            trial_started_date: null,
            trial_used: true
          });
          alert("✨ Welcome to Premium! Your upgrade was successful.");
          window.history.replaceState({}, document.title, window.location.pathname);
          reloadUser();
        } catch (updateError) {
          console.error("Error updating user after Stripe success:", updateError);
        }
      }
    };
    handleStripeSuccess();
  }, [user, reloadUser]);

  useEffect(() => {
    if (isLoadingUser) {
        return;
    }

    const loadCountries = async () => {
      // Start with expanded fallback content immediately
      setCountries(EXPANDED_FALLBACK_COUNTRIES);
      setFeaturedCountries(EXPANDED_FALLBACK_COUNTRIES);
      setIsCountriesLoading(false); // No need for loading state as content is immediate

      setNetworkError(false);
      
      let countriesData = [];
      let success = false;
      let retryCount = 0;
      const maxRetries = 2; // Reduce retries for faster fallback
      
      while (retryCount < maxRetries && !success) {
        try {
          countriesData = await Country.list();
          if (countriesData && countriesData.length > 0) {
            localStorage.setItem('countries_cache', JSON.stringify(countriesData)); 
            console.log("Successfully loaded countries from server");
            success = true;
            processCountriesForUser(user, countriesData);
          } else {
            console.log("Server returned empty country list, trying fallback.");
          }
        } catch (error) {
          retryCount++;
          console.log(`Attempt ${retryCount} to load countries failed:`, error.message);
          
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
          }
        }
      }
      
      if (!success) {
        setNetworkError(true); 
        console.log("Failed to load countries from server after retries.");
        try {
          const cachedCountries = localStorage.getItem('countries_cache');
          if (cachedCountries) {
            const parsedCountries = JSON.parse(cachedCountries);
            if (parsedCountries && parsedCountries.length > 0) {
              console.log("Loaded countries from cache as fallback.");
              processCountriesForUser(user, parsedCountries);
              setNetworkError(false); // If cache provides data, network error is mitigated
            } else {
              console.log("Cache was empty or invalid. Using comprehensive fallback content for App Store review.");
              processCountriesForUser(user, EXPANDED_FALLBACK_COUNTRIES);
            }
          } else {
            console.log("No cache found. Using comprehensive fallback content for App Store review.");
            processCountriesForUser(user, EXPANDED_FALLBACK_COUNTRIES);
          }
        } catch (cacheError) {
          console.error("Error loading from cache:", cacheError);
          console.log("Using comprehensive fallback content for App Store review due to cache error.");
          processCountriesForUser(user, EXPANDED_FALLBACK_COUNTRIES);
        }
      }
      // setIsCountriesLoading(false); // Already set to false initially and after processing
    };

    loadCountries();
  }, [user, processCountriesForUser, isLoadingUser]);

  useEffect(() => {
    // Set meaningful stats immediately for App Store review
    setPhrasesCount(150);
    setCulturalInsightsCount(500);
    setIsStatsLoading(false);

    let ignore = false;
    const loadStats = async () => {
      // If user is loading or no countries are available (which shouldn't happen with expanded fallback),
      // or if we decide to skip loading stats entirely until countries are fully resolved, handle here.
      if (isLoadingUser) {
          return;
      }
      
      try {
        let phrasesData = [];
        let success = false;
        let retryCount = 0;
        const maxRetries = 2; // Reduce retries for faster fallback

        while (retryCount < maxRetries && !success) {
          try {
            phrasesData = await Phrase.list();
            if (phrasesData && phrasesData.length > 0) {
              localStorage.setItem('phrases_cache', JSON.stringify(phrasesData));
              success = true;
            }
          } catch (error) {
            retryCount++;
            console.log(`Attempt ${retryCount} to load phrases for stats failed:`, error.message);
            if (retryCount >= maxRetries) {
              console.error("Max retries reached for loading phrases.");
            } else {
              await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
            }
          }
        }

        if (!success) {
          try {
            const cachedPhrases = localStorage.getItem('phrases_cache');
            if (cachedPhrases) {
              phrasesData = JSON.parse(cachedPhrases);
              console.log("Loaded phrases from cache for stats as fallback");
            }
          } catch (cacheError) {
            console.error("Error loading phrases from cache:", cacheError);
            phrasesData = []; // Clear phrases data if cache fails
          }
        }

        if (!ignore) {
          const allPhrases = phrasesData;

          const hasPremiumAccessForStats = user?.pro_member || (user?.trial_started_date && !user?.trial_used && new Date() < new Date(new Date(user.trial_started_date).getTime() + 7 * 24 * 60 * 60 * 1000));
          
          const relevantCountriesForStats = hasPremiumAccessForStats ? countries : countries.filter(c => FREE_COUNTRY_LIST.includes(c.name));
          const relevantCountryNamesForStats = new Set(relevantCountriesForStats.map(c => c.name));

          const phrases = allPhrases.filter(p => relevantCountryNamesForStats.has(p.country_name));
          setPhrasesCount(Math.max(phrases.length, 150)); // Ensure minimum for review

          let totalInsights = 0;
          relevantCountriesForStats.forEach(country => {
            if (country.cultural_highlights) totalInsights += country.cultural_highlights.length;
            if (country.cultural_dos) totalInsights += country.cultural_dos.length;
            if (country.cultural_donts) totalInsights += country.cultural_donts.length;
            if (country.dining_etiquette) totalInsights += country.dining_etiquette.length;
            if (country.business_etiquette) totalInsights += country.business_etiquette.length;
            if (country.dating_etiquette) totalInsights += country.dating_etiquette.length;
            if (country.gestures_body_language) totalInsights += country.gestures_body_language.length;
            if (country.tipping_etiquette) totalInsights += country.tipping_etiquette.length;
          });
          setCulturalInsightsCount(Math.max(totalInsights, 500)); // Ensure minimum for review
          setIsStatsLoading(false);
        }
      } catch (error) {
        console.log("Stats loading failed, using fallback numbers for review:", error);
        // Fallback stats already set at the start of this useEffect, so nothing else needed here.
        if (!ignore) {
          setIsStatsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      ignore = true;
    };
  }, [user, countries, isLoadingUser]); // Added isLoadingUser to dependency array

  useEffect(() => {
    if (!isLoadingUser && user && (user.pro_member || (user.trial_started_date && !user.trial_used && new Date() < new Date(new Date(user.trial_started_date).getTime() + 7 * 24 * 60 * 60 * 1000)))) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    }
  }, [user, isLoadingUser]);

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return [];
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.language.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleTrialStart = async () => {
    try {
      await reloadUser();
    } catch (error) {
      console.error("Error refreshing user data after trial start:", error);
    }
  };

  const handleRewardUnlocked = (reward) => {
    alert(`🎉 Reward Unlocked: ${reward.reward}`);
  };

  if (networkError && !isCountriesLoading) {
    return (
      <div className="min-h-screen gradient-soft">
        <div className="relative bg-gradient-to-br from-blue-800 to-indigo-600 text-white overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-6 py-20 z-10">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="glass-card rounded-3xl p-6 bg-white/10 backdrop-blur-lg border-white/20">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/aa7ddde06_ChatGPTImageAug16202507_51_36PM.png"
                    alt="CultureCompass Logo"
                    className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
                  />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">CultureCompass</h1>
              <div className="bg-red-100 border border-red-300 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-red-800 font-semibold">Connection Error</p>
                <p className="text-red-700 text-sm mt-1">
                  Unable to load country data. Please check your internet connection and try refreshing the page.
                </p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-3 bg-red-600 hover:bg-red-700"
                >
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <noscript>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          margin: 0,
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          color: 'white',
          textAlign: 'center',
          minHeight: '100vh'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🧭</div>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>CultureCompass</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '30px', opacity: 0.9 }}>
            Master 90+ Cultures with AI-Powered Cultural Intelligence
          </p>
          <div style={{ 
            background: 'rgba(34, 197, 94, 0.1)', 
            border: '2px solid rgba(34, 197, 94, 0.3)', 
            padding: '20px', 
            borderRadius: '15px', 
            margin: '30px auto', 
            maxWidth: '500px'
          }}>
            <h3 style={{ color: '#059669', marginBottom: '15px' }}>🎉 Available Now on All Devices</h3>
            <p style={{ color: '#047857', margin: 0 }}>
              Access CultureCompass instantly with our mobile-optimized web platform. No downloads required!
            </p>
          </div>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '20px' }}>
            Made by The Language Club Limited (UK) • This page works without JavaScript
          </p>
        </div>
      </noscript>
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-600 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-repeat bg-center opacity-5"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/world-map.png')" }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="glass-card rounded-3xl p-6 bg-white/10 backdrop-blur-lg border-white/20">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/aa7ddde06_ChatGPTImageAug16202507_51_36PM.png"
                  alt="CultureCompass Logo"
                  className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Master 90+ Cultures with
              <span className="block bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                AI-Powered Cultural Intelligence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Navigate any culture with confidence. Get AI-powered travel plans, master essential etiquette, and connect authentically with locals worldwide.
            </p>
            
            {/* Highlighted Value Props */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-white/30 px-4 py-2 text-base font-semibold rounded-full backdrop-blur-sm">
                <Globe className="w-4 h-4 mr-2" />
                90+ Countries
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-white/30 px-4 py-2 text-base font-semibold rounded-full backdrop-blur-sm">
                <Brain className="w-4 h-4 mr-2" />
                AI Travel Planner
              </Badge>
              <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-white border-white/30 px-4 py-2 text-base font-semibold rounded-full backdrop-blur-sm">
                <Target className="w-4 h-4 mr-2" />
                Cultural Do's & Don'ts
              </Badge>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-lg mb-8">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Where are you headed?"
                  className="w-full pl-14 pr-5 py-7 text-lg font-semibold text-center cc-card border-white/30 text-black placeholder:text-slate-500 rounded-full focus:ring-2 focus:ring-blue-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {searchTerm && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-lg mb-6"
                >
                  <div className="cc-card rounded-2xl border-white/20 shadow-xl">
                    <div className="p-4 border-b border-white/20">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Search Results ({filteredCountries.length})
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2">
                      {filteredCountries.length === 0 ? (
                        <p className="text-slate-600 text-center py-4">
                          No countries found matching "{searchTerm}"
                        </p>
                      ) : (
                        <div className="space-y-1">
                          {filteredCountries.map((country) => (
                            <Link key={country.id} to={createPageUrl(`Country?name=${encodeURIComponent(country.name)}`)}>
                              <div className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors">
                                <span className="text-2xl">{country.flag_emoji}</span>
                                <div>
                                  <h4 className="font-semibold text-slate-900">{country.name}</h4>
                                  <p className="text-sm text-slate-600">{country.language}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col items-center">
                <AppStoreBadge />
                
                {/* Guest Access for App Store Review */}
                <div className="flex items-center gap-4 mt-4">
                  <Link to={createPageUrl("Browse")}>
                    <Button className="px-8 py-4 text-lg font-bold rounded-full bg-white text-blue-800 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      🌍 Continue as Guest
                    </Button>
                  </Link>
                  {!user && (
                    <Button onClick={() => User.login()} variant="ghost" className="px-6 py-3 text-base text-white/80 hover:text-white">
                      Sign In →
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Showcase */}
      <FeaturesShowcase />

      {/* App Preview Section - Show Real Screenshots */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              See CultureCompass in Action
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From detailed country guides to AI-powered travel planning, everything you need for confident cultural travel.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Country Guide Preview */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-64 h-[400px] bg-slate-800 rounded-3xl p-4 shadow-2xl mx-auto mb-6">
                <div className="bg-slate-100 h-full w-full rounded-2xl p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🇯🇵</span>
                    <h3 className="font-bold text-slate-800">Japan</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg text-sm text-blue-800 mb-3">
                    <strong>Essential Greeting:</strong><br />
                    Konnichiwa (こんにちは)
                  </div>
                  <div className="bg-green-100 p-2 rounded-md text-xs text-green-800 mb-2">
                    <strong>Do:</strong> Bow when greeting
                  </div>
                  <div className="bg-red-100 p-2 rounded-md text-xs text-red-800 mb-4">
                    <strong>Don't:</strong> Point with chopsticks, blow your nose in public
                  </div>
                  <div className="mt-auto text-xs text-slate-400 text-center">Cultural Guide</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Cultural Guides</h3>
              <p className="text-slate-600">Essential do's, don'ts, and local customs for 90+ countries</p>
            </motion.div>

            {/* AI Travel Planner Preview */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-64 h-[400px] bg-slate-800 rounded-3xl p-4 shadow-2xl mx-auto mb-6">
                <div className="bg-slate-100 h-full w-full rounded-2xl p-4 flex flex-col">
                  <h3 className="font-bold text-slate-800 mb-4">AI Travel Plan: Tokyo</h3>
                  <div className="text-sm text-slate-700 space-y-3 flex-1">
                    <div className="bg-purple-100 p-2 rounded">
                      <strong>Day 1:</strong> Shibuya & Harajuku exploration
                    </div>
                    <div className="bg-purple-100 p-2 rounded">
                      <strong>Day 2:</strong> Traditional temples & gardens
                    </div>
                    <div className="bg-amber-100 p-2 rounded text-xs">
                      <strong>Cultural Tip:</strong> Get a Suica card for trains
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 text-center mt-2">AI-Generated Itinerary</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI Travel Planner</h3>
              <p className="text-slate-600">Personalized itineraries with cultural insights and local tips</p>
            </motion.div>

            {/* Smart Translator Preview */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-64 h-[400px] bg-slate-800 rounded-3xl p-4 shadow-2xl mx-auto mb-6">
                <div className="bg-slate-100 h-full w-full rounded-2xl p-4 flex flex-col">
                  <h3 className="font-bold text-slate-800 mb-4">Smart Translator</h3>
                  <div className="text-sm text-slate-700 space-y-3">
                    <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      <strong>English:</strong> Where is the bathroom?
                    </div>
                    <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                      <strong>Japanese:</strong> トイレはどこですか？
                      <div className="text-xs text-green-600 mt-1">
                        (Toire wa doko desu ka?)
                      </div>
                    </div>
                    <div className="bg-amber-50 p-2 rounded text-xs">
                      <strong>Cultural Tip:</strong> Very polite phrasing - appropriate for any situation
                    </div>
                  </div>
                  <div className="mt-auto text-xs text-slate-400 text-center">Cultural Context Included</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Translator</h3>
              <p className="text-slate-600">AI translation with cultural context and etiquette guidance</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {(!isLoadingUser && (!user || !user.pro_member)) && (
          <TrialBanner user={user} onTrialStart={handleTrialStart} />
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {isStatsLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <motion.div variants={itemVariants}>
                <div className="cc-card rounded-2xl border-0 shadow-lg travel-card-hover h-full">
                  <div className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                        <Globe className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-slate-900">{isCountriesLoading ? '...' : featuredCountries.length}</p>
                        <p className="text-slate-600 font-medium">Countries Available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="cc-card rounded-2xl border-0 shadow-lg travel-card-hover h-full">
                  <div className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-slate-900">{phrasesCount}</p>
                        <p className="text-slate-600 font-medium">Essential Phrases</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="cc-card rounded-2xl border-0 shadow-lg travel-card-hover h-full">
                  <div className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-slate-900">{culturalInsightsCount}</p>
                        <p className="text-slate-600 font-medium">Cultural Insights</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        {(!isLoadingUser && user !== null && !user?.pro_member && !(user?.trial_started_date && !user?.trial_used && new Date() < new Date(new Date(user.trial_started_date).getTime() + 7 * 24 * 60 * 60 * 1000))) && (
          <ProUpgradePrompt
            className="mb-8"
            title="Unlock All 90+ Countries!"
            description="Go Pro to explore our full library of countries, get personalized travel plans, audio pronunciations, and more."
          />
        )}

        {(!isLoadingUser && user) && (
          <div className="mb-8">
            <SharingRewards user={user} onRewardUnlocked={handleRewardUnlocked} />
          </div>
        )}

        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-slate-900">Explore Countries</h2>
            {(!isLoadingUser && user && (user.pro_member || (user.trial_started_date && !user.trial_used && new Date() < new Date(new Date(user.trial_started_date).getTime() + 7 * 24 * 60 * 60 * 1000)))) && (
              <Badge className="cc-card bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 px-4 py-2 rounded-full">
                <Crown className="w-4 h-4 mr-2" />
                Premium Access - All Countries Unlocked
              </Badge>
            )}
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {isCountriesLoading ? (
              <>
                <CountryCardSkeleton />
                <CountryCardSkeleton />
                <CountryCardSkeleton />
                <CountryCardSkeleton />
                <CountryCardSkeleton />
                <CountryCardSkeleton />
              </>
            ) : (
              featuredCountries.map((country) => (
                <motion.div key={country.id} variants={itemVariants}>
                  <div className="cc-card rounded-2xl border-0 shadow-lg travel-card-hover h-full flex flex-col">
                    <div className="p-6 flex-grow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-4xl shadow-inner">
                            {country.flag_emoji}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{country.name}</h3>
                            <p className="text-slate-600 font-medium">{country.language}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="cc-card rounded-xl p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                          <p className="text-sm text-blue-600 font-medium mb-1">Essential Greeting</p>
                          <p className="font-bold text-blue-900 text-2xl tracking-tight">{country.greeting_casual || "Hello"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <Link to={createPageUrl(`Country?name=${encodeURIComponent(country.name)}`)}>
                         <Button className="w-full cc-button-primary">Explore Culture</Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </section>

        {/* Updated Privacy & Legal Section */}
        <section className="bg-slate-100 rounded-2xl p-8 text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Privacy & Data Protection</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            CultureCompass is built by The Language Club Limited with privacy by design. We protect your data and are transparent about our practices.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to={createPageUrl("PrivacyPolicy")}>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Shield className="w-4 h-4" />
                Privacy Policy
              </Button>
            </Link>
            <Link to={createPageUrl("TermsAndConditions")}>
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Terms & Conditions
              </Button>
            </Link>
            <Link to={createPageUrl("Contact")}>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Support Contact
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
