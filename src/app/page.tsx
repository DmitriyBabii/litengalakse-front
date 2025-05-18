"use client";

import { useState } from "react";

interface Hotel {
  name: string;
  rating: number;
  distance: {
    value: number;
    unit: string;
  };
}

interface Route {
  description: string;
  data: Hotel[];
  amenities: string[];
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);

    const response = await fetch("/api/v1/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">Подорожі з AI</h1>
        <p className="text-sm mt-1 opacity-80">
          Нехай штучний інтелект спланує ваші пригоди
        </p>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Опишіть свою ідеальну подорож
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Наприклад: Хочу на море з дітьми, бюджет до 500€"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              🔍 Знайти варіанти
            </button>
          </form>
        </div>

        {loading && (
          <div className="mt-8 text-center text-blue-600 font-medium animate-pulse">
            ⏳ Пошук найкращих варіантів...
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-10 space-y-6">
            {results.map((place, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {place.description}
                </h3>
                <ul className="space-y-3">
                  {place.data.map((hotel: Hotel, idx: number) => (
                    <li
                      key={idx}
                      className="bg-gray-50 p-3 rounded-md border border-gray-200"
                    >
                      <div className="text-base font-semibold text-gray-800">
                        {hotel.name}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                        <span>⭐ {hotel.rating}</span>
                        <span>
                          {hotel.distance.value}
                          {hotel.distance.unit} від центру
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  <span className="font-medium">Зручності:</span>{" "}
                  {place.amenities.join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600 border-t">
        &copy; {new Date().getFullYear()} Подорожі з AI — створено з ❤️
      </footer>
    </div>
  );
}
