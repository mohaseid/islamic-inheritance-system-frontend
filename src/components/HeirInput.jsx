import React, { useState } from "react";
import { HEIR_OPTIONS } from "../data/heirOptions";
import { calculateShares } from "../api/calculatorApi";

const INITIAL_STATE = {
  deceased: "male",
  assets: 0,
  liabilities: 0,
  heirs: [],
};

const HeirInput = ({ onSubmit, loading }) => {
  const [inputData, setInputData] = useState(INITIAL_STATE);
  const [selectedHeirName, setSelectedHeirName] = useState("");
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputData((prev) => ({
      ...prev,
      [name]:
        name === "assets" || name === "liabilities"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleAddHeir = () => {
    if (!selectedHeirName) return;

    const exists = inputData.heirs.some((h) => h.name === selectedHeirName);
    if (exists) {
      alert(`${selectedHeirName} is already added.`);
      return;
    }

    setInputData((prev) => ({
      ...prev,
      heirs: [...prev.heirs, { name: selectedHeirName, count: 1 }],
    }));
    setSelectedHeirName("");
  };

  const handleHeirCountChange = (name, count) => {
    setInputData((prev) => ({
      ...prev,
      heirs: prev.heirs
        .map((h) =>
          h.name === name ? { ...h, count: parseInt(count) || 0 } : h
        )
        .filter((h) => h.count > 0),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (inputData.assets <= inputData.liabilities) {
      setError("Assets must be greater than liabilities.");
      return;
    }
    if (inputData.heirs.length === 0) {
      setError("Please add at least one surviving heir.");
      return;
    }

    onSubmit(inputData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 mb-8"
    >
      <h2 className="text-2xl font-semibold text-green-700 mb-4 border-b pb-2">
        Estate & Deceased Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Deceased Gender
          </label>
          <select
            name="deceased"
            value={inputData.deceased}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Assets ($)
          </label>
          <input
            type="number"
            name="assets"
            value={inputData.assets}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Liabilities ($)
          </label>
          <input
            type="number"
            name="liabilities"
            value={inputData.liabilities}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            required
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-green-700 mb-4 border-b pb-2">
        Surviving Heirs
      </h2>

      <div className="flex space-x-2 mb-4">
        <select
          value={selectedHeirName}
          onChange={(e) => setSelectedHeirName(e.target.value)}
          className="flex-grow rounded-md border-gray-300 shadow-sm p-2"
        >
          <option value="">-- Select an Heir --</option>
          {HEIR_OPTIONS.map((heir) => (
            <option key={heir} value={heir}>
              {heir}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddHeir}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-150"
          disabled={!selectedHeirName}
        >
          Add Heir
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {inputData.heirs.length === 0 ? (
          <p className="text-gray-500 italic">
            No heirs added yet. Use the selector above.
          </p>
        ) : (
          inputData.heirs.map((heir) => (
            <div
              key={heir.name}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
            >
              <span className="font-medium">{heir.name}</span>
              <input
                type="number"
                min="1"
                value={heir.count}
                onChange={(e) =>
                  handleHeirCountChange(heir.name, e.target.value)
                }
                className="w-16 text-center border rounded-md p-1"
              />
            </div>
          ))
        )}
      </div>

      {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

      <button
        type="submit"
        className="w-full py-3 bg-green-600 text-white text-lg font-bold rounded-md hover:bg-green-700 transition duration-150 disabled:bg-gray-400 flex items-center justify-center"
        disabled={loading || inputData.heirs.length === 0}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Calculating...
          </>
        ) : (
          "Calculate Inheritance Shares"
        )}
      </button>
    </form>
  );
};

export default HeirInput;
