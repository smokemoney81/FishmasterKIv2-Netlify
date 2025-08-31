import { useState, useEffect, useRef } from "react";
import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Fish, Trophy, Play, RotateCcw, Timer, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Fish {
  id: number;
  name: string;
  emoji: string;
  points: number;
  size: string;
  speed: number;
}

const fishTypes: Fish[] = [
  { id: 1, name: "Kleiner Fisch", emoji: "🐟", points: 10, size: "small", speed: 2000 },
  { id: 2, name: "Forelle", emoji: "🐠", points: 25, size: "medium", speed: 1500 },
  { id: 3, name: "Lachs", emoji: "🎣", points: 50, size: "large", speed: 1200 },
  { id: 4, name: "Seltener Fisch", emoji: "🐡", points: 100, size: "rare", speed: 800 }
];

export default function Minigame() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'ended'>('menu');
  const [score, setScore] = useState(0);
  const [currentFish, setCurrentFish] = useState<Fish | null>(null);
  const [fishPosition, setFishPosition] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('fishingGameBestScore') || '0');
  });
  const [catchZone, setCatchZone] = useState({ start: 40, end: 60 });
  const [canCatch, setCanCatch] = useState(false);
  const gameLoopRef = useRef<number>();
  const timerRef = useRef<number>();
  const { toast } = useToast();

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    spawnFish();
    
    // Game timer
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    setGameState('ended');
    setCurrentFish(null);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('fishingGameBestScore', score.toString());
      toast({
        title: "🏆 Neuer Rekord!",
        description: `Fantastisch! Neuer Bestwert: ${score} Punkte!`
      });
    }
  };

  const spawnFish = () => {
    const randomFish = fishTypes[Math.floor(Math.random() * fishTypes.length)];
    setCurrentFish(randomFish);
    setFishPosition(0);
    setCanCatch(false);
    
    // Random catch zone
    const zoneSize = 20;
    const zoneStart = Math.random() * (80 - zoneSize) + 10;
    setCatchZone({ start: zoneStart, end: zoneStart + zoneSize });
    
    animateFish(randomFish);
  };

  const animateFish = (fish: Fish) => {
    const startTime = Date.now();
    const duration = fish.speed;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const newPosition = progress * 100;
      setFishPosition(newPosition);
      
      // Check if fish is in catch zone
      setCanCatch(newPosition >= catchZone.start && newPosition <= catchZone.end);
      
      if (progress < 1 && gameState === 'playing') {
        gameLoopRef.current = requestAnimationFrame(animate);
      } else if (gameState === 'playing') {
        // Fish escaped
        setStreak(0);
        setTimeout(spawnFish, 500);
      }
    };
    
    gameLoopRef.current = requestAnimationFrame(animate);
  };

  const attemptCatch = () => {
    if (!currentFish || gameState !== 'playing') return;
    
    if (canCatch) {
      // Successful catch!
      const points = currentFish.points * (1 + streak * 0.1); // Bonus for streak
      setScore(prev => prev + Math.floor(points));
      setStreak(prev => prev + 1);
      
      toast({
        title: `🎣 ${currentFish.name} gefangen!`,
        description: `+${Math.floor(points)} Punkte! Streak: ${streak + 1}`
      });
      
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      
      setTimeout(spawnFish, 300);
    } else {
      // Missed!
      setStreak(0);
      toast({
        title: "🎯 Verpasst!",
        description: "Timing war nicht richtig. Streak verloren!",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setStreak(0);
    setCurrentFish(null);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <>
      <MobileHeader title="Angel-Minispiel" />
      
      <div className="px-4 py-4 pb-20">
        
        {/* Game Status Bar */}
        {gameState === 'playing' && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="p-3 bg-slate-800/50 border-cyan-500/30 text-center">
              <div className="text-cyan-300 text-lg font-bold">{score}</div>
              <div className="text-xs text-gray-400">Punkte</div>
            </Card>
            <Card className="p-3 bg-slate-800/50 border-cyan-500/30 text-center">
              <div className="text-orange-400 text-lg font-bold">{timeLeft}</div>
              <div className="text-xs text-gray-400">Sekunden</div>
            </Card>
            <Card className="p-3 bg-slate-800/50 border-cyan-500/30 text-center">
              <div className="text-green-400 text-lg font-bold">{streak}</div>
              <div className="text-xs text-gray-400">Streak</div>
            </Card>
          </div>
        )}

        {/* Main Game Area */}
        <Card className="p-6 bg-gradient-to-b from-blue-900/30 to-slate-900/30 border-cyan-500/30 min-h-[400px]">
          
          {gameState === 'menu' && (
            <div className="text-center space-y-6">
              <div>
                <Fish className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-cyan-300 mb-2">Angel-Minispiel</h1>
                <p className="text-gray-300">Fange Fische zur richtigen Zeit!</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {fishTypes.map(fish => (
                    <div key={fish.id} className="flex items-center justify-between bg-slate-800/30 p-2 rounded">
                      <span className="text-xl">{fish.emoji}</span>
                      <span className="text-gray-300">{fish.name}</span>
                      <Badge variant="outline" className="text-yellow-400">{fish.points}p</Badge>
                    </div>
                  ))}
                </div>
                
                <div className="bg-slate-800/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Bester Score:</span>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{bestScore}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={startGame}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Spiel starten
              </Button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-cyan-300 mb-2">Fange den Fisch!</h2>
                <p className="text-gray-300">Klicke wenn der Fisch in der grünen Zone ist</p>
              </div>
              
              {/* Fishing Line */}
              <div className="relative h-32 bg-gradient-to-b from-cyan-900/20 to-blue-900/40 rounded-lg border border-cyan-500/30 overflow-hidden">
                
                {/* Catch Zone */}
                <div 
                  className="absolute top-0 bottom-0 bg-green-500/20 border-x-2 border-green-400"
                  style={{
                    left: `${catchZone.start}%`,
                    width: `${catchZone.end - catchZone.start}%`
                  }}
                />
                
                {/* Fish */}
                {currentFish && (
                  <div 
                    className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-75 ${
                      canCatch ? 'scale-125' : 'scale-100'
                    }`}
                    style={{ left: `${fishPosition}%` }}
                  >
                    <span className="text-4xl">{currentFish.emoji}</span>
                  </div>
                )}
                
                {/* Hook */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                  <Target className={`w-6 h-6 ${canCatch ? 'text-green-400' : 'text-gray-400'}`} />
                </div>
              </div>
              
              <Button 
                onClick={attemptCatch}
                className={`w-full h-16 text-lg font-bold ${
                  canCatch 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                    : 'bg-gradient-to-r from-gray-600 to-gray-700'
                }`}
                size="lg"
              >
                🎣 FANGEN!
              </Button>
            </div>
          )}

          {gameState === 'ended' && (
            <div className="text-center space-y-6">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
              
              <div>
                <h2 className="text-2xl font-bold text-cyan-300 mb-2">Spiel beendet!</h2>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-yellow-400">{score} Punkte</div>
                  {score === bestScore && score > 0 && (
                    <Badge className="bg-yellow-500/20 text-yellow-400">🏆 Neuer Rekord!</Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-800/30 p-3 rounded">
                  <div className="text-gray-400">Endpunkte</div>
                  <div className="text-cyan-300 font-bold">{score}</div>
                </div>
                <div className="bg-slate-800/30 p-3 rounded">
                  <div className="text-gray-400">Bester Score</div>
                  <div className="text-yellow-400 font-bold">{bestScore}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Nochmal spielen
                </Button>
                <Button 
                  onClick={resetGame}
                  variant="outline"
                  className="w-full border-cyan-500/30"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Zurück zum Menü
                </Button>
              </div>
            </div>
          )}
        </Card>
        
        {/* Game Instructions */}
        {gameState === 'menu' && (
          <Card className="mt-4 p-4 bg-slate-800/30 border-cyan-500/20">
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Spielregeln</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Klicke "FANGEN!" wenn der Fisch in der grünen Zone ist</li>
              <li>• Verschiedene Fische geben unterschiedliche Punkte</li>
              <li>• Aufeinanderfolgende Fänge erhöhen den Streak-Bonus</li>
              <li>• Du hast 30 Sekunden Zeit</li>
              <li>• Versuche deinen Bestwert zu schlagen!</li>
            </ul>
          </Card>
        )}
      </div>
    </>
  );
}