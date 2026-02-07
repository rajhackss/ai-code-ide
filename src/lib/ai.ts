interface AIResponse {
    content: string;
    error?: string;
}

export async function generateAIResponse(
    prompt: string,
    contextFiles: { name: string; content: string; language: string }[] = []
): Promise<AIResponse> {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
        return { content: '', error: 'API Key is missing. Please check your .env file.' };
    }

    // Construct system prompt with file context
    let systemPrompt = "You are an expert AI coding assistant. Provide helpful, concise, and correct code explanations and solutions.";

    if (contextFiles.length > 0) {
        systemPrompt += "\n\nHere is the active file context:\n";
        contextFiles.forEach(file => {
            systemPrompt += `\n--- FILE: ${file.name} (${file.language}) ---\n${file.content}\n--- END FILE ---\n`;
        });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173", // Required by OpenRouter
                "X-Title": "Web AI IDE"
            },
            body: JSON.stringify({
                "model": "openrouter/auto",
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    { "role": "user", "content": prompt }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { content: '', error: `API Error: ${errorData.error?.message || response.statusText}` };
        }

        const data = await response.json();
        return { content: data.choices[0].message.content };

    } catch (error) {
        return { content: '', error: `Network Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}
