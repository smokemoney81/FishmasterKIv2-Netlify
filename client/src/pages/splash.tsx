import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Splash() {
  const [, setLocation] = useLocation();
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState("sunny"); // sunny, evening, rain

  // Zeit aktualisieren
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Beispiel Wetter Logik (später API einbauen)
  useEffect(() => {
    const hour = time.getHours();
    if (hour >= 18 && hour < 21) {
      setWeather("evening");
    } else if (hour >= 21 || hour < 6) {
      setWeather("night");
    } else {
      setWeather("sunny");
    }
  }, [time]);

  // Icon abhängig vom Wetter
  const renderWeatherIcon = () => {
    switch (weather) {
      case "sunny":
        return <span style={{ fontSize: "3rem" }}>🌞</span>;
      case "evening":
        return <span style={{ fontSize: "3rem" }}>🌇</span>;
      case "night":
        return <span style={{ fontSize: "3rem" }}>🌙</span>;
      case "rain":
        return <span style={{ fontSize: "3rem" }}>🌧️</span>;
      default:
        return <span style={{ fontSize: "3rem" }}>☁️</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex flex-col items-center justify-center space-y-6">
      {/* FishMasterKI Logo */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">FishMasterKI</h1>
        <p className="text-lg text-gray-600">Ihr intelligenter Angel-Assistent</p>
      </div>

      {/* Uhrzeit */}
      <h2 className="text-4xl font-bold text-gray-800">
        {time.toLocaleTimeString("de-DE")}
      </h2>

      {/* Wetter Symbol */}
      <div>{renderWeatherIcon()}</div>

      {/* Button für KI-Assistent */}
      <button
        className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition"
        onClick={() => setLocation("/home")}
      >
        🎤 KI-Assistent starten
      </button>

      {/* Zusätzliche Angel-Info */}
      <div className="text-center text-gray-700 max-w-md">
        <p className="text-sm">
          Entdecken Sie Angelplätze, identifizieren Sie Fische und erhalten Sie 
          personalisierte Tipps von Ihrem KI-Angel-Experten Sigi!
        </p>
      </div>
    </div>
  );
}