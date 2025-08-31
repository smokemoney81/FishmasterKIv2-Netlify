import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  buddy?: string;
}

export default function KiBuddy() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      type: 'ai',
      message: '🎣 Hallo! Ich bin Sigi, Ihr persönlicher Angel-Experte bei FishMasterKI. Bereit für perfekte Fänge? Fragen Sie mich nach Ausrüstung, Wetter oder Spots!',
      timestamp: new Date(),
      buddy: 'Sigi'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Hole Kontext-Daten für Sigi
  const { data: catches = [] } = useQuery({ queryKey: ['/api/catches'] });
  const { data: spots = [] } = useQuery({ queryKey: ['/api/spots'] });
  const { data: species = [] } = useQuery({ queryKey: ['/api/species'] });
  const { data: weather } = useQuery({ queryKey: ['/api/weather'] });

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
    const sigiContext = {
      userStats: {
        totalCatches: catches.length,
        bestCatch: Math.max(...catches.map((c: any) => c.weight || 0), 0),
        favoriteSpots: spots.slice(0, 3).map((s: any) => s.name),
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
      return '👋 Hallo! Ich bin Sigi, Ihr persönlicher Angel-Experte bei FishMasterKI. Bereit für perfekte Fänge? Fragen Sie mich nach Ausrüstung, Wetter oder Spots!';
    }
    
    if (msg.includes('wetter')) {
      return '🌤️ Wetteranalyse ist meine Spezialität! Wählen Sie einen Angelplatz aus und ich analysiere die Bedingungen für optimale Fangchancen.';
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
    <div className="p-4 max-w-md mx-auto bg-gradient-to-b from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-cyan-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">S</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">🎣 Sigi - Ihr Angel-Experte</h2>
      </div>
      
      <div className="h-64 overflow-y-auto p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 mb-4 space-y-3">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-cyan-500 text-white rounded-br-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-sm'
              }`}
            >
              <div className="text-sm">
                {msg.type === 'ai' && (
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">🎣 Sigi</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-bl-sm">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">🎣 Sigi tippt...</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Fragen Sie Sigi nach Angel-Tipps..."
          disabled={isTyping}
          data-testid="input-sigi-message"
        />
        <button
          onClick={sendSigiMessage}
          disabled={isTyping || !currentMessage.trim()}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          data-testid="button-send-message"
        >
          {isTyping ? '⏳' : '📤'}
        </button>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        💡 Probieren Sie: "Tutorial", "Zander Ausrüstung", "Wetter Tipps"
      </div>
    </div>
  );
}