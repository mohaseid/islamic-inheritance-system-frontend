import React, { useState } from "react";
import HeirInput from "./components/HeirInput";
import ResultDisplay from "./components/ResultDisplay";
import "./index.css";

const API_URL =
  "https://moha-inheritance-api.onrender.com/api/v1/calculate-shares.";

const calculateShares = async (inputData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to calculate shares. Please check input."
    );
  }

  return response.json();
};

const App = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculation = async (inputData) => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await calculateShares(inputData);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">
          Islamic Inheritance System
        </h1>
        <p className="text-xl text-gray-600">Mirath Navigator</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <HeirInput onSubmit={handleCalculation} loading={loading} />

        {loading && (
          <p className="text-center text-blue-500 mt-4">
            Calculating Fiqh Shares...
          </p>
        )}
        {error && (
          <p className="text-center text-red-600 mt-4">Error: {error}</p>
        )}

        {results && <ResultDisplay results={results} />}
      </main>
    </div>
  );
};

export default App;
