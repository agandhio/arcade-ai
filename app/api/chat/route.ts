import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, gameContext } = await req.json();

    // Use environment variable as per user request for a secure backend.
    const apiKey = process.env.LLM_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'your_key_here') {
      return NextResponse.json(
        { error: 'API key not configured in secrets. Please set LLM_API_KEY or GEMINI_API_KEY.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are a helpful, retro-themed AI arcade assistant. 
You are currently helping a player with the game: ${gameContext.gameName}.
Keep your responses concise, retro-flavored, and informative about game logic, code, or mechanics.
Use 8-bit styling in your speech (e.g., greet with 'BZZT', 'Greetings Player 1', etc).
Here is the current context of the game logic the user is playing:
${gameContext.gameLogicSnippet}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with AI server.' },
      { status: 500 }
    );
  }
}
