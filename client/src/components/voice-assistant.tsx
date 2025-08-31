
import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Mic, MicOff, Send, Square, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import sigiAvatar from "@assets/flux-1-kontext-dev_Stell_die_in_einer_C_1756603191003.png";

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceAssistant({ isOpen, onClose }: VoiceAssistantProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(true);
  const [sigiResponse, setSigiResponse] = useState<string>("");
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
    if (!isReady) return;
    
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
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsReady(false);
      setSigiResponse("");
      
      toast({
        title: "Aufnahme gestartet",
        description: "Sprechen Sie jetzt mit Sigi...",
      });
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
      
      toast({
        title: "Aufnahme beendet",
        description: "Bereit zum Absenden an Sigi.",
      });
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    setRecordedAudio(null);
    audioChunksRef.current = [];
    setIsReady(true);
    setSigiResponse("");
    
    toast({
      title: "Aufnahme abgebrochen",
      description: "Bereit für neue Aufnahme.",
    });
  };

  const sendToSigi = async () => {
    if (!recordedAudio) return;
    
    setIsProcessing(true);
    
    try {
      const demoMessage = "Hallo Sigi, wie ist das Wetter heute zum Angeln?";
      
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
          message: demoMessage,
          context: sigiContext
        })
      });
      
      const data = await response.json();
      setSigiResponse(data.reply || "Entschuldigung, ich konnte Ihre Anfrage nicht verarbeiten.");
      
      // Sigi-Antwort vorlesen
      if (data.reply && !isMuted) {
        const utterance = new SpeechSynthesisUtterance(data.reply);
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
      }
      
      toast({
        title: "Sigi antwortet",
        description: isMuted ? "Antwort empfangen (stumm)" : "Hören Sie Sigis Antwort...",
      });
      
      // Nach der Antwort zurücksetzen
      setTimeout(() => {
        setRecordedAudio(null);
        setIsReady(true);
        setIsProcessing(false);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Konnte nicht mit Sigi kommunizieren.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isRecording) {
      cancelRecording();
    }
    setRecordedAudio(null);
    setIsProcessing(false);
    setIsReady(true);
    setSigiResponse("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg mx-4 bg-gradient-to-br from-gray-900 via-blue-900/20 to-cyan-900/30 backdrop-blur-xl border border-cyan-400/40 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-gray-100">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={sigiAvatar} 
                  className="w-12 h-12 rounded-full border-2 border-cyan-400/50" 
                  alt="Sigi" 
                />
                {isProcessing && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <span className="text-lg font-bold text-cyan-300">Sigi</span>
                <p className="text-xs text-gray-400">KI Angel-Assistent</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} className="text-gray-300 hover:text-white hover:bg-red-500/20">
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Sigi Response Area */}
          {sigiResponse && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/20">
              <div className="flex items-start space-x-3">
                <img src={sigiAvatar} className="w-8 h-8 rounded-full" alt="Sigi" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-cyan-300 mb-1">Sigi sagt:</p>
                  <p className="text-gray-200 text-sm leading-relaxed">{sigiResponse}</p>
                </div>
              </div>
            </div>
          )}

          {/* Voice Status Display */}
          <div className="text-center">
            {isRecording && (
              <div className="animate-pulse">
                <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Mic className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-red-400 font-bold text-lg">🎤 Aufnahme läuft...</p>
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-6 bg-red-400 rounded animate-pulse"></div>
                    <div className="w-2 h-8 bg-red-500 rounded animate-pulse delay-75"></div>
                    <div className="w-2 h-4 bg-red-400 rounded animate-pulse delay-150"></div>
                    <div className="w-2 h-7 bg-red-500 rounded animate-pulse delay-75"></div>
                    <div className="w-2 h-5 bg-red-400 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            
            {recordedAudio && !isRecording && !isProcessing && (
              <div>
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <Send className="w-10 h-10 text-white" />
                </div>
                <p className="text-green-400 font-bold text-lg">✅ Bereit zum Senden</p>
                <p className="text-gray-400 text-sm">Aufnahme erfolgreich</p>
              </div>
            )}

            {isProcessing && (
              <div>
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-spin">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <p className="text-blue-400 font-bold text-lg">🤖 Sigi denkt nach...</p>
                <p className="text-gray-400 text-sm">Ihre Anfrage wird verarbeitet</p>
              </div>
            )}
            
            {!isRecording && !recordedAudio && isReady && !isProcessing && (
              <div>
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300">
                  <Mic className="w-10 h-10 text-white" />
                </div>
                <p className="text-cyan-400 font-bold text-lg">🎯 Bereit für Gespräch</p>
                <p className="text-gray-400 text-sm">Drücken Sie "Aufnahme" um zu starten</p>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Mikrofon/Stop Button */}
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={isProcessing}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 font-bold shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              >
                <Mic className="w-5 h-5 mr-2" />
                🎤 Aufnahme
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 font-bold shadow-lg hover:shadow-red-500/25 transition-all duration-300"
              >
                <Square className="w-5 h-5 mr-2" />
                ⏹️ Stop
              </Button>
            )}

            {/* Stumm Button */}
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant={isMuted ? "destructive" : "outline"}
              className={`py-4 font-bold transition-all duration-300 ${
                isMuted 
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 border-gray-500" 
                  : "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/30"
              }`}
            >
              {isMuted ? <VolumeX className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
              {isMuted ? "🔇 Stumm" : "🔊 Laut"}
            </Button>

            {/* Abbrechen Button */}
            <Button
              onClick={cancelRecording}
              variant="outline"
              disabled={!isRecording && !recordedAudio}
              className="py-4 border-gray-600 text-gray-300 hover:bg-gray-700/50 font-bold transition-all duration-300"
            >
              <X className="w-5 h-5 mr-2" />
              ❌ Abbrechen
            </Button>

            {/* Abschicken Button */}
            <Button
              onClick={sendToSigi}
              disabled={!recordedAudio || isProcessing}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-4 font-bold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700"
            >
              <Send className="w-5 h-5 mr-2" />
              {isProcessing ? "📤 Sende..." : "🚀 An Sigi"}
            </Button>
          </div>

          {/* Status Info */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>💡 Tipp: Sprechen Sie klar und deutlich für beste Ergebnisse</p>
            {isMuted && <p>🔇 Audio-Wiedergabe ist deaktiviert</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
