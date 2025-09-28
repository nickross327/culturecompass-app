import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InvokeLLM } from '@/api/integrations';
import { Send, Sparkles, Loader, MessageCircle, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const suggestedQueries = [
  "What should I know about business etiquette in Japan?",
  "How do I greet people properly in Thailand?",
  "What are dining customs I should follow in France?",
  "Tell me about gift-giving etiquette in Germany"
];

export default function AiQueryInterface({ countryName }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const handleQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    const currentQuery = query;
    setQuery('');

    try {
      const prompt = `You are a cultural expert for ${countryName}. Answer this question with specific, practical advice: ${currentQuery}
      
      Provide actionable insights that would help a traveler navigate the culture respectfully and effectively. Keep responses concise but informative.`;

      const aiResponse = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      const newConversation = {
        id: Date.now(),
        query: currentQuery,
        response: aiResponse,
        timestamp: new Date().toLocaleTimeString()
      };

      setConversationHistory(prev => [newConversation, ...prev]);
      setResponse(aiResponse);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setResponse("I'm having trouble connecting right now. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuery = (suggestedQuery) => {
    setQuery(suggestedQuery);
  };

  return (
    <Card className="cc-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          AI Cultural Assistant
        </CardTitle>
        <p className="text-slate-600 text-sm">
          Ask me anything about {countryName}'s culture, etiquette, or customs
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Query Input */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder={`Ask about ${countryName}'s culture...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
              disabled={isLoading}
              className="border-slate-200"
            />
          </div>
          <Button 
            onClick={handleQuery}
            disabled={!query.trim() || isLoading}
            className="cc-button-primary px-6"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Suggested Queries */}
        {conversationHistory.length === 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700">Try asking about:</h4>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((suggested, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuery(suggested)}
                  className="text-xs rounded-full border-slate-200 hover:border-blue-300 hover:text-blue-700"
                >
                  {suggested}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation History */}
        <AnimatePresence>
          {conversationHistory.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {/* User Query */}
              <div className="flex justify-end">
                <div className="max-w-sm bg-blue-100 rounded-2xl rounded-tr-sm p-3">
                  <p className="text-sm text-blue-900">{conversation.query}</p>
                  <p className="text-xs text-blue-600 mt-1">{conversation.timestamp}</p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="max-w-lg bg-slate-100 rounded-2xl rounded-tl-sm p-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {conversation.response}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">{conversation.timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}