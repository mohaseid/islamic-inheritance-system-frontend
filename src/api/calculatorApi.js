const BASE_URL =
  "https://islamic-inheritance-system-backend-1.onrender.com/api"; // Update to the correct backend URL

export const calculateShares = async (inputData) => {
  try {
    // 🚨 This is the critical line. It must match the backend route exactly.
    const API_ENDPOINT = `${BASE_URL}/calculate-shares`;

    console.log("Sending request to:", API_ENDPOINT);

    // Exponential backoff logic for robust fetching (good practice for external APIs)
    const maxRetries = 3;
    let response;

    for (let i = 0; i < maxRetries; i++) {
      try {
        response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputData),
        });
        if (response.ok || response.status < 500) break; // Break on success or client error (4xx)
      } catch (fetchError) {
        if (i === maxRetries - 1) throw fetchError;
        const delay = Math.pow(2, i) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (!response) {
      throw new Error(
        "Failed to connect to the server after multiple retries."
      );
    }

    if (!response.ok) {
      let errorMessage = `Server responded with status ${response.status}. Failed to calculate shares.`;

      // Attempt to parse the error response as JSON first
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If JSON parsing fails (e.g., received HTML or plain text)
        const textError = await response.text();
        if (textError.startsWith("<")) {
          // The HTML error we are trying to fix
          errorMessage = `API ROUTE MISMATCH. Server returned an HTML page (404/wrong path). Ensure the URL is correct: ${API_ENDPOINT}`;
        } else {
          // A non-JSON server error
          errorMessage = `Server Error (${
            response.status
          }): ${textError.substring(0, 100)}`;
        }
      }

      throw new Error(errorMessage);
    }

    // Return the successful JSON response
    return await response.json();
  } catch (error) {
    console.error("API Call Error:", error);
    // Propagate the error up to the component for display
    throw error;
  }
};
