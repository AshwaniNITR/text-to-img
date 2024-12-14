"use client";

import React, { useState, useEffect } from "react";

export default function TexttoImage() {
  const [prompt, setPrompt] = useState(""); // User input text
  const [imageUrl, setImageUrl] = useState(""); // Image URL returned from the API
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState("");
  const [debouncedPrompt, setDebouncedPrompt] = useState(""); // Debounced prompt

  // Function to debounce the API call after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedPrompt(prompt); // Set debounced prompt after 3 seconds
    }, 1000); // 1 seconds delay

    // Cleanup function to cancel the timeout if user starts typing again
    return () => clearTimeout(timeoutId);
  }, [prompt]);

  // Function to call API and get image
  const callApi = async (prompt:any) => {
    setLoading(true);
    setError("");
    setImageUrl(""); // Reset image before generating a new one

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setImageUrl(data.imageUrl); // Assuming API returns `imageUrl` containing base64 string
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to generate the image when "Generate Image" button is clicked
  const handleGenerateImage = () => {
    if (debouncedPrompt) {
      callApi(debouncedPrompt); // Generate image for the final prompt
    }
  };

  // Trigger API call when the debounced prompt changes
  useEffect(() => {
    if (debouncedPrompt) {
      callApi(debouncedPrompt); // API call triggered after 3s of inactivity
    }
  }, [debouncedPrompt]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Generate an Image</h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Enter a prompt (e.g., A German Shepherd)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)} // Set prompt as user types
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleGenerateImage}
          disabled={loading || !prompt}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </div>
      <div className="mt-8">
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {imageUrl && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Generated Image:</h2>
            <img
              src={imageUrl}
              alt="Generated"
              className="max-w-full h-auto border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
