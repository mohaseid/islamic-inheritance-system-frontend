const BASE_URL = "https://moha-inheritance-api.onrender.com/api";

export const calculateShares = async (inputData) => {
  try {
    const response = await fetch(`${BASE_URL}/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to calculate shares.");
    }

    return await response.json();
  } catch (error) {
    console.error("API Call Error:", error);
    throw error;
  }
};
