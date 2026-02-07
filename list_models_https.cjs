const https = require('https');
const fs = require('fs');
const path = require('path');

// ... (Load .env as before) ...
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split(/\r?\n/).forEach(line => {
            if (!line.trim() || line.startsWith('#')) return;
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["'](.*)["']$/, '$1');
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.error("Error loading .env", e);
}

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
    console.error("API Key not found");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error("Error:", data);
            return;
        }
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("Matching Models:");
                json.models.forEach(m => {
                    const methods = m.supportedGenerationMethods || [];
                    if (methods.includes("generateContent")) {
                        console.log(`- ${m.name}`);
                    }
                });
            }
        } catch (e) {
            console.error("Error parsing JSON", e);
        }
    });
}).on("error", (err) => {
    console.error("Request Error:", err.message);
});
