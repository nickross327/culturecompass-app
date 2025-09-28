
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wand2, User, Sparkles, Send } from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import { AnimatePresence, motion } from 'framer-motion';

const suggestedPrompts = [
  "How do I tip in Greece?",
  "How do I ask for the bill politely in Spanish?",
  "What's a common gift to bring to a host in Japan?",
  "Is it rude to be late in Germany?"
];

export default function ConciergeModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (prompt = inputValue) => {
    if (!prompt.trim() || isLoading) return;

    const userMessage = { id: Date.now(), sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const llmPrompt = `You are a helpful and friendly travel concierge for the app "CultureCompass". A user has the following question. Provide a concise, helpful, and culturally aware answer. If it's a language question, provide the phrase, a simple phonetic pronunciation, and context. User's question: "${prompt}"`;
      
      const response = await InvokeLLM({
        prompt: llmPrompt,
        add_context_from_internet: true,
      });

      const aiMessage = { id: Date.now() + 1, sender: 'ai', text: response };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error calling LLM:", error);
      const errorMessage = { id: Date.now() + 1, sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again in a moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            Culture Concierge
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`p-3 rounded-lg max-w-sm ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
               <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                  </div>
              </motion.div>
            )}

            {messages.length === 0 && !isLoading && (
              <div className="text-center text-slate-500 p-4">
                <p className="mb-4">Ask me anything about travel, culture, or language!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedPrompts.map(prompt => (
                     <Button 
                        key={prompt} 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendMessage(prompt)}
                        className="text-xs h-auto py-2 whitespace-normal"
                     >
                       {prompt}
                     </Button>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        
        <DialogFooter>
          <div className="w-full flex items-center gap-2">
            <Input 
              placeholder="Type your question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button onClick={() => handleSendMessage()} disabled={isLoading || !inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
