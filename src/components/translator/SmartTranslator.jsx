
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { InvokeLLM } from '@/api/integrations';
import {
  Languages,
  ArrowRightLeft,
  Shield,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const POPULAR_LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese (Mandarin)', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' }
];

const CONTEXT_OPTIONS = [
  { value: 'business', label: 'Business/Professional', icon: '💼' },
  { value: 'casual', label: 'Casual/Friendly', icon: '😊' },
  { value: 'formal', label: 'Formal/Official', icon: '📋' },
  { value: 'travel', label: 'Travel/Tourism', icon: '✈️' },
  { value: 'email', label: 'Email Communication', icon: '📧' },
  { value: 'meeting', label: 'Meeting/Presentation', icon: '🤝' }
];

export default function SmartTranslator({ compact = false, defaultFromLang = 'en', defaultToLang = '', countryContext = null }) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [culturalNotes, setCulturalNotes] = useState('');
  const [fromLanguage, setFromLanguage] = useState(defaultFromLang);
  const [toLanguage, setToLanguage] = useState(defaultToLang);
  const [context, setContext] = useState('business');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!inputText.trim() || !toLanguage) {
      setError('Please enter text and select a target language.');
      return;
    }

    setIsTranslating(true);
    setError('');

    try {
      const contextInfo = CONTEXT_OPTIONS.find(c => c.value === context);
      const targetLang = POPULAR_LANGUAGES.find(l => l.code === toLanguage);

      const prompt = `You are a cultural translation expert. Translate the following text with cultural awareness:

Text to translate: "${inputText}"
From: ${fromLanguage === 'en' ? 'English' : fromLanguage}
To: ${targetLang?.name || toLanguage}
Context: ${contextInfo?.label || context}
${countryContext ? `Country Context: ${countryContext}` : ''}

Please provide:
1. The culturally appropriate translation
2. Brief cultural notes about tone, formality, or cultural considerations
3. Any alternative phrasings for different levels of formality

Format your response as:
TRANSLATION: [the translation]
CULTURAL NOTES: [cultural context and guidance]`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      // Parse the response
      const lines = response.split('\n');
      let translation = '';
      let notes = '';
      let isInTranslation = false;
      let isInNotes = false;

      lines.forEach(line => {
        if (line.startsWith('TRANSLATION:')) {
          translation = line.replace('TRANSLATION:', '').trim();
          isInTranslation = true;
          isInNotes = false;
        } else if (line.startsWith('CULTURAL NOTES:')) {
          notes = line.replace('CULTURAL NOTES:', '').trim();
          isInTranslation = false;
          isInNotes = true;
        } else if (isInTranslation && line.trim()) {
          translation += ' ' + line.trim();
        } else if (isInNotes && line.trim()) {
          notes += ' ' + line.trim();
        }
      });

      setTranslatedText(translation || response);
      setCulturalNotes(notes);

    } catch (error) {
      console.error('Translation error:', error);
      setError('Translation failed. Please try again.');
    }

    setIsTranslating(false);
  };

  const swapLanguages = () => {
    if (fromLanguage !== 'en' && toLanguage !== 'en') return; // Only swap with English

    const tempLang = fromLanguage;
    setFromLanguage(toLanguage === 'en' ? 'en' : toLanguage);
    setToLanguage(tempLang === 'en' ? 'en' : tempLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
    setCulturalNotes('');
  };

  if (compact) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border border-teal-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-teal-600" />
            Quick Cultural Translation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select value={toLanguage} onValueChange={setToLanguage}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="To language" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_LANGUAGES.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={context} onValueChange={setContext}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTEXT_OPTIONS.map(ctx => (
                  <SelectItem key={ctx.value} value={ctx.value}>
                    {ctx.icon} {ctx.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder="Type your text to translate..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            className="text-sm resize-none"
          />
          <Button
            onClick={handleTranslate}
            disabled={isTranslating || !inputText.trim() || !toLanguage}
            className="w-full bg-teal-600 hover:bg-teal-700"
            size="sm"
          >
            {isTranslating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Translating...
              </>
            ) : (
              'Translate with Context'
            )}
          </Button>
          {translatedText && (
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 space-y-3">
              <p className="text-sm font-medium text-teal-900 leading-relaxed break-words">
                {translatedText}
              </p>
              {culturalNotes && (
                <p className="text-xs text-teal-700 italic leading-relaxed break-words">
                  {culturalNotes}
                </p>
              )}
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="break-words">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">Smart Cultural Translator</h2>
            <p className="text-lg text-slate-600 mt-1">AI-powered with cultural context</p>
          </div>
        </div>
        
        <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed mb-6">
          Get translations with cultural context and etiquette guidance. Perfect for quick phrases and professional communication.
        </p>

        {/* Security Badge */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Badge className="bg-green-100 text-green-800 flex items-center gap-2 px-4 py-2">
            <Shield className="w-4 h-4" />
            Corporate-Safe & Secure
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-2 px-4 py-2">
            <Sparkles className="w-4 h-4" />
            Cultural Context Included
          </Badge>
        </div>
      </div>

      <Card className="bg-white shadow-lg border-0">
        <CardContent className="p-4 sm:p-8">
          {/* Language and Context Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
            <div className="lg:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700 block">From Language</label>
              <Select value={fromLanguage} onValueChange={setFromLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                  {POPULAR_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={swapLanguages}
                className="mb-2 rounded-full"
                disabled={fromLanguage !== 'en' && toLanguage !== 'en'}
              >
                <ArrowRightLeft className="w-5 h-5" />
              </Button>
            </div>

            <div className="lg:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700 block">To Language</label>
              <Select value={toLanguage} onValueChange={setToLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target language" />
                </SelectTrigger>
                <SelectContent>
                  {fromLanguage !== 'en' && (
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                  )}
                  {POPULAR_LANGUAGES.filter(lang => lang.code !== fromLanguage).map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Context Selection - Fixed for Mobile */}
          <div className="mb-8">
            <label className="text-sm font-medium text-slate-700 mb-4 block">Communication Context</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {CONTEXT_OPTIONS.map(ctx => (
                <Button
                  key={ctx.value}
                  variant={context === ctx.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setContext(ctx.value)}
                  className="flex items-center justify-start gap-2 px-3 py-3 h-auto min-h-[2.75rem] text-left whitespace-normal"
                >
                  <span className="text-base flex-shrink-0">{ctx.icon}</span>
                  <span className="text-xs sm:text-sm font-medium leading-tight flex-1">{ctx.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Translation Interface */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 block">Original Text</label>
              <Textarea
                placeholder="Enter your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
                className="resize-none text-base leading-relaxed"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 block">Translation</label>
              <div className="bg-slate-50 border rounded-lg p-4 min-h-[152px] flex items-center justify-center">
                {isTranslating ? (
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="animate-spin w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm">Translating with cultural context...</span>
                  </div>
                ) : translatedText ? (
                  <div className="w-full">
                    <p className="text-slate-900 font-medium text-base leading-relaxed break-words">
                      {translatedText}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-center text-sm">
                    Translation will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cultural Notes */}
          <AnimatePresence>
            {culturalNotes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8"
              >
                <Card className="bg-amber-50 border-amber-200 border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                      <div className="space-y-2">
                        <h4 className="font-semibold text-amber-900 text-lg">Cultural Context & Notes</h4>
                        <p className="text-amber-800 leading-relaxed break-words">
                          {culturalNotes}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <div className="mt-8">
            <Button
              onClick={handleTranslate}
              disabled={isTranslating || !inputText.trim() || !toLanguage}
              className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 px-4 py-3 sm:px-8 text-base sm:text-lg font-semibold"
            >
              {isTranslating ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Translating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <Brain className="w-5 h-5" />
                  <span>Translate with Cultural Context</span>
                </div>
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="break-words leading-relaxed">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security & Disclaimer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
        <Card className="bg-green-50 border-green-200 border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg text-green-800">
              <Shield className="w-6 h-6" />
              Corporate-Safe & Private
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-700 leading-relaxed">
            Your data is never stored or used for training. Unlike public tools, all translations happen on secure, private servers, ensuring your company's information remains confidential.
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200 border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg text-blue-800">
              <Brain className="w-6 h-6" />
              AI for Convenience, Humans for Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700 space-y-4">
            <p className="leading-relaxed">
              This AI tool is designed for quick checks and drafting. For legally binding documents, critical negotiations, or high-stakes content, professional human translation is essential.
            </p>
            <div className="break-words">
              <a 
                href="https://www.thelanguage-club.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-start text-blue-800 font-semibold hover:text-blue-900 underline group"
              >
                <span className="group-hover:text-blue-900 leading-tight">
                  Contact The Language Club for expert human translators
                </span>
                <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2 mt-0.5" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
