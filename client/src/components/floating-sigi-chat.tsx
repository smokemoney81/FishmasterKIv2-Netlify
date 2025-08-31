import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import sigiAvatar from "@assets/flux-1-kontext-dev_Stell_die_in_einer_C_1756603191003.png";

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  buddy?: string;
}

export default function FloatingSigiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      type: 'ai',
      message: '🎣 Hallo! Ich bin Sigi, Ihr Angel-Experte. Fragen Sie mich nach Wetter, Ausrüstung oder Spots!',
      timestamp: new Date(),
      buddy: 'Sigi'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hole Kontext-Daten für Sigi
  const { data: catches = [] } = useQuery({ queryKey: ['/api/catches'] });
  const { data: spots = [] } = useQuery({ queryKey: ['/api/spots'] });
  const { data: weather } = useQuery({ queryKey: ['/api/weather'] });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen]);

  const sendSigiMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    
    // Kontext für Sigi zusammenstellen
    const catchesArray = Array.isArray(catches) ? catches : [];
    const spotsArray = Array.isArray(spots) ? spots : [];
    
    const sigiContext = {
      userStats: {
        totalCatches: catchesArray.length,
        bestCatch: Math.max(...catchesArray.map((c: any) => c.weight || 0), 0),
        favoriteSpots: spotsArray.slice(0, 3).map((s: any) => s.name),
        equipment: []
      },
      weather: weather || {},
      selectedSpot: {},
      planningMode: false
    };
    
    try {
      const response = await fetch('/api/kibuddy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.message,
          context: sigiContext
        })
      });
      
      const data = await response.json();
      
      const sigiResponse: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: data.reply,
        timestamp: new Date(),
        buddy: 'Sigi'
      };
      
      setChatMessages(prev => [...prev, sigiResponse]);
      
    } catch (error) {
      // Fallback-Antwort von Sigi
      const fallbackResponse: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: generateSigiFallback(userMessage.message),
        timestamp: new Date(),
        buddy: 'Sigi'
      };
      setChatMessages(prev => [...prev, fallbackResponse]);
    }
    
    setIsTyping(false);
  };

  const generateSigiFallback = (message: string) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('hallo') || msg.includes('hi')) {
      return '👋 Hallo! Ich bin Sigi, Ihr persönlicher Angel-Experte bei FishMasterKI. Bereit für perfekte Fänge?';
    }
    
    if (msg.includes('wetter')) {
      return '🌤️ Das aktuelle Wetter ist perfekt zum Angeln! Basierend auf den Bedingungen empfehle ich leichte Köder.';
    }
    
    return '🎣 Als Ihr Angel-Buddy helfe ich bei allen Fragen rund ums Fischen. Ausrüstung, Wetteranalyse, Köder-Tipps - fragen Sie einfach!';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendSigiMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-2xl border-2 border-cyan-300/30 backdrop-blur-sm transition-all duration-300 hover:scale-110"
            data-testid="button-open-sigi"
          >
            <div className="relative">
              <img 
                src={sigiAvatar} 
                alt="Sigi AI" 
                className="w-12 h-12 rounded-full object-cover border-2 border-cyan-300/50"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </Button>
        )}
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-gradient-to-b from-gray-900/95 to-blue-900/95 backdrop-blur-lg rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-600 to-blue-600 border-b border-cyan-500/30">
            <div className="flex items-center gap-3">
              <img 
                src={sigiAvatar} 
                alt="Sigi AI" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
              />
              <div>
                <h3 className="text-white font-semibold text-sm">🎣 Sigi</h3>
                <p className="text-cyan-100 text-xs">Ihr Angel-Experte</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 w-8 h-8"
              data-testid="button-close-sigi"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 h-64 custom-scrollbar">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-br-sm shadow-lg'
                      : 'bg-gray-800/80 backdrop-blur-sm text-gray-100 rounded-bl-sm border border-cyan-500/20'
                  }`}
                >
                  {msg.type === 'ai' && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-semibold text-cyan-400">🎣 Sigi</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg rounded-bl-sm border border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-cyan-400">🎣 Sigi tippt...</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-gray-900/60 backdrop-blur-sm border-t border-cyan-500/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Fragen Sie Sigi..."
                disabled={isTyping}
                className="flex-1 bg-gray-800/60 border border-cyan-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-sm"
                data-testid="input-floating-sigi-message"
              />
              <Button
                onClick={sendSigiMessage}
                disabled={isTyping || !currentMessage.trim()}
                size="icon"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 w-10 h-10 rounded-lg"
                data-testid="button-send-floating-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}