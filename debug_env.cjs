const fs = require('fs');
const path = require('path');

console.log("CWD:", process.cwd());
const envPath = path.resolve(process.cwd(), '.env');
console.log("Env Path:", envPath);

if (fs.existsSync(envPath)) {
    console.log(".env file exists");
    const content = fs.readFileSync(envPath, 'utf8');
    console.log("Content length:", content.length);
    console.log("First 100 chars:", content.substring(0, 100));

    // Manual parse
    const lines = content.split('\n');
    lines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            console.log(`Found key: ${key}`);
            if (key === 'VITE_GEMINI_API_KEY') {
                console.log(`VALUE FOUND: ${value}`);
            }
        }
    });

} else {
    console.error(".env file DOES NOT EXIST");
}
