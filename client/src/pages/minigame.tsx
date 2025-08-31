import { useState, useEffect, useRef } from "react";
import MobileHeader from "@/components/layout/mobile-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fish, Trophy, Play, RotateCcw, Timer, Target, Waves, Sun, Moon, Cloud, Zap, Star, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Fish {
  id: number;
  name: string;
  emoji: string;
  points: number;
  size: 'tiny' | 'small' | 'medium' | 'large' | 'legendary';
  depth: number;
  rarity: number; // 0-1, 0 = common, 1 = very rare
  behavior: 'calm' | 'active' | 'aggressive' | 'shy';
  preferredTime: 'dawn' | 'day' | 'dusk' | 'night' | 'any';
  preferredWeather: 'sunny' | 'cloudy' | 'rainy' | 'any';
}

interface Bait {
  id: string;
  name: string;
  emoji: string;
  effectiveness: { [key: string]: number }; // fish behavior -> effectiveness
  cost: number;
  description: string;
}

interface GameState {
  mode: 'menu' | 'playing' | 'casting' | 'waiting' | 'fight' | 'ended';
  score: number;
  coins: number;
  level: number;
  experience: number;
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  weather: 'sunny' | 'cloudy' | 'rainy';
  currentDepth: number;
  selectedBait: string;
  rodPosition: { x: number; y: number };
  hookPosition: { x: number; y: number };
  currentFish: Fish | null;
  fightProgress: number;
  energy: number;
  combo: number;
  achievements: string[];
}

const fishTypes: Fish[] = [
  { id: 1, name: "Winziger Fisch", emoji: "🐠", points: 5, size: 'tiny', depth: 1, rarity: 0.8, behavior: 'calm', preferredTime: 'any', preferredWeather: 'any' },
  { id: 2, name: "Goldfisch", emoji: "🐟", points: 15, size: 'small', depth: 2, rarity: 0.6, behavior: 'shy', preferredTime: 'day', preferredWeather: 'sunny' },
  { id: 3, name: "Regenbogenforelle", emoji: "🌈", points: 35, size: 'medium', depth: 3, rarity: 0.4, behavior: 'active', preferredTime: 'dawn', preferredWeather: 'cloudy' },
  { id: 4, name: "Lachs", emoji: "🍣", points: 60, size: 'large', depth: 4, rarity: 0.3, behavior: 'aggressive', preferredTime: 'dusk', preferredWeather: 'any' },
  { id: 5, name: "Großer Hecht", emoji: "🦈", points: 100, size: 'large', depth: 5, rarity: 0.2, behavior: 'aggressive', preferredTime: 'night', preferredWeather: 'rainy' },
  { id: 6, name: "Mystischer Karpfen", emoji: "🐉", points: 200, size: 'legendary', depth: 6, rarity: 0.05, behavior: 'shy', preferredTime: 'dawn', preferredWeather: 'cloudy' },
  { id: 7, name: "Goldener Fisch", emoji: "⭐", points: 500, size: 'legendary', depth: 7, rarity: 0.01, behavior: 'shy', preferredTime: 'dusk', preferredWeather: 'sunny' }
];

const baits: Bait[] = [
  { id: 'worm', name: 'Wurm', emoji: '🪱', effectiveness: { calm: 1.2, shy: 1.1, active: 1.0, aggressive: 0.8 }, cost: 0, description: 'Universalköder für Anfänger' },
  { id: 'fly', name: 'Fliege', emoji: '🪰', effectiveness: { calm: 1.0, shy: 1.3, active: 1.4, aggressive: 0.9 }, cost: 5, description: 'Perfekt für scheue Fische' },
  { id: 'spinner', name: 'Spinner', emoji: '⚡', effectiveness: { calm: 0.9, shy: 0.8, active: 1.5, aggressive: 1.3 }, cost: 10, description: 'Lockt aktive Fische an' },
  { id: 'live', name: 'Lebendköder', emoji: '🐛', effectiveness: { calm: 1.1, shy: 1.2, active: 1.2, aggressive: 1.5 }, cost: 15, description: 'Premium-Köder für große Fische' }
];

const locations = [
  { id: 'pond', name: 'Ruhiger Teich', emoji: '🏞️', depths: [1, 2, 3], bonus: 'Erhöhte Chance auf scheue Fische' },
  { id: 'river', name: 'Wildbach', emoji: '🏔️', depths: [2, 3, 4, 5], bonus: 'Mehr aktive und aggressive Fische' },
  { id: 'deep_lake', name: 'Tiefer See', emoji: '🌊', depths: [4, 5, 6, 7], bonus: 'Legendäre Fische möglich' }
];

export default function Minigame() {
  const [gameState, setGameState] = useState<GameState>({
    mode: 'menu',
    score: 0,
    coins: 50,
    level: 1,
    experience: 0,
    timeOfDay: 'day',
    weather: 'sunny',
    currentDepth: 1,
    selectedBait: 'worm',
    rodPosition: { x: 50, y: 10 },
    hookPosition: { x: 50, y: 90 },
    currentFish: null,
    fightProgress: 0,
    energy: 100,
    combo: 0,
    achievements: []
  });

  const [selectedLocation, setSelectedLocation] = useState('pond');
  const [castPower, setCastPower] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [waterAnimation, setWaterAnimation] = useState(0);
  const [fishMovement, setFishMovement] = useState({ x: 0, y: 0 });
  
  const gameLoopRef = useRef<number>();
  const { toast } = useToast();

  // Water animation
  useEffect(() => {
    const animate = () => {
      setWaterAnimation(prev => (prev + 1) % 360);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Time and weather cycle
  useEffect(() => {
    const timeWeatherCycle = setInterval(() => {
      setGameState(prev => {
        const times: Array<'dawn' | 'day' | 'dusk' | 'night'> = ['dawn', 'day', 'dusk', 'night'];
        const weathers: Array<'sunny' | 'cloudy' | 'rainy'> = ['sunny', 'cloudy', 'rainy'];
        const newTime = times[(times.indexOf(prev.timeOfDay) + 1) % times.length];
        const newWeather = Math.random() < 0.3 ? weathers[Math.floor(Math.random() * weathers.length)] : prev.weather;
        
        return { ...prev, timeOfDay: newTime, weather: newWeather };
      });
    }, 10000); // Change every 10 seconds
    
    return () => clearInterval(timeWeatherCycle);
  }, []);

  const getTimeIcon = () => {
    switch (gameState.timeOfDay) {
      case 'dawn': return '🌅';
      case 'day': return '☀️';
      case 'dusk': return '🌇';
      case 'night': return '🌙';
    }
  };

  const getWeatherIcon = () => {
    switch (gameState.weather) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
    }
  };

  const calculateFishSpawnChance = (fish: Fish) => {
    let chance = fish.rarity;
    
    // Time preference bonus
    if (fish.preferredTime === gameState.timeOfDay || fish.preferredTime === 'any') {
      chance *= 1.5;
    }
    
    // Weather preference bonus
    if (fish.preferredWeather === gameState.weather || fish.preferredWeather === 'any') {
      chance *= 1.3;
    }
    
    // Depth bonus
    if (fish.depth === gameState.currentDepth) {
      chance *= 2;
    }
    
    // Bait effectiveness
    const selectedBaitObj = baits.find(b => b.id === gameState.selectedBait);
    if (selectedBaitObj) {
      chance *= selectedBaitObj.effectiveness[fish.behavior] || 1;
    }
    
    return Math.min(chance, 0.9); // Cap at 90%
  };

  const startCasting = () => {
    if (gameState.energy < 20) {
      toast({
        title: "Zu müde!",
        description: "Du brauchst mehr Energie zum Angeln. Warte einen Moment.",
        variant: "destructive"
      });
      return;
    }

    setGameState(prev => ({ ...prev, mode: 'casting', energy: prev.energy - 20 }));
    setIsCharging(true);
    setCastPower(0);
    
    const chargeInterval = setInterval(() => {
      setCastPower(prev => {
        if (prev >= 100) {
          clearInterval(chargeInterval);
          setIsCharging(false);
          performCast(100);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const performCast = (power: number) => {
    const depth = Math.min(Math.floor((power / 100) * locations.find(l => l.id === selectedLocation)!.depths.length) + 1, 7);
    setGameState(prev => ({ ...prev, currentDepth: depth, mode: 'waiting' }));
    
    // Animate hook drop
    const dropAnimation = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        hookPosition: {
          x: 50 + (Math.random() - 0.5) * 10,
          y: Math.min(prev.hookPosition.y + 5, 90)
        }
      }));
    }, 100);

    setTimeout(() => {
      clearInterval(dropAnimation);
      checkForFish();
    }, 2000);
  };

  const checkForFish = () => {
    const availableFish = fishTypes.filter(fish => {
      const location = locations.find(l => l.id === selectedLocation)!;
      return location.depths.includes(fish.depth);
    });
    
    let caughtFish = null;
    for (const fish of availableFish) {
      const chance = calculateFishSpawnChance(fish);
      if (Math.random() < chance) {
        caughtFish = fish;
        break;
      }
    }
    
    if (caughtFish) {
      setGameState(prev => ({ ...prev, currentFish: caughtFish, mode: 'fight', fightProgress: 0 }));
      setFishMovement({ x: Math.random() * 80 + 10, y: Math.random() * 30 + 60 });
      startFishFight();
    } else {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, mode: 'playing' }));
        toast({
          title: "Kein Biss...",
          description: "Versuche einen anderen Köder oder Angelplatz!"
        });
      }, 1000);
    }
  };

  const startFishFight = () => {
    const fightLoop = setInterval(() => {
      setGameState(prev => {
        if (prev.fightProgress >= 100) {
          clearInterval(fightLoop);
          completeCatch();
          return prev;
        }
        
        // Fish resistance based on size and behavior
        const resistance = prev.currentFish ? {
          tiny: 1, small: 2, medium: 4, large: 6, legendary: 10
        }[prev.currentFish.size] : 1;
        
        const progress = Math.max(0, prev.fightProgress - resistance + 5);
        return { ...prev, fightProgress: progress };
      });
    }, 200);
  };

  const pullRod = () => {
    setGameState(prev => ({
      ...prev,
      fightProgress: Math.min(prev.fightProgress + 15, 100)
    }));
    
    // Animate fish movement
    setFishMovement(prev => ({
      x: Math.max(10, Math.min(90, prev.x + (Math.random() - 0.5) * 20)),
      y: Math.max(50, Math.min(90, prev.y + (Math.random() - 0.5) * 15))
    }));
  };

  const completeCatch = () => {
    if (!gameState.currentFish) return;
    
    const fish = gameState.currentFish;
    const basePoints = fish.points;
    const comboBonus = Math.floor(basePoints * (gameState.combo * 0.1));
    const totalPoints = basePoints + comboBonus;
    
    const coinReward = Math.floor(totalPoints / 10);
    const expReward = Math.floor(totalPoints / 5);
    
    setGameState(prev => ({
      ...prev,
      mode: 'playing',
      score: prev.score + totalPoints,
      coins: prev.coins + coinReward,
      experience: prev.experience + expReward,
      combo: prev.combo + 1,
      currentFish: null,
      energy: Math.min(prev.energy + 10, 100)
    }));
    
    // Check for level up
    const newLevel = Math.floor(gameState.experience / 100) + 1;
    if (newLevel > gameState.level) {
      setGameState(prev => ({ ...prev, level: newLevel }));
      toast({
        title: `🎉 Level ${newLevel}!`,
        description: "Du bist aufgestiegen! Neue Köder verfügbar!"
      });
    }
    
    toast({
      title: `🎣 ${fish.name} gefangen!`,
      description: `+${totalPoints} Punkte (+${comboBonus} Combo) | +${coinReward} Münzen`,
    });
    
    // Check achievements
    checkAchievements(fish);
  };

  const checkAchievements = (fish: Fish) => {
    const newAchievements = [];
    
    if (gameState.score + fish.points >= 1000 && !gameState.achievements.includes('score_1000')) {
      newAchievements.push('score_1000');
    }
    
    if (fish.size === 'legendary' && !gameState.achievements.includes('legendary_catch')) {
      newAchievements.push('legendary_catch');
    }
    
    if (gameState.combo >= 5 && !gameState.achievements.includes('combo_5')) {
      newAchievements.push('combo_5');
    }
    
    if (newAchievements.length > 0) {
      setGameState(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements]
      }));
      
      newAchievements.forEach(achievement => {
        const achievements = {
          'score_1000': { name: '1000 Punkte Master', reward: 50 },
          'legendary_catch': { name: 'Legendärer Angler', reward: 100 },
          'combo_5': { name: 'Combo Master', reward: 25 }
        };
        
        toast({
          title: `🏆 Achievement freigeschaltet!`,
          description: `${achievements[achievement].name} (+${achievements[achievement].reward} Münzen)`
        });
      });
    }
  };

  const buyBait = (baitId: string) => {
    const bait = baits.find(b => b.id === baitId);
    if (!bait || gameState.coins < bait.cost) return;
    
    setGameState(prev => ({
      ...prev,
      coins: prev.coins - bait.cost,
      selectedBait: baitId
    }));
    
    toast({
      title: "Köder gekauft!",
      description: `${bait.name} für ${bait.cost} Münzen`
    });
  };

  const resetGame = () => {
    setGameState({
      mode: 'menu',
      score: 0,
      coins: 50,
      level: 1,
      experience: 0,
      timeOfDay: 'day',
      weather: 'sunny',
      currentDepth: 1,
      selectedBait: 'worm',
      rodPosition: { x: 50, y: 10 },
      hookPosition: { x: 50, y: 90 },
      currentFish: null,
      fightProgress: 0,
      energy: 100,
      combo: 0,
      achievements: []
    });
  };

  const startGame = () => {
    setGameState(prev => ({ ...prev, mode: 'playing' }));
  };

  // Energy regeneration
  useEffect(() => {
    const energyRegen = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        energy: Math.min(prev.energy + 1, 100)
      }));
    }, 3000);
    
    return () => clearInterval(energyRegen);
  }, []);

  return (
    <>
      <MobileHeader title="Angel-Abenteuer" />
      
      <div className="px-4 py-4 pb-20">
        
        {/* Environment Status */}
        <Card className="p-3 mb-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl">{getTimeIcon()}</div>
                <div className="text-xs text-gray-400 capitalize">{gameState.timeOfDay}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">{getWeatherIcon()}</div>
                <div className="text-xs text-gray-400 capitalize">{gameState.weather}</div>
              </div>
              <div className="text-center">
                <div className="text-cyan-300 font-bold">Tiefe {gameState.currentDepth}</div>
                <div className="text-xs text-gray-400">Meter</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-bold">{gameState.coins} 🪙</div>
              <div className="text-cyan-300 text-sm">Level {gameState.level}</div>
            </div>
          </div>
        </Card>

        {gameState.mode === 'menu' && (
          <div className="space-y-6">
            {/* Main Menu */}
            <Card className="p-6 bg-gradient-to-b from-blue-900/30 to-slate-900/30 border-cyan-500/30">
              <div className="text-center space-y-4">
                <Fish className="w-16 h-16 text-cyan-400 mx-auto" />
                <h1 className="text-2xl font-bold text-cyan-300">Angel-Abenteuer</h1>
                <p className="text-gray-300">Erkunde verschiedene Gewässer und fange legendäre Fische!</p>
                
                <div className="grid grid-cols-3 gap-3 my-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">{gameState.score}</div>
                    <div className="text-xs text-gray-400">Bester Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{gameState.achievements.length}</div>
                    <div className="text-xs text-gray-400">Achievements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{gameState.level}</div>
                    <div className="text-xs text-gray-400">Level</div>
                  </div>
                </div>
                
                <Button 
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Abenteuer starten
                </Button>
              </div>
            </Card>
            
            {/* Location Selection */}
            <Card className="p-4 bg-slate-800/30 border-cyan-500/20">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">Angelplatz wählen</h3>
              <div className="space-y-2">
                {locations.map(location => (
                  <Button
                    key={location.id}
                    variant={selectedLocation === location.id ? "default" : "outline"}
                    className={`w-full justify-start ${selectedLocation === location.id ? 'bg-cyan-600' : 'border-cyan-500/30'}`}
                    onClick={() => setSelectedLocation(location.id)}
                  >
                    <span className="text-xl mr-3">{location.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{location.name}</div>
                      <div className="text-xs opacity-75">{location.bonus}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {gameState.mode === 'playing' && (
          <div className="space-y-4">
            {/* Game Stats */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="p-2 text-center bg-slate-800/50 border-cyan-500/30">
                <div className="text-cyan-300 font-bold">{gameState.score}</div>
                <div className="text-xs text-gray-400">Punkte</div>
              </Card>
              <Card className="p-2 text-center bg-slate-800/50 border-cyan-500/30">
                <div className="text-green-400 font-bold">{gameState.energy}%</div>
                <div className="text-xs text-gray-400">Energie</div>
              </Card>
              <Card className="p-2 text-center bg-slate-800/50 border-cyan-500/30">
                <div className="text-orange-400 font-bold">{gameState.combo}</div>
                <div className="text-xs text-gray-400">Combo</div>
              </Card>
              <Card className="p-2 text-center bg-slate-800/50 border-cyan-500/30">
                <div className="text-yellow-400 font-bold">{gameState.coins}</div>
                <div className="text-xs text-gray-400">Münzen</div>
              </Card>
            </div>

            {/* Fishing Area */}
            <Card className="p-4 bg-gradient-to-b from-cyan-900/20 to-blue-900/40 border-cyan-500/30 min-h-[300px] relative overflow-hidden">
              {/* Water Animation */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(${waterAnimation}deg, transparent 0%, rgba(34, 197, 94, 0.1) 50%, transparent 100%)`
                }}
              />
              
              {/* Rod and Line */}
              <div 
                className="absolute top-2 transition-all duration-1000"
                style={{ left: `${gameState.rodPosition.x}%` }}
              >
                <div className="w-1 h-8 bg-yellow-700 rounded"></div>
              </div>
              
              {/* Fishing Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1={`${gameState.rodPosition.x}%`}
                  y1="10%"
                  x2={`${gameState.hookPosition.x}%`}
                  y2={`${gameState.hookPosition.y}%`}
                  stroke="#64748b"
                  strokeWidth="1"
                />
              </svg>
              
              {/* Hook */}
              <div 
                className="absolute w-3 h-3 bg-gray-400 rounded-full transition-all duration-300"
                style={{ 
                  left: `${gameState.hookPosition.x}%`, 
                  top: `${gameState.hookPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
              
              {/* Current Fish */}
              {gameState.currentFish && (
                <div 
                  className="absolute text-4xl transition-all duration-500 animate-pulse"
                  style={{ 
                    left: `${fishMovement.x}%`, 
                    top: `${fishMovement.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {gameState.currentFish.emoji}
                </div>
              )}
              
              {/* Depth Indicators */}
              <div className="absolute right-2 top-2 space-y-1">
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i + 1 === gameState.currentDepth ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </Card>

            {/* Controls */}
            <div className="space-y-3">
              {gameState.mode === 'playing' && (
                <Button 
                  onClick={startCasting}
                  disabled={gameState.energy < 20}
                  className="w-full h-16 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg font-bold"
                >
                  🎣 Auswerfen ({gameState.energy}% Energie)
                </Button>
              )}
              
              {gameState.mode === 'casting' && (
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-cyan-300">Kraft: {castPower}%</div>
                  <Progress value={castPower} className="w-full h-4" />
                  <Button 
                    onClick={() => {
                      setIsCharging(false);
                      performCast(castPower);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700"
                  >
                    Loslassen!
                  </Button>
                </div>
              )}
              
              {gameState.mode === 'waiting' && (
                <div className="text-center">
                  <div className="text-lg text-cyan-300 animate-pulse">Warte auf einen Biss...</div>
                  <div className="text-sm text-gray-400">Köder: {baits.find(b => b.id === gameState.selectedBait)?.name}</div>
                </div>
              )}
              
              {gameState.mode === 'fight' && gameState.currentFish && (
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-cyan-300">{gameState.currentFish.name}</div>
                    <div className="text-sm text-gray-400">Ziehe die Angel! {Math.floor(gameState.fightProgress)}%</div>
                  </div>
                  <Progress value={gameState.fightProgress} className="w-full h-4" />
                  <Button 
                    onClick={pullRod}
                    className="w-full h-16 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-lg font-bold"
                  >
                    💪 ZIEHEN!
                  </Button>
                </div>
              )}
            </div>

            {/* Bait Shop */}
            <Card className="p-4 bg-slate-800/30 border-cyan-500/20">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">Köder-Shop</h3>
              <div className="grid grid-cols-2 gap-2">
                {baits.map(bait => (
                  <Button
                    key={bait.id}
                    variant={gameState.selectedBait === bait.id ? "default" : "outline"}
                    className={`justify-start text-sm ${
                      gameState.selectedBait === bait.id ? 'bg-cyan-600' : 'border-cyan-500/30'
                    } ${gameState.coins < bait.cost && bait.cost > 0 ? 'opacity-50' : ''}`}
                    onClick={() => bait.cost === 0 ? setGameState(prev => ({ ...prev, selectedBait: bait.id })) : buyBait(bait.id)}
                    disabled={gameState.coins < bait.cost && bait.cost > 0}
                  >
                    <span className="mr-2">{bait.emoji}</span>
                    <div>
                      <div className="font-medium">{bait.name}</div>
                      <div className="text-xs">{bait.cost === 0 ? 'Kostenlos' : `${bait.cost} 🪙`}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}
        
        {/* Back to Menu */}
        {gameState.mode === 'playing' && (
          <Button 
            onClick={resetGame}
            variant="outline"
            className="w-full border-cyan-500/30 mt-4"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Zurück zum Menü
          </Button>
        )}
      </div>
    </>
  );
}