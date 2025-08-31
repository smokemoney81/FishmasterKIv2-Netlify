
import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import sigiAvatar from "@assets/flux-1-kontext-dev_Stell_die_in_einer_C_1756603191003.png";

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

export default function VoiceAssistant({ isOpen, onClose }: VoiceAssistantProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      type: 'ai',
      message: 'Hallo! Ich bin Sigi, Ihr Angel-Experte. Wie kann ich Ihnen heute helfen?',
      timestamp: new Date()
    }
  ]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Hole Kontext-Daten für Sigi
  const { data: catches = [] } = useQuery({ queryKey: ['/api/catches'] });
  const { data: spots = [] } = useQuery({ queryKey: ['/api/spots'] });
  const { data: weather } = useQuery({ 
    queryKey: ['/api/weather'], 
    queryFn: async () => {
      const response = await fetch("/api/weather?lat=39.0968&lng=-120.0324");
      return response.json();
    }
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        processAudioAndSend(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Mikrofon-Fehler",
        description: "Konnte nicht auf das Mikrofon zugreifen.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioAndSend = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    // Demo: Simuliere Spracherkennung
    const demoTranscript = "Wie ist das Wetter heute zum Angeln?";
    
    // Füge User-Nachricht hinzu
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      message: demoTranscript,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    
    // Sende an Sigi
    await sendToSigi(demoTranscript);
  };

  const sendTextMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      message: currentMessage.trim(),
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage.trim();
    setCurrentMessage("");
    
    await sendToSigi(messageToSend);
  };

  const sendToSigi = async (messageText: string) => {
    setIsProcessing(true);
    
    try {
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
      
      const response = await fetch('/api/kibuddy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          context: sigiContext
        })
      });
      
      const data = await response.json();
      
      const sigiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: data.reply || "Entschuldigung, ich konnte Ihre Anfrage nicht verarbeiten.",
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, sigiMessage]);
      
      // Sigi-Antwort vorlesen
      if (data.reply && !isMuted) {
        const utterance = new SpeechSynthesisUtterance(data.reply);
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      const fallbackMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: "Entschuldigung, es gab ein Problem bei der Verbindung. Versuchen Sie es erneut.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, fallbackMessage]);
    }
    
    setIsProcessing(false);
    setRecordedAudio(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    setRecordedAudio(null);
    setIsProcessing(false);
    setCurrentMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl mx-4 h-[80vh] flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={sigiAvatar} 
                className="w-8 h-8 rounded-full" 
                alt="Sigi" 
              />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Sigi</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {msg.type === 'ai' && (
                  <img src={sigiAvatar} className="w-6 h-6 rounded-full flex-shrink-0 mt-1" alt="Sigi" />
                )}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[80%]">
                <img src={sigiAvatar} className="w-6 h-6 rounded-full flex-shrink-0 mt-1" alt="Sigi" />
                <div className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Sigi tippt...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-end space-x-2">
            <div className="flex-1 min-h-[44px] max-h-32 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus-within:border-blue-500 dark:focus-within:border-blue-400">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nachricht an Sigi..."
                disabled={isProcessing}
                className="w-full px-4 py-3 bg-transparent border-none outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows={1}
              />
            </div>
            
            {/* Voice Button */}
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              size="sm"
              className={`w-11 h-11 rounded-xl transition-colors ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            {/* Send Button */}
            <Button
              onClick={sendTextMessage}
              disabled={isProcessing || !currentMessage.trim()}
              size="sm"
              className="w-11 h-11 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Status */}
          {isRecording && (
            <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Aufnahme läuft...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
