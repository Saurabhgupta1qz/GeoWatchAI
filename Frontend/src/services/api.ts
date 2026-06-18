const API_URL = "http://127.0.0.1:8000";

export const analyzeLocation = async (
  latitude: number,
  longitude: number
) => {
  const response = await fetch(`${API_URL}/analyze-location`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      latitude,
      longitude,
    }),
  });

  return response.json();
};