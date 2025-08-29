import React, { useState } from "react";

export default function KiBuddy() {
  const [chat, setChat] = useState<{ from: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // User Nachricht ins Chatfenster setzen
    const newChat = [...chat, { from: "user", text: input }];
    setChat(newChat);
    setInput("");

    try {
      const res = await fetch("/api/kibuddy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setChat([...newChat, { from: "buddy", text: data.reply }]);
    } catch (err) {
      setChat([...newChat, { from: "buddy", text: "⚠️ Fehler beim Abrufen der Antwort" }]);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-2">🤖 Dein KI-Buddy</h2>
      <div className="h-64 overflow-y-auto border p-2 rounded mb-2 bg-gray-50">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`mb-1 ${
              msg.from === "user" ? "text-right text-blue-600" : "text-left text-green-600"
            }`}
          >
            <b>{msg.from === "user" ? "Du" : "Buddy"}:</b> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nachricht eingeben..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Senden
        </button>
      </div>
    </div>
  );
}