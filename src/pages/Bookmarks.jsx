
import React, { useState, useEffect } from "react";
import { UserBookmark } from "@/api/entities";
import { Phrase } from "@/api/entities";
import { User } from "@/api/entities";
import { Country } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, Volume2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ProUpgradePrompt from "@/components/ProUpgradePrompt";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// BOOKMARK_LIMIT_FREE is now effectively unused on this page
// since non-premium users are redirected. Keeping it in case it's used elsewhere.
const BOOKMARK_LIMIT_FREE = 5; 

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
    "English": "en-US",
    "French": "fr-FR", 
    "Spanish": "es-ES",
    "Thai": "th-TH",
    "Japanese": "ja-JP",
    "Italian": "it-IT", 
    "German": "de-DE",
    "Malay": "ms-MY",
    "Nepali": "ne-NP",
    "Vietnamese": "vi-VN",
    "Filipino": "fil-PH",
    "Tagalog": "tl-PH",
    "Burmese": "my-MM",
    "Mandarin": "zh-CN",
    "Chinese": "zh-CN",
    "Georgian": "ka-GE",
    "Hebrew": "he-IL",
    "Arabic": "ar-SA",
    "Twi": "en-GB", // Fallback to English
    "Darija": "ar-MA",
    "Dhivehi": "dv-MV",
    "Malagasy": "mg-MG",
    "Swahili": "sw-KE",
    "Portuguese": "pt-PT",
    "Jamaican Patois": "en-JM",
    "Dutch": "nl-NL",
    "Korean": "ko-KR",
    "Russian": "ru-RU",
    "Polish": "pl-PL",
    "Turkish": "tr-TR",
    "Greek": "el-GR",
    "Hindi": "hi-IN",
    "Bengali": "bn-BD",
    "Urdu": "ur-PK"
  };
  return langMap[languageName] || 'en-US';
};

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [phrases, setPhrases] = useState([]);
  const [countries, setCountries] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserAndRedirect();
  }, []);

  const loadUserAndRedirect = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      // Check premium access: Pro member OR active trial
      const isPro = userData.pro_member;
      let hasActiveTrial = false;
      
      if (!isPro && userData.trial_started_date && !userData.trial_used) {
        const trialEndDate = new Date(userData.trial_started_date);
        trialEndDate.setDate(trialEndDate.getDate() + 7);
        if (new Date() < trialEndDate) {
          hasActiveTrial = true;
        }
      }

      // Only redirect if user has NO premium access
      if (!isPro && !hasActiveTrial) {
        window.location.href = createPageUrl("GoPro");
        return;
      }
      
      // Load bookmark data only for premium-access users
      const [userBookmarks, allPhrases, allCountries] = await Promise.all([
        UserBookmark.filter({ created_by: userData.email }),
        Phrase.list(),
        Country.list()
      ]);
      
      setBookmarks(userBookmarks);
      setCountries(allCountries);
      
      if (userBookmarks.length > 0) {
        const phraseIds = userBookmarks.map(b => b.phrase_id);
        const bookmarkedPhrases = allPhrases.filter(p => phraseIds.includes(p.id));
        setPhrases(bookmarkedPhrases);
      }
    } catch (error) {
      console.error("Error loading user or bookmarks:", error);
      // Redirect to Go Pro page for authentication errors
      window.location.href = createPageUrl("GoPro");
      return;
    }
    setIsLoading(false);
  };

  const handlePlayAudio = async (text, language) => {
    if (!('speechSynthesis' in window)) {
      alert("Sorry, your browser doesn't support text-to-speech.");
      return;
    }

    try {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      // Wait a bit to ensure cancellation is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const utterance = new SpeechSynthesisUtterance(text);
      const languageCode = getLanguageCode(language);
      
      // Set language and voice properties
      utterance.lang = languageCode;
      utterance.rate = 0.8; // Slightly slower for better pronunciation
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to find a native voice for the language
      const voices = speechSynthesis.getVoices();
      const nativeVoice = voices.find(voice => 
        voice.lang.startsWith(languageCode.split('-')[0]) && voice.localService
      ) || voices.find(voice => 
        voice.lang.startsWith(languageCode.split('-')[0])
      );
      
      if (nativeVoice) {
        utterance.voice = nativeVoice;
      }
      
      // Handle errors
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        if (event.error === 'language-not-supported') {
          alert(`Sorry, ${language} pronunciation is not available on your device.`);
        } else {
          alert('Unable to play audio. Please try again.');
        }
      };
      
      // Speak the text
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Text-to-speech error:', error);
      alert('Unable to play audio. Please try again.');
    }
  };

  const removeBookmark = async (bookmarkId) => {
    try {
      await UserBookmark.delete(bookmarkId);
      const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
      setBookmarks(updatedBookmarks);
      
      // Update phrases list
      const remainingPhraseIds = updatedBookmarks.map(b => b.phrase_id);
      setPhrases(phrases.filter(p => remainingPhraseIds.includes(p.id)));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const getBookmarkForPhrase = (phraseId) => {
    return bookmarks.find(b => b.phrase_id === phraseId);
  };

  const groupedPhrases = phrases.reduce((acc, phrase) => {
    const bookmark = getBookmarkForPhrase(phrase.id);
    const country = bookmark?.country_name || 'Unknown';
    if (!acc[country]) acc[country] = [];
    acc[country].push({ phrase, bookmark });
    return acc;
  }, {});
  
  const getCountryLanguage = (countryName) => {
    const country = countries.find(c => c.name === countryName);
    return country?.language || "English";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid gap-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This check is now explicitly for logged-out users.
  // Non-premium users (non-pro and non-trial) are redirected by loadUserAndRedirect.
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Please Log In</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">You need to be logged in to view your bookmarks.</p>
            <Button onClick={() => User.login()}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // The full-screen ProUpgradePrompt for non-premium members is removed
  // as they are now redirected to the GoPro page.

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Star className="w-8 h-8 text-yellow-500 fill-current" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Bookmarks</h1>
            <p className="text-slate-600">Your saved phrases and cultural insights</p>
          </div>
        </div>

        {/* The ProUpgradePrompt for free users hitting the bookmark limit is removed here */}
        {/* as all users reaching this point are premium-access members (pro or trial). */}

        {phrases.length === 0 ? (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No bookmarks yet</h2>
              <p className="text-slate-600 mb-6">
                Start exploring countries and bookmark your favorite phrases!
              </p>
              <Link to={createPageUrl("index")}>
                <Button>Explore Countries</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedPhrases).map(([country, countryPhrases]) => (
              <div key={country}>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">{country}</h2>
                  <Badge variant="outline">{countryPhrases.length} phrases</Badge>
                </div>
                
                <div className="grid gap-4">
                  {countryPhrases.map(({ phrase, bookmark }) => (
                    <motion.div
                      key={phrase.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <Badge className={categoryColors[phrase.category]}>
                                  {phrase.category}
                                </Badge>
                                {phrase.formality_level && (
                                  <Badge variant="outline">
                                    {phrase.formality_level}
                                  </Badge>
                                )}
                                <Link to={createPageUrl(`Country?name=${encodeURIComponent(country)}`)}>
                                  <Button variant="outline" size="sm">
                                    View Country
                                  </Button>
                                </Link>
                              </div>
                              
                              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {phrase.english_phrase}
                              </h3>
                              
                              <div className="bg-slate-50 rounded-lg p-4 mb-3">
                                <p className="text-xl font-bold text-slate-900 mb-1">
                                  {phrase.local_phrase}
                                </p>
                                {phrase.phonetic_pronunciation && (
                                  <div className="bg-blue-100 border border-blue-200 rounded-md p-2 mt-2">
                                    <p className="text-sm text-blue-800 italic font-medium">
                                      🔊 Pronunciation: [{phrase.phonetic_pronunciation}]
                                    </p>
                                  </div>
                                )}
                              </div>
                              
                              {phrase.cultural_context && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                  <p className="text-sm text-blue-800">
                                    <strong>Cultural Context:</strong> {phrase.cultural_context}
                                  </p>
                                </div>
                              )}
                              
                              {bookmark.notes && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <p className="text-sm text-yellow-800">
                                    <strong>My Notes:</strong> {bookmark.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      // Audio functionality is always available for premium-access users,
                                      // so no need for a disabled state or tooltip based on pro status.
                                      onClick={() => handlePlayAudio(phrase.local_phrase, getCountryLanguage(country))}
                                    >
                                      <Volume2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                </Tooltip>
                              </TooltipProvider>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBookmark(bookmark.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
