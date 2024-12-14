import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // Send the prompt to the Flask API
    const flaskApiUrl = "http://localhost:5000/generate"; // Replace with your Flask API URL
    const response = await axios.post(flaskApiUrl, { prompt }, { responseType: 'arraybuffer' });

    // Convert the binary response to a Blob and then to a data URL
    const imageBuffer = Buffer.from(response.data, 'binary');
    const imageUrl = `data:image/png;base64,${imageBuffer.toString('base64')}`;

    // Return the base64-encoded image URL to the frontend
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
