import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function SplashPage() {
  const [, setLocation] = useLocation();
  const [fishPositions, setFishPositions] = useState([
    { x: 10, y: 70, delay: 0 },
    { x: 60, y: 80, delay: 0.5 },
    { x: 30, y: 90, delay: 1 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFishPositions(prev => prev.map(fish => ({
        ...fish,
        x: fish.x >= 110 ? -10 : fish.x + 0.5,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-cyan-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Water ripple effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
          <div className="absolute w-80 h-80 bg-blue-500 rounded-full blur-3xl bottom-20 right-20 animate-pulse delay-700"></div>
        </div>
        
        {/* Small stars/bubbles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        <p className="text-cyan-400 text-sm tracking-[0.3em] mb-8 animate-fade-in">
          ARTIFICIAL INTELLIGENCE
        </p>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-16 animate-fade-in-up">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
            FishMasterKI
          </span>
        </h1>
        
        <Button
          onClick={() => setLocation("/home")}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-6 text-lg rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-500"
        >
          JETZT ANGELN STARTEN
        </Button>
      </div>

      {/* Animated Fish */}
      {fishPositions.map((fish, index) => (
        <div
          key={index}
          className="absolute transition-all duration-100"
          style={{
            left: `${fish.x}%`,
            top: `${fish.y}%`,
            animationDelay: `${fish.delay}s`,
          }}
        >
          <svg
            width="60"
            height="30"
            viewBox="0 0 60 30"
            className="fill-cyan-400 opacity-60"
          >
            <path d="M10 15 Q20 5 35 15 Q20 25 10 15 M35 15 L50 10 L50 20 Z" />
          </svg>
        </div>
      ))}


    </div>
  );
}