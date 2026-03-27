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

    // Priority list of models to try
    const modelsToTry = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-flash-latest"];

    // Construct system prompt with file context
    let promptContext = "";

    // Limit context to prevent token overflow (approx. 20k chars safety limit for very long files)
    const MAX_CONTEXT_CHARS = 20000;

    if (contextFiles.length > 0) {
        promptContext += "\n\nHere is the active file context:\n";
        contextFiles.forEach(file => {
            const content = file.content.length > MAX_CONTEXT_CHARS
                ? file.content.substring(0, MAX_CONTEXT_CHARS) + "\n...[Content Truncated]..."
                : file.content;
            promptContext += `\n--- FILE: ${file.name} (${file.language}) ---\n${content}\n--- END FILE ---\n`;
        });
    }

    const finalPrompt = promptContext ? promptContext + "\n\n" + prompt : prompt;
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: "You are an expert AI coding assistant. Provide helpful, concise, and correct code explanations and solutions."
            });

            const result = await model.generateContent([finalPrompt]);
            const response = await result.response;
            const text = response.text();

            return { content: text };

        } catch (error: any) {
            console.warn(`Failed with model ${modelName}:`, error.message);
            lastError = error;
            // Continue to next model
        }
    }

    return { content: '', error: `AI Error: All models failed. Last error: ${lastError?.message || 'Unknown error'}` };
}
