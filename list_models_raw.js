import dotenv from "dotenv";

// Load .env
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("API Key not found in .env");
} else {
    console.log("API Key found (length):", apiKey.length);
}

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response body:", text);
            return;
        }
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.supportedGenerationMethods})`);
            });
        } else {
            console.log("No models found in response:", data);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

listModels();
