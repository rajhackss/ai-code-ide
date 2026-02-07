interface ExecutionResult {
    output: string;
    error?: string;
    language: string;
}

// Language to Piston runtime mapping
const languageMap: Record<string, { language: string; version: string }> = {
    javascript: { language: 'javascript', version: '18.15.0' },
    typescript: { language: 'typescript', version: '5.0.3' },
    python: { language: 'python', version: '3.10.0' },
    java: { language: 'java', version: '15.0.2' },
    cpp: { language: 'cpp', version: '10.2.0' },
    c: { language: 'c', version: '10.2.0' },
    rust: { language: 'rust', version: '1.68.2' },
    go: { language: 'go', version: '1.16.2' },
    php: { language: 'php', version: '8.2.3' },
    ruby: { language: 'ruby', version: '3.0.1' },
    csharp: { language: 'csharp', version: '6.12.0' },
};

export async function runCode(code: string, language: string): Promise<ExecutionResult> {
    const runtime = languageMap[language];

    if (!runtime) {
        return {
            output: '',
            error: `Language "${language}" is not supported for execution.`,
            language
        };
    }

    try {
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: runtime.language,
                version: runtime.version,
                files: [{ content: code }],
            }),
        });

        if (!response.ok) {
            return {
                output: '',
                error: `Execution failed: ${response.statusText}`,
                language
            };
        }

        const data = await response.json();

        if (data.run) {
            const stdout = data.run.stdout || '';
            const stderr = data.run.stderr || '';
            return {
                output: stdout + (stderr ? `\n[stderr]\n${stderr}` : ''),
                error: data.run.code !== 0 ? stderr : undefined,
                language
            };
        }

        return { output: '', error: 'Unknown response format', language };

    } catch (error) {
        return {
            output: '',
            error: `Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            language
        };
    }
}

export function getSupportedLanguages(): string[] {
    return Object.keys(languageMap);
}
