import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function BadgeUnlockAnimation({ badge, onClose }) {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      onClose?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!badge || !showAnimation) return null;

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
          >
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 shadow-2xl max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                {/* Floating sparkles */}
                <div className="relative mb-6">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{ 
                        x: 0, 
                        y: 0, 
                        scale: 0,
                        opacity: 0 
                      }}
                      animate={{ 
                        x: Math.cos(i * 45 * Math.PI / 180) * 40,
                        y: Math.sin(i * 45 * Math.PI / 180) * 40,
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        delay: i * 0.1,
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      style={{
                        left: '50%',
                        top: '50%'
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                    </motion.div>
                  ))}
                  
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 3, repeat: Infinity },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-4xl shadow-lg mx-auto"
                  >
                    {badge.icon || <Trophy className="w-12 h-12 text-white" />}
                  </motion.div>
                </div>

                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-slate-900 mb-2"
                >
                  Badge Unlocked! 🎉
                </motion.h2>
                
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xl font-semibold text-blue-800 mb-3"
                >
                  {badge.name}
                </motion.h3>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-slate-600 mb-4"
                >
                  {badge.description}
                </motion.p>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1 }}
                  className="flex items-center justify-center gap-2 text-sm text-amber-700"
                >
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>+{badge.points} points earned</span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}