
import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import sigiAvatar from "@assets/flux-1-kontext-dev_Stell_die_in_einer_C_1756603191003.png";

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VoiceMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  isAudio?: boolean;
}

export default function VoiceAssistant({ isOpen, onClose }: VoiceAssistantProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([
    {
      id: 0,
      type: 'ai',
      message: 'Hallo! Ich bin Sigi, Ihr Angel-Experte. Drücken Sie das Mikrofon und sprechen Sie mit mir!',
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
    const userMessage: VoiceMessage = {
      id: Date.now(),
      type: 'user',
      message: demoTranscript,
      timestamp: new Date(),
      isAudio: true
    };
    setVoiceMessages(prev => [...prev, userMessage]);
    
    // Sende an Sigi
    await sendToSigi(demoTranscript);
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
      
      const sigiMessage: VoiceMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: data.reply || "Entschuldigung, ich konnte Ihre Anfrage nicht verarbeiten.",
        timestamp: new Date()
      };
      
      setVoiceMessages(prev => [...prev, sigiMessage]);
      
      // Sigi-Antwort vorlesen
      if (data.reply && !isMuted) {
        const utterance = new SpeechSynthesisUtterance(data.reply);
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      const fallbackMessage: VoiceMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: "Entschuldigung, es gab ein Problem bei der Verbindung. Versuchen Sie es erneut.",
        timestamp: new Date()
      };
      setVoiceMessages(prev => [...prev, fallbackMessage]);
    }
    
    setIsProcessing(false);
    setRecordedAudio(null);
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    setRecordedAudio(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg mx-4 h-[70vh] flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <DialogHeader className="flex-shrink-0 pb-6 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={sigiAvatar} 
                className="w-10 h-10 rounded-full" 
                alt="Sigi" 
              />
              <div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Sigi</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sprach-Assistent</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {/* Voice Messages Display */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {voiceMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {msg.type === 'ai' && (
                  <img src={sigiAvatar} className="w-8 h-8 rounded-full flex-shrink-0 mt-1" alt="Sigi" />
                )}
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  {msg.isAudio && (
                    <div className="flex items-center mt-2 text-xs opacity-70">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Sprachnachricht
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[85%]">
                <img src={sigiAvatar} className="w-8 h-8 rounded-full flex-shrink-0 mt-1" alt="Sigi" />
                <div className="px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Sigi denkt nach...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Voice Control Area */}
        <div className="flex-shrink-0 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center space-y-4">
            
            {/* Large Voice Button */}
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`w-20 h-20 rounded-full transition-all duration-300 transform ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white scale-110 shadow-lg animate-pulse' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:scale-105'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </Button>
            
            {/* Status Text */}
            <div className="text-center">
              {isRecording ? (
                <div className="flex items-center justify-center space-x-2 text-red-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">🎤 Aufnahme läuft...</span>
                </div>
              ) : isProcessing ? (
                <span className="text-sm text-blue-500 font-medium">🤖 Sigi verarbeitet...</span>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Drücken Sie das Mikrofon zum Sprechen
                </span>
              )}
            </div>
            
            {/* Instructions */}
            <div className="text-center text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg">
              🎣 Fragen Sie Sigi nach Wetter, Angel-Tipps oder Spots
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
