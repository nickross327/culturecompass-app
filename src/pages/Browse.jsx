
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Countries } from '@/api/entities';
import { Rules } from '@/api/entities';
import { Sections } from '@/api/entities';
import { QuickTips } from '@/api/entities';
import { Favorites } from '@/api/entities'; // Added Favorites entity
import { Event } from '@/api/entities'; // Import the new Event entity
import { InvokeLLM } from '@/api/integrations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, XCircle, Globe, PlusCircle, Brain, Send, Sparkles, Loader, Search, Heart, Share2, ChevronDown } from 'lucide-react'; // Added Heart and Share2 icons
import { useAuth } from '@/components/auth/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

const SkeletonLoader = ({ count = 3 }) => (
  <div className="space-y-2 p-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-4 rounded-lg bg-white border border-slate-200 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="h-6 w-16 bg-slate-200 rounded"></div>
          <div className="flex-1 min-w-0 ml-3"> {/* Added ml-3 for spacing */}
            <div className="h-5 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const RulesSkeleton = () => (
    <div className="animate-pulse space-y-6">
        <div>
            <div className="h-6 w-1/3 bg-slate-200 rounded mb-4"></div>
            <div className="space-y-3">
                <div className="h-16 bg-slate-100 rounded-lg"></div>
                <div className="h-16 bg-slate-100 rounded-lg"></div>
            </div>
        </div>
        <div>
            <div className="h-6 w-1/3 bg-slate-200 rounded mb-4"></div>
            <div className="space-y-3">
                <div className="h-16 bg-slate-100 rounded-lg"></div>
            </div>
        </div>
    </div>
);

const embeddedData = {
  countries: [
    { iso2: 'US', name: 'United States', emojiFlag: '🇺🇸', summary: 'A diverse nation with a wide range of cultural norms, from the fast-paced East Coast to the laid-back West Coast. Individualism and directness are highly valued.' },
    { iso2: 'JP', name: 'Japan', emojiFlag: '🇯🇵', summary: 'A culture of deep-rooted traditions and cutting-edge modernity. Politeness, respect, and group harmony are paramount. Punctuality is strictly observed.' },
    { iso2: 'FR', name: 'France', emojiFlag: '🇫🇷', summary: 'A culture that prides itself on sophistication, intellectualism, and the art of living ("art de vivre"). Formal greetings are essential in shops and interactions.' },
    { iso2: 'IT', name: 'Italy', emojiFlag: '🇮🇹', summary: 'Family, food, and fashion are central to Italian life. Known for its regional diversity, expressive communication, and the importance of making a good impression ("la bella figura").' },
    { iso2: 'ES', name: 'Spain', emojiFlag: '🇪🇸', summary: 'A social and family-oriented culture that enjoys a relaxed pace of life. Late dinners, afternoon siestas (in some regions), and vibrant festivals are common.' },
    { iso2: 'DE', name: 'Germany', emojiFlag: '🇩🇪', summary: 'Punctuality, order, and efficiency are core cultural values. Germans are typically direct in their communication and appreciate well-thought-out plans.' },
    { iso2: 'GB', name: 'United Kingdom', emojiFlag: '🇬🇧', summary: 'A culture of politeness, reserve, and a unique sense of humor. Queuing is a sacred social rule, and "please" and "thank you" are used extensively.' },
    { iso2: 'CN', name: 'China', emojiFlag: '🇨🇳', summary: 'A collective culture where the concepts of "face" (mianzi), respect for elders, and group harmony are crucial. Business is often built on personal relationships (guanxi).' },
    { iso2: 'IN', name: 'India', emojiFlag: '🇮🇳', summary: 'A vast and incredibly diverse country with a tapestry of languages, religions, and customs. Family and hierarchy are important, and the concept of "guest is God" is prevalent.' },
    { iso2: 'BR', name: 'Brazil', emojiFlag: '🇧🇷', summary: 'A warm, vibrant, and relationship-oriented culture. Brazilians are known for their friendliness, expressiveness, and love for music and dance. Physical touch is common.' },
    { iso2: 'KR', name: 'South Korea', emojiFlag: '🇰🇷', summary: 'A fast-paced, technologically advanced society that maintains strong Confucian values. Hierarchy, respect for elders, and group harmony are vital.' },
    { iso2: 'CA', name: 'Canada', emojiFlag: '🇨🇦', summary: 'A multicultural and generally polite society. Known for its emphasis on tolerance and diversity. Apologizing, even when not at fault, is a cultural quirk.' },
    { iso2: 'AU', name: 'Australia', emojiFlag: '🇦🇺', summary: 'A laid-back, egalitarian culture with a love for the outdoors. Australians are generally friendly, direct, and have a self-deprecating sense of humor.' },
    { iso2: 'TH', name: 'Thailand', emojiFlag: '🇹🇭', summary: 'The "Land of Smiles" is known for its gentle, respectful, and non-confrontational culture. The "wai" greeting is used to show respect.' },
    { iso2: 'MX', name: 'Mexico', emojiFlag: '🇲🇽', summary: 'A culture rich in history, family values, and national pride. Politeness and building personal rapport are important before discussing business.' },
    { iso2: 'ZA', name: 'South Africa', emojiFlag: '🇿🇦', summary: 'The "Rainbow Nation" is a melting pot of cultures. It has a complex history and a diverse society with 11 official languages.' },
    { iso2: 'EG', name: 'Egypt', emojiFlag: '🇪🇬', summary: 'A culture with a deep sense of history and strong family ties. Hospitality is a cornerstone, and social life often revolves around family and friends.' },
    { iso2: 'RU', name: 'Russia', emojiFlag: '🇷🇺', summary: 'A culture of stoicism and deep friendships. Smiling at strangers is uncommon, but once a relationship is formed, Russians are known for their warmth and generosity.' },
    { iso2: 'TR', name: 'Turkey', emojiFlag: '🇹🇷', summary: 'A bridge between East and West, with a culture that values hospitality, respect for elders, and national pride. Offering tea or coffee is a common gesture of welcome.' },
    { iso2: 'AR', name: 'Argentina', emojiFlag: '🇦🇷', summary: 'A passionate culture with strong European influences, famous for tango, football, and social gatherings. Punctuality is flexible, and personal relationships are key.' }
  ],
  rules: [
    { country: 'US', type: 'Do', text: 'Use a firm handshake when meeting someone.', priority: 5 },
    { country: 'US', type: "Don't", text: 'Ask about someone\'s salary or political affiliation upon first meeting.', priority: 5 },
    { country: 'JP', type: 'Do', text: 'Bow as a form of greeting and respect.', priority: 5 },
    { country: 'JP', type: "Don't", text: 'Stick your chopsticks upright in a bowl of rice.', priority: 5 },
    { country: 'FR', type: 'Do', text: 'Say "Bonjour" when entering a shop and "Au revoir" when leaving.', priority: 5 },
    { country: 'FR', type: "Don't", text: 'Discuss money or personal wealth in social settings.', priority: 4 },
    { country: 'IT', type: 'Do', text: 'Take time to appreciate and savor your meals.', priority: 5 },
    { country: 'IT', type: "Don't", text: 'Order a cappuccino after 11 a.m. (it\'s considered a breakfast drink).', priority: 3 },
    { country: 'ES', type: 'Do', text: 'Understand that dinner is often eaten late, around 9 p.m. or later.', priority: 4 },
    { country: 'ES', type: "Don't", text: 'Be strictly punctual for social gatherings; being 15-20 minutes late is common.', priority: 3 },
    { country: 'DE', type: 'Do', text: 'Be on time for appointments, as punctuality is highly valued.', priority: 5 },
    { country: 'DE', type: "Don't", text: 'Cross the street on a red pedestrian light, even if there are no cars.', priority: 4 },
    { country: 'GB', type: 'Do', text: 'Queue patiently in line and wait your turn.', priority: 5 },
    { country: 'GB', type: "Don't", text: 'Engage in loud conversations in public transport.', priority: 4 },
    { country: 'CN', type: 'Do', text: 'Use both hands when giving or receiving a business card.', priority: 5 },
    { country: 'CN', type: "Don't", text: 'Leave a tip, as it can be seen as impolite.', priority: 4 },
    { country: 'IN', type: 'Do', text: 'Use your right hand for eating and handling money.', priority: 5 },
    { country: 'IN', type: "Don't", text: 'Point your feet at people or religious idols.', priority: 5 },
    { country: 'BR', type: 'Do', text: 'Greet with a kiss or two on the cheek in social settings.', priority: 4 },
    { country: 'BR', type: "Don't", text: 'Use the "OK" hand gesture, as it is considered offensive.', priority: 5 },
    { country: 'KR', type: 'Do', text: 'Wait for the eldest person to start eating before you begin.', priority: 5 },
    { country: 'KR', type: "Don't", text: 'Pour your own drink; it is customary to pour for others.', priority: 4 },
    { country: 'CA', type: 'Do', text: 'Be polite and say "please," "thank you," and "sorry" frequently.', priority: 5 },
    { country: 'CA', type: "Don't", text: 'Underestimate the cultural differences between Canada and the USA.', priority: 3 },
    { country: 'AU', type: 'Do', text: 'Use a friendly, informal greeting like "G\'day, mate".', priority: 4 },
    { country: 'AU', type: "Don't", text: 'Brag or act superior; egalitarianism is valued.', priority: 5 },
    { country: 'TH', type: 'Do', text: 'Show deep respect for the monarchy.', priority: 5 },
    { country: 'TH', type: "Don't", text: 'Touch someone\'s head, as it\'s considered the most sacred part of the body.', priority: 5 },
    { country: 'MX', type: 'Do', text: 'Engage in some small talk before getting to business matters.', priority: 4 },
    { country: 'MX', type: "Don't", text: 'Be overly direct or confrontational.', priority: 4 },
  ]
};

const FALLBACK_COUNTRIES = embeddedData.countries.slice(0, 6);
const FALLBACK_RULES = embeddedData.rules.filter(r => ['JP', 'FR', 'TH', 'IT', 'DE', 'ES'].includes(r.country));

export default function BrowsePage() {
  const readOnly = true; // App Store build flag, disables editing controls
  const { user } = useAuth(); // user can be null for unauthenticated access
  
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null); // This is the page variable
  const [rules, setRules] = useState([]);
  const [sections, setSections] = useState([]);
  const [quickTips, setQuickTips] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingRules, setIsLoadingRules] = useState(false);
  const [isLoadingSections, setIsLoadingSections] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [guestMode, setGuestMode] = useState(false); // Added guestMode state

  // AI Planner state
  const [showAiPlanner, setShowAiPlanner] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const [allRules, setAllRules] = useState([]); // All rules fetched from DB
  const [favorites, setFavorites] = useState([]); // User's favorited countries
  const [isCountryFavorited, setIsCountryFavorited] = useState(false); // State for selected country's favorite status
  const [activeTab, setActiveTab] = useState('countries'); // State to manage active tab: 'countries' or 'favorites'

  const loadData = useCallback(async (isRefresh = false) => {
    setIsLoadingCountries(true);
    setNetworkError(false);
    
    // Load embedded data first for immediate UI
    const embeddedCountries = embeddedData.countries.map((c, index) => ({ ...c, id: `embedded-${index}` }));
    const embeddedRules = embeddedData.rules.map((r, index) => ({ ...r, id: `embedded-rule-${index}` }));
    
    // Set embedded data first for instant loading
    if (!isRefresh) {
      setCountries(embeddedCountries);
      setAllRules(embeddedRules);
      setIsLoadingCountries(false);
    }
    
    try {
      const [countriesData, rulesData] = await Promise.all([
        Countries.list('name', 100),
        Rules.list('-priority', 500)
      ]);
      
      // Process Countries
      const uniqueCountriesMap = new Map();
      countriesData.forEach(country => {
        if (country.iso2 && !uniqueCountriesMap.has(country.iso2)) {
          uniqueCountriesMap.set(country.iso2, country);
        }
      });
      const uniqueCountriesData = Array.from(uniqueCountriesMap.values());

      if (uniqueCountriesData.length === 0 && !isRefresh) {
        console.warn('No countries data from server, keeping embedded data');
        setNetworkError(true);
      } else {
        setCountries(uniqueCountriesData.length > 0 ? uniqueCountriesData : embeddedCountries);
        setAllRules(rulesData.length > 0 ? rulesData : embeddedRules);
      }
      
      // Store last updated timestamp
      if (uniqueCountriesData.length > 0 || rulesData.length > 0) { // sectionsData removed here as it's fetched per country
        localStorage.setItem('culturecompass_last_sync', new Date().toISOString());
      }
      
      // Load user favorites if logged in
      if (user) {
        try {
          const userFavorites = await Favorites.filter({ userId: user.id });
          setFavorites(userFavorites);
        } catch (error) {
          console.error('Failed to load favorites:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load data from server:', error);
      if (isRefresh) {
        setNetworkError(true);
      }
    } finally {
      setIsLoadingCountries(false);
    }
  }, [user]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Debounced search event logging
  useEffect(() => {
    if (!searchTerm.trim() || !user) {
      return;
    }

    const handler = setTimeout(() => {
      Event.create({
        type: 'Searched',
        details: { searchTerm: searchTerm.trim() }
      }).catch(console.error); // Fire-and-forget
    }, 1000); // Debounce for 1 second

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, user]);

  // Set initial country when countries load
  useEffect(() => {
    // On Page Load: If SelectedCountry is null and countries exist, set to first
    if (!selectedCountry && countries.length > 0) {
      setSelectedCountry(countries[0]);
    }
  }, [countries, selectedCountry]);

  // Filter rules and sections for the selected country (runs when selectedCountry or allRules change)
  useEffect(() => {
    if (selectedCountry && allRules.length > 0) {
      setIsLoadingRules(true);
      const filtered = allRules.filter(rule => rule.country === selectedCountry.iso2);
      
      // Deduplicate rules for display (already done for allRules, but good to ensure here too)
      const uniqueRulesMap = new Map();
      const deduplicatedFilteredRules = [];
      filtered.forEach(rule => {
        const ruleKey = `${rule.country}|${rule.type}|${rule.text}`;
        if (!uniqueRulesMap.has(ruleKey)) {
          uniqueRulesMap.set(ruleKey, rule);
          deduplicatedFilteredRules.push(rule);
        }
      });
      
      setRules(deduplicatedFilteredRules);
      setIsLoadingRules(false);
    } else if (!selectedCountry) {
        setRules([]); // Clear rules if no country is selected
    } else if (selectedCountry && allRules.length === 0) {
      setRules([]); // If country is selected but no rules are loaded yet
      setIsLoadingRules(false);
    }

    // Load sections for the selected country
    if (selectedCountry) {
      setIsLoadingSections(true);
      Sections.filter({ country: selectedCountry.iso2 })
        .then(sectionsData => {
          // Sort by order
          const sortedSections = sectionsData.sort((a, b) => (a.order || 0) - (b.order || 0));
          setSections(sortedSections);
        })
        .catch(error => {
          console.error('Failed to load sections:', error);
          setSections([]);
        })
        .finally(() => {
          setIsLoadingSections(false);
        });

      // Load quick tips for the selected country
      QuickTips.filter({ country: selectedCountry.iso2 })
        .then(tipsData => {
          // Sort by priority (highest first) and limit to 3
          const sortedTips = tipsData
            .sort((a, b) => (b.priority || 0) - (a.priority || 0))
            .slice(0, 3);
          setQuickTips(sortedTips);
        })
        .catch(error => {
          console.error('Failed to load quick tips:', error);
          setQuickTips([]);
        });
    } else {
      setSections([]);
      setQuickTips([]);
    }
  }, [selectedCountry, allRules]);

  // Check if selected country is favorited
  useEffect(() => {
    if (selectedCountry && user) {
      const favorited = favorites.some(fav => fav.country === selectedCountry.iso2);
      setIsCountryFavorited(favorited);
    } else {
      setIsCountryFavorited(false);
    }
  }, [selectedCountry, favorites, user]);

  const displayedCountries = useMemo(() => {
    let listToFilter = [];
    if (activeTab === 'countries') {
      listToFilter = countries;
    } else if (activeTab === 'favorites' && user) {
      const favoritedIso2s = new Set(favorites.map(fav => fav.country));
      listToFilter = countries.filter(country => favoritedIso2s.has(country.iso2));
    }

    if (!searchTerm) {
      return listToFilter;
    }
    return listToFilter.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, favorites, searchTerm, activeTab, user]);

  // On row tap: set SelectedCountry = row
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowAiPlanner(false); // Also reset AI planner view
    setAiResponse('');
    setAiPrompt('');
    
    // Log ViewedCountry event
    if (user && country?.iso2) {
      Event.create({
        type: 'ViewedCountry',
        countryIso2: country.iso2
      }).catch(console.error); // Fire-and-forget
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert('Please sign in to save favorites!'); // Provide feedback for unauthenticated users
      return;
    }

    if (!selectedCountry) return;

    try {
      if (isCountryFavorited) {
        // Remove from favorites
        const existingFavorite = favorites.find(fav => fav.country === selectedCountry.iso2);
        if (existingFavorite) {
          await Favorites.delete(existingFavorite.id);
          setFavorites(favorites.filter(fav => fav.id !== existingFavorite.id));
        }
      } else {
        // Add to favorites
        const newFavorite = await Favorites.create({
          userId: user.id,
          country: selectedCountry.iso2,
          createdAt: new Date().toISOString()
        });
        setFavorites([...favorites, newFavorite]);
        
        // Log Bookmarked event
        Event.create({
          type: 'Bookmarked',
          countryIso2: selectedCountry.iso2
        }).catch(console.error); // Fire-and-forget
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites. Please try again.');
    }
  };

  const handleShare = async () => {
    if (!selectedCountry) return;

    const shareData = {
      title: `CultureCompass - ${selectedCountry.name}`,
      text: `${selectedCountry.name} – key dos & don’ts on CultureCompass`,
      url: `https://app.culturecompass.app/country/${selectedCountry.iso2}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
        alert('Could not copy link. Please copy it manually.');
      }
    }
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getTopRule = (countryIso, type) => {
    return allRules.find(rule => rule.country === countryIso && rule.type === type);
  };

  const getSamplePrompts = (countryName) => [
    `Greeting etiquette in ${countryName}`,
    `Dining etiquette in ${countryName}`,
    `Business meeting tips for ${countryName}`
  ];

  const getFallbackResponse = (countryName, prompt) => {
    // Prewritten responses for common scenarios to ensure screen is never empty
    return `AI generation is currently unavailable. Here is some general guidance for travelers in ${countryName}:

- **Be Polite:** Always use basic pleasantries like "please" and "thank you" in the local language if you can.
- **Follow Local Cues:** Observe how people interact, dress, and behave in public spaces. When in doubt, it's better to be more formal and reserved.
- **Ask Before Taking Photos:** Never take pictures of people, especially children, without their explicit permission. Be extra respectful when near religious sites or during ceremonies.

Respect for local customs is the key to a positive and meaningful travel experience.`;
  };

  const handleAiPlannerToggle = () => {
    setShowAiPlanner(!showAiPlanner);
    setAiResponse('');
    setAiPrompt('');
  };

  const handlePromptSelect = (prompt) => {
    setAiPrompt(prompt);
  };

  const handleAiQuery = async () => {
    if (!aiPrompt.trim() || !selectedCountry) return;
    
    setIsGeneratingAi(true);
    setAiResponse('');

    // Log PlannerAsked event
    if (user && selectedCountry?.iso2) {
      Event.create({
        type: 'PlannerAsked',
        countryIso2: selectedCountry.iso2,
        details: { prompt: aiPrompt }
      }).catch(console.error); // Fire-and-forget
    }
    
    try {
      const result = await InvokeLLM({
        prompt: `You are a cultural etiquette expert providing practical travel advice. Answer this question about ${selectedCountry.name}: "${aiPrompt}"
        
        Provide specific, actionable advice focusing on:
        - Cultural do's and don'ts
        - Practical etiquette tips
        - Common mistakes to avoid
        - Respectful approaches to local customs
        
        Keep the response helpful, respectful, and focused on cultural sensitivity.`,
        add_context_from_internet: false
      });
      
      setAiResponse(result || getFallbackResponse(selectedCountry.name, aiPrompt));
    } catch (error) {
      console.error('AI query failed:', error);
      // Always show fallback response to ensure screen is never empty
      setAiResponse(getFallbackResponse(selectedCountry.name, aiPrompt));
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const dos = rules.filter(r => r.type === 'Do');
  const donts = rules.filter(r => r.type === "Don't");

  // Check if user is admin (handles null user case)
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Cultural Browse</h1>
          <p className="text-slate-600">Explore countries and their cultural do's and don't's</p>
          {!user && (
            <p className="text-sm text-slate-500 mt-1">
              💡 Sign in to access AI travel planner, achievements, and other premium features
            </p>
          )}
          {networkError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-yellow-800">
                ⚠️ Using offline content. Some features may be limited due to a network issue.
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Countries List - Left Panel */}
          <div className="lg:col-span-1">
            <Card className="h-full cc-card">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => setActiveTab('countries')}
                      className={`px-4 py-2 ${activeTab === 'countries' ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-slate-600 hover:bg-blue-50'}`}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Countries ({countries.length})
                    </Button>
                    {user && (
                      <Button 
                        variant="ghost" 
                        onClick={() => setActiveTab('favorites')}
                        className={`px-4 py-2 ${activeTab === 'favorites' ? 'bg-red-100 text-red-800 font-semibold' : 'text-slate-600 hover:bg-red-50'}`}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Favorites ({favorites.length})
                      </Button>
                    )}
                  </div>
                  {isAdmin && !readOnly && (
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100">
                      <PlusCircle className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder={`Search ${activeTab === 'countries' ? 'countries' : 'favorites'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[50vh] lg:max-h-[60vh] overflow-y-auto">
                  {isLoadingCountries ? (
                    <SkeletonLoader count={5} />
                  ) : displayedCountries.length > 0 ? (
                    <div className="space-y-1 p-2">
                      {displayedCountries.map((country) => (
                        <div
                          key={country.id || country.iso2}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                            selectedCountry?.iso2 === country.iso2 
                              ? 'bg-blue-100 border-2 border-blue-400 shadow-md' 
                              : 'bg-white border border-slate-200'
                          }`}
                          onClick={() => handleCountrySelect(country)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 mb-1 truncate">
                                {country.emojiFlag} {country.name}
                              </h3>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {truncateText(country.summary)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 text-slate-500">
                      {searchTerm ? (
                        <p>No {activeTab === 'countries' ? 'countries' : 'favorites'} found for "{searchTerm}".</p>
                      ) : (activeTab === 'favorites' && user ? (
                        <p>You haven't added any favorites yet.</p>
                      ) : (
                        <p>No countries available.</p>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail Pane - Right Panel */}
          <div className="lg:col-span-2">
            {selectedCountry ? (
              <Card className="cc-card h-full">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{selectedCountry.emojiFlag}</span>
                      <div>
                        <CardTitle className="text-2xl font-bold text-slate-900">
                          {selectedCountry.name}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleFavoriteToggle}
                        className={`transition-colors ${
                          isCountryFavorited 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-slate-400 hover:text-red-500'
                        }`}
                        aria-label={isCountryFavorited ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`w-5 h-5 ${isCountryFavorited ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="text-slate-400 hover:text-blue-500"
                        aria-label="Share this country"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                      <Button 
                        onClick={handleAiPlannerToggle}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white w-full sm:w-auto"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Ask the AI Planner
                      </Button>
                    </div>
                  </div>

                  {/* Quick Tips Chips */}
                  {quickTips.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {quickTips.map((tip, index) => (
                          <motion.div
                            key={tip.id || index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Badge 
                              variant="secondary" 
                              className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                            >
                              💡 {tip.text}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="max-h-[70vh] overflow-y-auto space-y-6">
                  {/* Country Summary */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700 leading-relaxed">{selectedCountry.summary}</p>
                  </div>

                  {/* Sections */}
                  {isLoadingSections ? (
                    <div className="space-y-2">
                      <div className="h-6 w-1/3 bg-slate-200 rounded mb-4 animate-pulse"></div>
                      <div className="h-16 bg-slate-100 rounded-lg animate-pulse mb-2"></div>
                      <div className="h-16 bg-slate-100 rounded-lg animate-pulse"></div>
                    </div>
                  ) : sections.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Cultural Guide
                      </h3>
                      <Accordion type="multiple" className="space-y-2">
                        {sections.map((section, index) => (
                          <AccordionItem key={section.id || index} value={`section-${index}`} className="border border-slate-200 rounded-lg">
                            <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 rounded-lg">
                              <span className="font-medium text-slate-900">{section.title}</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                                {section.body}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ) : null}

                  <AnimatePresence mode="wait">
                    {showAiPlanner ? (
                      <motion.div
                        key="ai-planner"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                          <h3 className="text-lg font-bold text-purple-800 mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            AI Cultural Planner for {selectedCountry.name}
                          </h3>
                          <p className="text-purple-700 text-sm">
                            Get personalized cultural advice and travel tips powered by AI.
                          </p>
                        </div>

                        {/* Sample Prompts */}
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-3">Try these popular questions:</h4>
                          <div className="flex flex-wrap gap-2">
                            {getSamplePrompts(selectedCountry.name).map((prompt, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handlePromptSelect(prompt)}
                                className="bg-white hover:bg-slate-50 border-slate-300 transition-colors"
                              >
                                {prompt.replace(` in ${selectedCountry.name}`, '')}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Custom Prompt Input */}
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-3">Or ask your own question:</h4>
                          <div className="flex gap-2">
                            <Input
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              placeholder={`Ask about ${selectedCountry.name} culture...`}
                              className="flex-1"
                              onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                            />
                            <Button 
                              onClick={handleAiQuery} 
                              disabled={!aiPrompt.trim() || isGeneratingAi}
                              className="px-4"
                            >
                              {isGeneratingAi ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* AI Response */}
                        {(aiResponse || isGeneratingAi) && (
                          <div className="bg-white rounded-lg border border-slate-200 p-4">
                            {isGeneratingAi ? (
                              <div className="flex items-center gap-3 text-slate-600">
                                <Loader className="w-5 h-5 animate-spin" />
                                <span>Generating cultural insights...</span>
                              </div>
                            ) : (
                              <div className="prose prose-sm max-w-none">
                                <div className="whitespace-pre-line text-slate-700">
                                  {aiResponse}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex justify-center">
                          <Button 
                            onClick={handleAiPlannerToggle}
                            variant="outline"
                            className="text-slate-600"
                          >
                            Back to Cultural Rules
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="cultural-rules"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <Separator className="my-6" />

                        {isLoadingRules ? (
                          <RulesSkeleton />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Do's Column */}
                            <div>
                              <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                ✅ Do's ({dos.length})
                              </h3>
                              <div className="space-y-3">
                                {dos.map((rule, index) => (
                                  <motion.div
                                    key={rule.id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg"
                                  >
                                    <p className="text-green-800 leading-relaxed">{rule.text}</p>
                                  </motion.div>
                                ))}
                                {dos.length === 0 && (
                                  <p className="text-slate-500 italic">No specific do's available for this country yet.</p>
                                )}
                              </div>
                            </div>

                            {/* Don'ts Column */}
                            <div>
                              <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                                <XCircle className="w-5 h-5" />
                                ❌ Don'ts ({donts.length})
                              </h3>
                              <div className="space-y-3">
                                {donts.map((rule, index) => (
                                  <motion.div
                                    key={rule.id || index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg"
                                  >
                                    <p className="text-red-800 leading-relaxed">{rule.text}</p>
                                  </motion.div>
                                ))}
                                {donts.length === 0 && (
                                  <p className="text-slate-500 italic">No specific don'ts available for this country yet.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ) : (
              <Card className="cc-card h-full flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <Globe className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Select a country to view cultural guidelines.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
