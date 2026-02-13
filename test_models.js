import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("API Key not found in .env");
    // Try to read .env manually if dotenv fails or path is issue?
    // No, process.env usually works if executed from root.
} else {
    console.log("API Key found (length):", apiKey.length);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function checkModels() {
    const modelsToCheck = [
        "gemini-flash-latest",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
    ];

    for (const modelName of modelsToCheck) {
        console.log(`Checking model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            const response = await result.response;
            console.log(`SUCCESS: ${modelName} responded: ${response.text().substring(0, 50)}...`);
            // If success, we can break or just list all working ones
        } catch (error) {
            console.error(`FAILED: ${modelName} - ${error.message}`);
        }
    }
}

checkModels();
