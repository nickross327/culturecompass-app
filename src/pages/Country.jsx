
import React, { useState, useEffect, useCallback, memo } from "react";
import { useLocation } from "react-router-dom";
import { Country } from "@/api/entities";
import { Phrase } from "@/api/entities";
import { UserBookmark } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Star,
  Volume2,
  MessageCircle,
  Utensils,
  Car,
  ShoppingBag,
  AlertTriangle,
  Bed,
  MapPin,
  Users,
  Heart,
  BookOpen,
  Gift,
  Shirt,
  Handshake,
  Coins,
  CheckCircle2,
  XCircle,
  CarTaxiFront,
  Hand,
  LifeBuoy,
  Smartphone
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import ProUpgradePrompt from "@/components/ProUpgradePrompt";
import AffiliateSection from "@/components/affiliates/AffiliateSection";
import CulturalIcebreakers from "@/components/cultural/CulturalIcebreakers";
import ExpandableInsight from "@/components/cultural/ExpandableInsight";

const FREE_COUNTRY_LIST = ["France", "Japan", "Thailand", "Italy", "Spain"];
const BOOKMARK_LIMIT_FREE = 5;

const categoryIcons = {
  greetings: MessageCircle,
  dining: Utensils,
  transportation: Car,
  shopping: ShoppingBag,
  emergency: AlertTriangle,
  accommodation: Bed,
  directions: MapPin,
  social: Users
};

const categoryColors = {
  greetings: "bg-blue-100 text-blue-700 border-blue-200",
  dining: "bg-orange-100 text-orange-700 border-orange-200",
  transportation: "bg-green-100 text-green-700 border-green-200",
  shopping: "bg-purple-100 text-purple-700 border-purple-200",
  emergency: "bg-red-100 text-red-700 border-red-200",
  accommodation: "bg-indigo-100 text-indigo-700 border-indigo-200",
  directions: "bg-teal-100 text-teal-700 border-teal-200",
  social: "bg-pink-100 text-pink-700 border-pink-200"
};

const getLanguageCode = (languageName) => {
  const langMap = {
    "English": "en-US", "French": "fr-FR", "Spanish": "es-ES", "Thai": "th-TH", "Japanese": "ja-JP", "Italian": "it-IT", "German": "de-DE", "Malay": "ms-MY", "Nepali": "ne-NP", "Vietnamese": "vi-VN", "Filipino": "fil-PH", "Tagalog": "tl-PH", "Burmese": "my-MM", "Mandarin": "zh-CN", "Chinese": "zh-CN", "Georgian": "ka-GE", "Hebrew": "he-IL", "Arabic": "ar-SA", "Twi": "en-GB", "Darija": "ar-MA", "Dhivehi": "dv-MV", "Malagasy": "mg-MG", "Swahili": "sw-KE", "Portuguese": "pt-PT", "Jamaican Patois": "en-JM", "Dutch": "nl-NL", "Korean": "ko-KR", "Russian": "ru-RU", "Polish": "pl-PL", "Turkish": "tr-TR", "Greek": "el-GR", "Hindi": "hi-IN", "Bengali": "bn-BD", "Urdu": "ur-PK"
  };
  return langMap[languageName] || 'en-US';
};


export default function CountryPage() {
  const [country, setCountry] = useState(null);
  const [phrases, setPhrases] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("greetings");
  const [user, setUser] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isDownloadedOffline, setIsDownloadedOffline] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isHeaderLoading, setIsHeaderLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(true);

  const location = useLocation();

  const urlParams = new URLSearchParams(window.location.search);
  const countryName = urlParams.get('name');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator && user?.pro_member) {
      const swCode = `
        const CACHE_NAME = 'culturecompass-offline-v1';
        self.addEventListener('fetch', event => {
          if (event.request.url.includes('/offline/country/')) {
            event.respondWith(
              caches.match(event.request).then(response => response || fetch(event.request))
            );
          }
        });
        self.addEventListener('activate', event => {
          event.waitUntil(
            caches.keys().then(cacheNames => {
              return Promise.all(
                cacheNames.map(cacheName => {
                  if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
                })
              );
            })
          );
        });
      `;
      const blob = new Blob([swCode], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(blob);
      navigator.serviceWorker.register(swUrl)
        .then(() => console.log('Offline service worker registered'))
        .catch(() => console.log('Service worker registration failed'));
    }
  }, [user]);

  const checkOfflineAvailability = useCallback((countryNameToCheck) => {
    const offlineData = localStorage.getItem(`offline_country_v2_${countryNameToCheck}`);
    if (offlineData) {
      try {
        const parsed = JSON.parse(offlineData);
        const expiryDate = new Date(parsed.expiresAt);
        if (new Date() < expiryDate) {
          return true;
        } else {
          localStorage.removeItem(`offline_country_v2_${countryNameToCheck}`);
        }
      } catch (e) {
        console.error("Error parsing offline data from localStorage", e);
        localStorage.removeItem(`offline_country_v2_${countryNameToCheck}`);
      }
    }
    return false;
  }, []);

  const loadBookmarks = useCallback(async (userEmail, currentCountryName) => {
    try {
      const userBookmarks = await UserBookmark.filter({
        created_by: userEmail,
        country_name: currentCountryName
      });
      setBookmarks(userBookmarks);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  }, [setBookmarks]);

  const loadInitialData = useCallback(async () => {
    setIsHeaderLoading(true);
    setIsContentLoading(true);
    setShowUpgrade(false);
    setCountry(null);
    setPhrases([]);
    
    const currentCountryName = decodeURIComponent(new URLSearchParams(window.location.search).get("name"));
    const isFreeCountry = FREE_COUNTRY_LIST.includes(currentCountryName);
    
    let hasPremiumAccess = false;
    let userData = null;

    try {
      userData = await User.me();
      if (userData) {
        setUser(userData);
        hasPremiumAccess = userData?.pro_member || (
          userData?.trial_started_date && 
          !userData?.trial_used && 
          new Date() < new Date(new Date(userData.trial_started_date).getTime() + 7 * 24 * 60 * 60 * 1000)
        );
      }
    } catch (e) {
      if (!isFreeCountry) { window.location.href = createPageUrl("index"); return; }
      setUser(null);
    }

    if (!isFreeCountry && !hasPremiumAccess) {
      window.location.href = createPageUrl("index");
      return;
    }
    
    let isOfflineDataLoaded = false;
    if (checkOfflineAvailability(currentCountryName)) {
        try {
            const offlineData = JSON.parse(localStorage.getItem(`offline_country_v2_${currentCountryName}`));
            if (offlineData) {
                setCountry(offlineData.country);
                setPhrases(offlineData.phrases);
                setIsHeaderLoading(false);
                setIsContentLoading(false);
                isOfflineDataLoaded = true;
            }
        } catch (error) {
            console.error("Error parsing offline data from localStorage:", error);
            localStorage.removeItem(`offline_country_v2_${currentCountryName}`);
        }
    }

    try {
      const countryData = await Country.filter({ name: currentCountryName });

      if (countryData.length > 0) {
        const currentCountry = countryData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0];
        setCountry(currentCountry);
      } else {
        setCountry(null);
      }
      
      if (!isOfflineDataLoaded) setIsHeaderLoading(false);
      if (!countryData.length > 0) { setIsContentLoading(false); return; }

      const phrasesData = await Phrase.filter({ country_name: currentCountryName });
      
      const uniquePhrases = [];
      const seenPhrases = new Set();
      phrasesData.forEach(phrase => {
        const phraseIdentifier = `${phrase.english_phrase}|${phrase.local_phrase}|${phrase.category}`;
        if (!seenPhrases.has(phraseIdentifier)) {
          seenPhrases.add(phraseIdentifier);
          uniquePhrases.push(phrase);
        }
      });
      setPhrases(uniquePhrases);

      if (userData) {
        await loadBookmarks(userData.email, currentCountryName);
      }
    } catch (error) {
      console.error("Network error loading country data:", error);
      if (!isOfflineDataLoaded) {
        setIsHeaderLoading(false);
        setIsContentLoading(false);
        setCountry({ name: currentCountryName, flag_emoji: '🌍', language: 'Unknown', currency: 'Unknown', greeting_formal: 'Hello', thank_you: 'Thank you', please: 'Please', cultural_dos: [], cultural_donts: [], dating_etiquette: [], tipping_etiquette: [], gestures_body_language: [], cultural_highlights: [], dining_etiquette: [], business_etiquette: [], local_survival_tips: {}, taxi_etiquette: '', dress_code: '', gift_giving: '' });
        setPhrases([]);
      }
    }
    if (!isOfflineDataLoaded) setIsContentLoading(false);
  }, [loadBookmarks, checkOfflineAvailability]);

  useEffect(() => {
    loadInitialData();
  }, [location, loadInitialData]);

  useEffect(() => {
    if (country) {
      setIsDownloadedOffline(checkOfflineAvailability(country.name));
    }
  }, [country, checkOfflineAvailability]);

  const handlePlayAudio = async (text, language) => {
    if (!('speechSynthesis' in window)) { alert("Sorry, your browser doesn't support text-to-speech."); return; }
    if (isAudioPlaying) { speechSynthesis.cancel(); setIsAudioPlaying(false); await new Promise(resolve => setTimeout(resolve, 100)); }
    try {
      setIsAudioPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      const languageCode = getLanguageCode(language);
      utterance.lang = languageCode;
      utterance.rate = 0.8;
      const voices = speechSynthesis.getVoices();
      const nativeVoice = voices.find(voice => voice.lang.startsWith(languageCode.split('-')[0]) && voice.localService) || voices.find(voice => voice.lang.startsWith(languageCode.split('-')[0]));
      if (nativeVoice) utterance.voice = nativeVoice;
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsAudioPlaying(false);
        alert('Unable to play audio. Please try again.');
      };
      utterance.onend = () => setIsAudioPlaying(false);
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsAudioPlaying(false);
      alert('Unable to play audio. Please try again.');
    }
  };

  const toggleBookmark = async (phrase) => {
    if (!user) { User.login(); return; }
    const existingBookmark = bookmarks.find(b => b.phrase_id === phrase.id);
    if (existingBookmark) {
      await UserBookmark.delete(existingBookmark.id);
      setBookmarks(bookmarks.filter(b => b.id !== existingBookmark.id));
    } else {
      if (!user.pro_member && bookmarks.length >= BOOKMARK_LIMIT_FREE) { alert(`You've reached your limit of ${BOOKMARK_LIMIT_FREE} bookmarks. Upgrade to Pro for unlimited bookmarks!`); return; }
      const newBookmark = await UserBookmark.create({ phrase_id: phrase.id, country_name: countryName });
      setBookmarks([...bookmarks, newBookmark]);
    }
  };

  const isBookmarked = (phraseId) => bookmarks.some(b => b.phrase_id === phraseId);

  const handleDownloadForOffline = async () => {
    if (!user?.pro_member) { alert('Offline access is available for Pro members only.'); return; }
    if (!country || phrases.length === 0) { alert('Country data not fully loaded yet. Please wait.'); return; }
    try {
      const offlineData = { country, phrases, downloadedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() };
      localStorage.setItem(`offline_country_v2_${country.name}`, JSON.stringify(offlineData));
      if ('caches' in window) {
        const cache = await caches.open('culturecompass-offline-v1');
        const countryDataBlob = new Blob([JSON.stringify(offlineData)], { type: 'application/json' });
        const countryDataResponse = new Response(countryDataBlob);
        await cache.put(`/offline/country/${country.name}`, countryDataResponse);
      }
      setIsDownloadedOffline(true);
      alert(`${country.name} has been downloaded for offline access!`);
    } catch (error) {
      console.error('Error downloading for offline:', error);
      alert('There was an error downloading this country for offline use.');
    }
  };

  const filteredPhrases = phrases.filter(p => p.category === selectedCategory);
  const categories = [...new Set(phrases.map(p => p.category))];

  if (isHeaderLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center font-sans">
        <div className="animate-pulse text-center">
          <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-slate-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (showUpgrade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center font-sans">
        <div className="max-w-2xl mx-auto text-center">
          <ProUpgradePrompt
            title="Unlock Full Country Access!"
            description="Get access to all 80+ countries, audio pronunciations, cultural insights, and more with CultureCompass Pro."
            features={[ "Access to all 80+ countries worldwide", "Audio pronunciations for authentic communication", "Unlimited bookmarks with personal notes", "Advanced cultural insights and etiquette guides", "AI Travel Planner for personalized itineraries" ]}
          />
        </div>
      </div>
    );
  }

  if (!country && !isHeaderLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center font-sans">
        <Card className="max-w-md mx-auto cc-card">
          <CardHeader><CardTitle className="text-center">Country Not Found</CardTitle></CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">The country "{countryName}" could not be found. It might be a premium country or does not exist in our database.</p>
            <Link to={createPageUrl("index")}><Button className="cc-button-primary">Back to Dashboard</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden relative z-10">
        <div className="bg-gradient-to-br from-blue-800 via-indigo-600 to-purple-700 text-white p-8 rounded-t-2xl relative">
          <div className="flex items-center justify-between mb-6">
            <Link to={createPageUrl("index")}>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            {user?.pro_member && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleDownloadForOffline} variant="ghost" className={`flex items-center gap-2 text-white hover:bg-white/20 rounded-full ${isDownloadedOffline ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={isDownloadedOffline}>
                      <Smartphone className="w-5 h-5" />
                      <span className="hidden sm:inline">{isDownloadedOffline ? "Available Offline" : "Download Offline"}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>{isDownloadedOffline ? "This country is available for offline use" : "Download this country to use without internet"}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center gap-6">
            <span className="text-6xl leading-none">{country?.flag_emoji}</span>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">{country?.name}</h1>
              <p className="text-xl opacity-90">{country?.language} • {country?.currency}</p>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border-b border-gray-100 relative z-0">
            <Card className="bg-white border-0 shadow-sm rounded-xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Formal Greeting</p>
                  <p className="text-lg font-bold text-gray-800">{country?.greeting_formal || "N/A"}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400 opacity-30"/>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm rounded-xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Thank You</p>
                  <p className="text-lg font-bold text-gray-800">{country?.thank_you || "N/A"}</p>
                </div>
                <Heart className="w-8 h-8 text-purple-400 opacity-30"/>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm rounded-xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Please</p>
                  <p className="text-lg font-bold text-gray-800">{country?.please || "N/A"}</p>
                </div>
                <Handshake className="w-8 h-8 text-orange-400 opacity-30"/>
              </CardContent>
            </Card>
        </div>
        
        {isContentLoading ? (
          <div className="p-8">
             <div className="animate-pulse space-y-6">
                <div className="flex space-x-2"><div className="h-10 w-24 bg-slate-200 rounded-full"></div><div className="h-10 w-24 bg-slate-200 rounded-full"></div><div className="h-10 w-24 bg-slate-200 rounded-full"></div></div>
                <div className="space-y-4"><div className="h-48 bg-slate-200 rounded-xl"></div><div className="h-48 bg-slate-200 rounded-xl"></div></div>
              </div>
          </div>
        ) : (
          <>
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Tabs defaultValue="phrases" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl shadow-sm">
                    <TabsTrigger value="phrases" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 rounded-lg py-3 px-4 transition-all duration-200 text-sm font-medium">
                      <MessageCircle className="w-4 h-4" /><span>Phrases</span>
                    </TabsTrigger>
                    <TabsTrigger value="culture" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 rounded-lg py-3 px-4 transition-all duration-200 text-sm font-medium">
                      <BookOpen className="w-4 h-4" /><span>Culture</span>
                    </TabsTrigger>
                    <TabsTrigger value="icebreakers" className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 rounded-lg py-3 px-4 transition-all duration-200 text-sm font-medium">
                       <Users className="w-4 h-4" />
                      <span>Icebreakers</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="phrases" className="space-y-6">
                    {categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {categories.map(category => {
                          const IconComponent = categoryIcons[category];
                          const isActive = selectedCategory === category;
                          return (
                            <Button key={category} variant={isActive ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${isActive ? "bg-blue-700 text-white shadow-md hover:bg-blue-800" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}>
                              {IconComponent && <IconComponent className="w-4 h-4" />} {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Button>
                          );
                        })}
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      <motion.div key={selectedCategory} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="grid gap-4">
                        {filteredPhrases.length > 0 ? (
                          filteredPhrases.map((phrase) => (
                            <Card key={phrase.id} className="cc-card">
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 pr-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Badge className={`${categoryColors[phrase.category]} px-3 py-1 rounded-full text-xs font-semibold`}>{phrase.category}</Badge>
                                      {phrase.formality_level && (<Badge variant="outline" className="px-3 py-1 rounded-full text-xs font-semibold border-gray-200 text-gray-600">{phrase.formality_level}</Badge>)}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{phrase.english_phrase}</h3>
                                    <div className="bg-blue-50 rounded-lg p-4 mb-3 border border-blue-100">
                                      <p className="text-2xl font-extrabold text-blue-800 mb-1">{phrase.local_phrase}</p>
                                      {phrase.phonetic_pronunciation && (<div className="bg-blue-100 border border-blue-200 rounded-md p-2 mt-2"><p className="text-sm text-blue-700 italic font-medium">[{phrase.phonetic_pronunciation}]</p></div>)}
                                      {phrase.usage_scenario && (<p className="text-sm text-gray-600 mt-2"><strong>Best used:</strong> {phrase.usage_scenario}</p>)}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center gap-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-blue-600 hover:bg-blue-100 transition-colors" disabled={!user?.pro_member || isAudioPlaying} onClick={() => handlePlayAudio(phrase.local_phrase, country.language)}>
                                            {isAudioPlaying ? (<Volume2 className="w-5 h-5 animate-pulse" />) : (<Volume2 className="w-5 h-5" />)}
                                          </Button>
                                        </TooltipTrigger>
                                        {!user?.pro_member && (<TooltipContent><p>Upgrade to Pro for audio</p></TooltipContent>)}
                                      </Tooltip>
                                    </TooltipProvider>

                                    {user && (
                                      <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-full ${isBookmarked(phrase.id) ? "text-yellow-500 hover:bg-yellow-100" : "text-gray-500 hover:bg-gray-100"}`} onClick={() => toggleBookmark(phrase)}>
                                        <Star className={`w-5 h-5 ${isBookmarked(phrase.id) ? "fill-yellow-500" : ""}`} />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-10 bg-white rounded-xl shadow-md border border-gray-100"><p className="text-gray-500">No phrases found for this category.</p></div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>

                  <TabsContent value="culture" className="space-y-6">
                    <CulturalInsightsSection insights={country} />
                  </TabsContent>

                  <TabsContent value="icebreakers" className="space-y-6">
                    <CulturalIcebreakers countryName={countryName} compact={false} />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <Card className="cc-card">
                  <CardHeader><CardTitle className="text-xl font-bold text-gray-900">💡 Pro Tip</CardTitle></CardHeader>
                  <CardContent className="text-gray-700">
                    <p className="mb-2">Don't forget to enable offline mode for this country if you're a Pro member! Travel without limits.</p>
                    {!user?.pro_member && (
                      <Link to={createPageUrl("GoPro")} className="inline-block">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 text-sm">Upgrade to Pro</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100">
              {country && <AffiliateSection countryName={country.name} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const CulturalInsightsSection = memo(({ insights }) => {
  if (!insights) return null;

  const sectionConfig = [
    { key: 'dos_donts', title: "📜 Cultural Do's & Don't", icon: Users, color: 'blue', items: { dos: insights.cultural_dos, donts: insights.cultural_donts } },
    { key: 'dining', title: "Dining Etiquette", icon: Utensils, color: 'orange', items: insights.dining_etiquette },
    { key: 'dating', title: "💕 Dating & Social", icon: Heart, color: 'purple', items: insights.dating_etiquette },
    { key: 'business', title: "Business Etiquette", icon: Handshake, color: 'blue', items: insights.business_etiquette },
    { key: 'tipping', title: "💸 Tipping Etiquette", icon: Coins, color: 'green', items: insights.tipping_etiquette },
    { key: 'gestures', title: "Gestures & Body Language", icon: Hand, color: 'orange', items: insights.gestures_body_language },
    { key: 'highlights', title: "Cultural Highlights", icon: Star, color: 'yellow', items: insights.cultural_highlights },
    { key: 'survival', title: "Local Survival Tips", icon: LifeBuoy, color: 'cyan', items: insights.local_survival_tips },
    { key: 'taxi', title: "🚕 Taxi Etiquette", icon: CarTaxiFront, color: 'gray', items: insights.taxi_etiquette },
    { key: 'dress', title: "Dress Code", icon: Shirt, color: 'purple', items: insights.dress_code },
    { key: 'gift', title: "Gift Giving", icon: Gift, color: 'pink', items: insights.gift_giving },
  ];
  
  const iconColors = { blue: 'text-blue-500', orange: 'text-orange-500', purple: 'text-purple-500', green: 'text-green-500', yellow: 'text-yellow-500', cyan: 'text-cyan-500', gray: 'text-gray-600', pink: 'text-pink-500' };

  return (
    <div className="space-y-8">
      {sectionConfig.map(section => {
        if (!section.items || (Array.isArray(section.items) && section.items.length === 0) || (typeof section.items === 'object' && !Array.isArray(section.items) && Object.keys(section.items).length === 0)) return null;
        
        const Icon = section.icon;

        if (section.key === 'dos_donts') {
          return (
            <Card key={section.key} className="cc-card">
              <CardHeader><CardTitle className={`flex items-center gap-3 text-xl font-bold text-gray-900 ${iconColors[section.color]}`}><Icon className="w-6 h-6" />{section.title}</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-3 text-green-600"><CheckCircle2 className="w-5 h-5" />✅ Do</h3>
                  <ul className="space-y-3">{section.items.dos?.map((item, index) => (<li key={index} className="p-4 bg-green-50 rounded-lg border border-green-100"><ExpandableInsight countryName={insights.name} insightCategory="Cultural Do's" insightText={item}><div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" /><span className="text-base text-gray-700">{item}</span></div></ExpandableInsight></li>))}</ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-3 text-red-600"><XCircle className="w-5 h-5" />❌ Don't</h3>
                  <ul className="space-y-3">{section.items.donts?.map((item, index) => (<li key={index} className="p-4 bg-red-50 rounded-lg border border-red-100"><ExpandableInsight countryName={insights.name} insightCategory="Cultural Don'ts" insightText={item}><div className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" /><span className="text-base text-gray-700">{item}</span></div></ExpandableInsight></li>))}</ul>
                </div>
              </CardContent>
            </Card>
          );
        }
        
        return (
          <Card key={section.key} className="cc-card">
            <CardHeader><CardTitle className={`flex items-center gap-3 text-xl font-bold text-gray-900 ${iconColors[section.color]}`}><Icon className="w-6 h-6" />{section.title}</CardTitle></CardHeader>
            <CardContent>
              {section.key === 'tipping' || section.key === 'gestures' ? (
                <ul className="space-y-3">
                  {section.items.map((item, index) => (
                    <li key={index} className={`p-4 bg-${section.color}-50 rounded-lg border border-${section.color}-100`}>
                       <ExpandableInsight countryName={insights.name} insightCategory={section.title} insightText={item.recommendation || item.meaning}>
                         <p className={`font-semibold text-base text-${section.color}-800 mb-1`}>{item.service || item.gesture}</p>
                         <p className="text-base text-gray-700">{item.recommendation || item.meaning}</p>
                       </ExpandableInsight>
                    </li>
                  ))}
                </ul>
              ) : section.key === 'survival' ? (
                <div className="space-y-3 text-base">
                  {section.items.emergency_numbers && <p><b>Emergency:</b> {section.items.emergency_numbers}</p>}
                  {section.items.tap_water_safety && <p><b>Tap Water:</b> {section.items.tap_water_safety}</p>}
                  {section.items.recommended_apps && <p><b>Recommended Apps:</b> {section.items.recommended_apps}</p>}
                </div>
              ) : (
                <ul className="space-y-3">
                  {Array.isArray(section.items) ? section.items.map((item, index) => (
                    <li key={index} className={`p-4 bg-${section.color}-50 rounded-lg border border-${section.color}-100`}>
                      <ExpandableInsight countryName={insights.name} insightCategory={section.title} insightText={item}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 bg-${section.color}-500 rounded-full mt-2 flex-shrink-0`}></div>
                          <p className="text-base text-gray-700">{item}</p>
                        </div>
                      </ExpandableInsight>
                    </li>
                  )) : 
                    <div className={`p-4 bg-${section.color}-50 rounded-lg border border-${section.color}-100`}>
                      <ExpandableInsight countryName={insights.name} insightCategory={section.title} insightText={section.items}>
                        <p className="text-base text-gray-700">{section.items}</p>
                      </ExpandableInsight>
                    </div>
                  }
                </ul>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});
