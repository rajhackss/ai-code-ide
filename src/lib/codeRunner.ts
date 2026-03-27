interface ExecutionResult {
    output: string;
    error?: string;
    language: string;
}

// Language to Wandbox compiler mapping
const languageMap: Record<string, string> = {
    javascript: 'nodejs-20.17.0',
    typescript: 'typescript-5.6.2',
    python: 'cpython-head',
    java: 'openjdk-jdk-22+36',
    cpp: 'gcc-head',
    c: 'gcc-head-c',
    rust: 'rust-1.82.0',
    go: 'go-1.23.2',
    php: 'php-8.3.12',
    ruby: 'ruby-3.4.1',
    csharp: 'mono-6.12.0.199',
};

export async function runCode(code: string, language: string): Promise<ExecutionResult> {
    const compiler = languageMap[language];

    if (!compiler) {
        return {
            output: '',
            error: `Language "${language}" is not supported for execution.`,
            language
        };
    }

    try {
        const body: any = {
            compiler: compiler,
            save: false
        };

        // For Java to support "public class Main" we supply the file as Main.java
        if (language === 'java') {
            body.codes = [{ file: "Main.java", code: code }];
        } else {
            body.code = code;
        }

        const response = await fetch('https://wandbox.org/api/compile.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const text = await response.text();
            return {
                output: '',
                error: `HTTP ${response.status} ${response.statusText}\nBody: ${text}\nCompiler: ${compiler}`,
                language
            };
        }

        const data = await response.json();

        const stdout = data.program_output || data.compiler_output || '';
        const stderr = data.program_error || data.compiler_error || '';
        const hasError = data.status !== '0';

        return {
            output: stdout + (stderr && stdout ? `\n[stderr]\n${stderr}` : stderr ? stderr : ''),
            error: hasError ? (stderr || 'Execution failed with status ' + data.status) : undefined,
            language
        };

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
