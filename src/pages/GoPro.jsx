
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Sparkles, Plane, Users, MessageCircle, Download, Award, Shield, ArrowLeft, X, Zap, Languages, Hand, Luggage, Globe, CheckCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'react-router-dom';

const featureComparison = [
  {
    category: "🌍 Country Access & Content",
    features: [
      { name: "Access to 5 popular countries (France, Japan, Thailand, Italy, Spain)", free: true, pro: true },
      { name: "Access to all 90+ countries worldwide", free: false, pro: true },
      { name: "New countries added monthly", free: false, pro: true },
      { name: "Premium cultural insights and etiquette guides", free: false, pro: true }
    ]
  },
  {
    category: "🤖 AI & Smart Tools",
    features: [
      { name: "Basic cultural phrases and greetings", free: true, pro: true },
      { name: "Smart Translator with Cultural Context", free: false, pro: true },
      { name: "AI-powered travel planner & custom itineraries", free: false, pro: true },
      { name: "Audio pronunciations for all languages", free: false, pro: true },
      { name: "Offline access to all content", free: false, pro: true },
      { name: "Advanced packing assistant with weather integration", free: false, pro: true }
    ]
  },
  {
    category: "📚 Learning & Personalization",
    features: [
      { name: "Basic gesture guide", free: true, pro: true },
      { name: "5 bookmarks limit", free: true, pro: false },
      { name: "Unlimited bookmarks & personal notes", free: false, pro: true },
      { name: "Progress tracking & cultural achievements", free: false, pro: true },
      { name: "Personalized cultural recommendations", free: false, pro: true }
    ]
  },
  {
    category: "🎯 Premium Experience",
    features: [
      { name: "Priority customer support", free: false, pro: true },
      { name: "Early access to new features", free: false, pro: true },
      { name: "Export travel itineraries & guides", free: false, pro: true }
    ]
  }
];

// New tiers definition, replacing the old 'plans'
const tiers = [
  {
    name: 'Pro',
    id: 'pro',
    href: { // Placeholder Stripe links for monthly and annually
      monthly: 'https://buy.stripe.com/bJe8wIfma9MufL27j39MY03', // Original monthly link
      annually: 'https://buy.stripe.com/bJe3co7TIe2KaqIcDn9MY04' // Original yearly link
    },
    price: { monthly: '£2.99', annually: '£24.99' }, // Using original prices
    description: 'Unlock everything CultureCompass has to offer. The ultimate tool for the modern traveler.',
    features: [
      'Access to all 90+ country guides',
      'Unlimited AI Travel Planner requests',
      'Full access to Smart Translator',
      'Audio pronunciations for all phrases',
      'Unlimited bookmarks and personal notes',
      'Offline access to saved content',
      'Exclusive access to new features'
    ],
    mostPopular: true,
  },
];

// Extracted FAQs into a constant array
const faqs = [
  {
    q: "What happens after my free trial?",
    a: "After 7 days, you'll be charged for your selected plan unless you cancel. You can cancel anytime with no penalties through your account settings."
  },
  {
    q: "Can I change plans later?",
    a: "Yes! You can upgrade, downgrade, or cancel your subscription at any time from your account settings. Changes take effect immediately."
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 30-day money-back guarantee. If you're not satisfied, contact us at info@culturecompass.app for a full refund."
  },
  {
    q: "Is my payment information secure?",
    a: "Absolutely. All payments are processed securely through Stripe with industry-standard encryption. We never store your payment details."
  },
  {
    q: "What data do you collect?",
    a: "We collect account info, learning progress, and usage patterns to personalize your experience. View our Privacy Policy and Data Usage pages for complete details."
  }
];

export default function GoProPage() {
  const { user, isLoadingUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState('annually'); // New state for monthly/annually toggle
  const [isSubscribing, setIsSubscribing] = useState(false); // New state for subscription processing

  const handleSubscribe = () => {
    if (!user) {
      alert("Please sign in to subscribe.");
      User.login(); // Assuming User.login is a function that initiates login.
      return;
    }

    const selectedTier = tiers[0]; // Assuming only one 'Pro' tier for now.
    const checkoutUrl = selectedTier.href[billingCycle];

    if (checkoutUrl) {
      setIsSubscribing(true);
      // Redirect to Stripe checkout page
      window.location.href = checkoutUrl;
    } else {
      console.error("Stripe checkout URL not found for selected plan.");
      alert("Error processing your request. Please try again.");
      setIsSubscribing(false);
    }
  };
  
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Crown className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold">Loading Premium Options...</p>
        </div>
      </div>
    );
  }

  if (user && user.pro_member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center cc-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="w-8 h-8 text-amber-500" />
              You're Already Premium!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Thank you for being a Premium member. You have access to all features!
            </p>
            <Link to={createPageUrl("index")}>
              <Button className="cc-button-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Exploring
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"> {/* Updated root div class */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 cc-animate-fade-in">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 p-4 rounded-full mb-6 shadow-lg"
          >
            <Crown className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
            Unlock Your Ultimate 
            <span className="block bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Cultural Journey
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Go Premium for complete global access, AI-powered tools, smart translation with cultural context, and your personal travel companion.
          </p>
          <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-6 py-3 text-base font-semibold rounded-full shadow-sm">
            🎉 7-Day Free Trial • Cancel Anytime
          </Badge>
        </div>

        {/* Pricing Section (new) */}
        <div className="mt-16">
          <div className="relative">
            <div className="absolute inset-0 h-1/2" />
            <div className="relative max-w-xl mx-auto">
              {/* Billing Cycle Toggle */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-md shadow-sm bg-slate-200 p-1">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      billingCycle === 'monthly' ? 'bg-white text-blue-700 shadow' : 'text-slate-700 hover:text-blue-700'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('annually')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      billingCycle === 'annually' ? 'bg-white text-blue-700 shadow' : 'text-slate-700 hover:text-blue-700'
                    }`}
                  >
                    Annually <Badge className="ml-2 bg-blue-100 text-blue-800">Save 30%</Badge>
                  </button>
                </div>
              </div>

              {tiers.map((tier) => (
                <Card
                  key={tier.id}
                  className={`cc-card ${tier.mostPopular ? 'border-2 border-blue-500' : ''}`}
                >
                  {tier.mostPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-slate-900">{tier.name}</CardTitle>
                    <p className="text-slate-600 mt-2">{tier.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-center gap-x-2 my-4">
                      <span className="text-5xl font-bold tracking-tight text-slate-900">
                        {billingCycle === 'monthly' ? tier.price.monthly : tier.price.annually}
                      </span>
                      <span className="text-lg font-semibold leading-6 tracking-wide text-slate-600">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-700">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex gap-x-3">
                          <CheckCircle className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={handleSubscribe} 
                      className="mt-8 w-full cc-button-primary"
                      disabled={isSubscribing}
                    >
                      {isSubscribing ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                           <Zap className="w-5 h-5 mr-2" />
                           Subscribe Now
                        </>
                      )}
                    </Button>
                    
                    {!user && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-600 mb-3 text-center">Need an account?</p>
                        <Button 
                          onClick={() => User.login()} 
                          variant="outline" 
                          className="w-full py-2 text-sm rounded-xl border-slate-300 hover:border-slate-400"
                        >
                          Sign In
                        </Button>
                      </div>
                    )}

                    <p className="text-xs text-center text-slate-500 mt-2">
                      You will be redirected to Stripe to complete your purchase.
                    </p>
                    <p className="text-xs text-center text-slate-500 mt-1">
                      {billingCycle === 'annually' ? '7-day free trial, then billed annually. Cancel anytime.' : 'Billed monthly. Cancel anytime.'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mb-16 cc-animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-8">
            Compare Plans
          </h2>
          <div className="cc-card border-0 shadow-xl overflow-hidden max-w-6xl mx-auto">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <div></div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900">Free</h3>
                <p className="text-sm text-slate-600">£0 forever</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-slate-900">Premium</h3>
                </div>
                <p className="text-sm text-slate-600">From £2.99/month</p>
              </div>
            </div>

            {/* Feature Categories */}
            {featureComparison.map((category, categoryIndex) => (
              <div key={category.category}>
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-800">{category.category}</h4>
                </div>
                {category.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="grid grid-cols-3 gap-4 p-4 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center">
                      <span className="text-sm text-slate-700">{feature.name}</span>
                    </div>
                    <div className="text-center flex items-center justify-center">
                      {feature.free ? (
                        <Check className="w-5 h-5 text-blue-500" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="text-center flex items-center justify-center">
                      {feature.pro ? (
                        <Check className="w-5 h-5 text-blue-500" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* App Store Compliance */}
        <div className="mb-16 cc-animate-slide-up">
          <Card className="cc-card border-0 shadow-lg bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Shield className="w-5 h-5" />
                Privacy & Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700">
              <p className="mb-4 text-sm">
                CultureCompass is committed to protecting your privacy. We use your data to provide personalized cultural insights, track learning progress, and improve our services.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <strong>We collect:</strong> Account info, learning progress, bookmarks, usage analytics
                </div>
                <div>
                  <strong>We don't:</strong> Sell your data or share personal info with advertisers
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Link to={createPageUrl("PrivacyPolicy")}>
                  <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 hover:border-blue-400">
                    Privacy Policy
                  </Button>
                </Link>
                <Link to={createPageUrl("DataUsage")}>
                  <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 hover:border-blue-400">
                    Data Usage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto cc-animate-slide-up">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="cc-card border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
