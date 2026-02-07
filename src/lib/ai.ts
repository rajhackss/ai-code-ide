import { GoogleGenerativeAI } from "@google/generative-ai";

interface AIResponse {
    content: string;
    error?: string;
}

export async function generateAIResponse(
    prompt: string,
    contextFiles: { name: string; content: string; language: string }[] = []
): Promise<AIResponse> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        return { content: '', error: 'API Key is missing. Please check your .env file.' };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest", systemInstruction: "You are an expert AI coding assistant. Provide helpful, concise, and correct code explanations and solutions." });

    // Note: We move the system prompt to getGenerativeModel systemInstruction option if possible, 
    // or just pass it as system prompt in content. 
    // Wait, the SDK supports `systemInstruction`. But if not sure, stick to content.
    // The previous code constructed systemPrompt manually. I'll stick to that but update model name.


    // Construct system prompt with file context
    let promptContext = "";

    if (contextFiles.length > 0) {
        promptContext += "\n\nHere is the active file context:\n";
        contextFiles.forEach(file => {
            promptContext += `\n--- FILE: ${file.name} (${file.language}) ---\n${file.content}\n--- END FILE ---\n`;
        });
    }

    try {
        const result = await model.generateContent([
            promptContext ? promptContext + "\n\n" + prompt : prompt
        ]);
        const response = await result.response;
        const text = response.text();

        return { content: text };

    } catch (error: any) {
        return { content: '', error: `AI Error: ${error.message || 'Unknown error'}` };
    }
}
