import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setStatus("❌ Le message est vide !");
      return;
    }

    try {
      // Envoi du message au serveur Express (/submit)
      const res = await axios.post("/submit", { message });

      if (res.data.success) {
        setStatus("✅ Message envoyé au bot Discord !");
        setMessage("");
      } else {
        setStatus("⚠️ Erreur lors de l’envoi.");
      }
    } catch (err) {
      console.error("Erreur axios :", err);
      setStatus("⚠️ Impossible d’envoyer le message (erreur serveur).");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        💬 Envoyer un message au bot Discord
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-80 bg-white shadow-md rounded-2xl p-6"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tape ton message ici..."
          className="border border-gray-300 rounded-lg p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Envoyer 🚀
        </button>
      </form>

      {status && (
        <p className="mt-4 text-gray-700 font-medium transition">{status}</p>
      )}
    </div>
  );
}

export default App;

export default App;
