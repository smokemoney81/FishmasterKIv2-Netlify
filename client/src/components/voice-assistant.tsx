import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Mic, MicOff, Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import sigiAvatar from "@assets/flux-1-kontext-dev_Stell_die_in_einer_C_1756603191003.png";

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceAssistant({ isOpen, onClose }: VoiceAssistantProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(true); // Bereit für Interaktion
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
    setIsReady(true); // Zurück zum bereit-Zustand
    
    toast({
      title: "Aufnahme abgebrochen",
      description: "Bereit für neue Aufnahme.",
    });
  };

  const sendToSigi = async () => {
    if (!recordedAudio) return;
    
    setIsProcessing(true);
    
    try {
      // Hier würde normalerweise die Spracherkennung stattfinden
      // Für Demo verwenden wir einen Fallback-Text
      const demoMessage = "Hallo Sigi, wie ist das Wetter heute zum Angeln?";
      
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
      
      // Sigi-Antwort vorlesen
      if (data.reply && !isMuted) {
        const utterance = new SpeechSynthesisUtterance(data.reply);
        utterance.lang = 'de-DE';
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
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Konnte nicht mit Sigi kommunizieren.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isRecording) {
      cancelRecording();
    }
    setRecordedAudio(null);
    setIsProcessing(false);
    setIsReady(true); // Zurück zum Ausgangszustand
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-4 bg-gray-900/95 backdrop-blur-md border border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-gray-100">
            <div className="flex items-center space-x-3">
              <img 
                src={sigiAvatar} 
                className="w-10 h-10 rounded-full" 
                alt="Sigi" 
              />
              <span>Sigi Sprach-Assistent</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} className="text-gray-300 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Aufnahme-Status */}
          <div className="text-center">
            {isRecording && (
              <div className="animate-pulse">
                <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <p className="text-red-400 font-medium">Aufnahme läuft...</p>
              </div>
            )}
            
            {recordedAudio && !isRecording && (
              <div>
                <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <p className="text-green-400 font-medium">Bereit zum Senden</p>
              </div>
            )}
            
            {!isRecording && !recordedAudio && isReady && (
              <div>
                <div className="w-20 h-20 bg-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <p className="text-cyan-400 font-medium">Bereit - Drücken Sie "Aufnahme"</p>
                <p className="text-gray-500 text-sm mt-2">Klicken Sie auf Aufnahme um zu starten</p>
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
                className="bg-green-600 hover:bg-green-700 text-white py-3"
              >
                <Mic className="w-5 h-5 mr-2" />
                Aufnahme
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700 text-white py-3"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            )}

            {/* Stumm Button */}
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant={isMuted ? "destructive" : "outline"}
              className="py-3"
            >
              {isMuted ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
              {isMuted ? "Stumm" : "Laut"}
            </Button>

            {/* Abbrechen Button */}
            <Button
              onClick={cancelRecording}
              variant="outline"
              disabled={!isRecording && !recordedAudio}
              className="py-3 border-gray-600 text-gray-300"
            >
              <X className="w-5 h-5 mr-2" />
              Abbrechen
            </Button>

            {/* Abschicken Button */}
            <Button
              onClick={sendToSigi}
              disabled={!recordedAudio || isProcessing}
              className="bg-cyan-600 hover:bg-cyan-700 text-white py-3"
            >
              <Send className="w-5 h-5 mr-2" />
              {isProcessing ? "Sende..." : "An Sigi"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}