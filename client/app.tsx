import KiBuddy from "./components/KiBuddy";

function App() {
  return (
    <div>
      <h1>🎣 FishMasterKi</h1>
      <KiBuddy />
    </div>
  );
}

export default App;
import React from "react";
import KiBuddy from "./components/KiBuddy";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🎣 FishMasterKi
      </h1>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Dein KI-Buddy */}
        <KiBuddy />

        {/* Beispiel: weitere Features der App */}
        <div className="p-4 bg-white rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">📊 Dashboard (Platzhalter)</h2>
          <p className="text-gray-600">
            Hier könnten später deine Fänge, Ausrüstung oder Wetterdaten angezeigt werden.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
