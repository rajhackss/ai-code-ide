# Modern AI-Powered Web IDE

A powerful, browser-based Integrated Development Environment (IDE) built with modern web technologies. This project features a robust code editor with predictive text, multi-language code execution, and an AI assistant panel—all running in a lightweight, local-only architecture.

## 🚀 Key Features

### 💻 Advanced Editor
-   **Powered by Monaco Editor**: The same editor engine as VS Code.
-   **Predictive Code & Autocomplete**: Intelligent snippets and keyword completion for:
    -   **C / C++**: `#include`, `main`, `printf`, loops, and standard keywords.
    -   **Python**: `def`, `class`, `if/else`, `print`.
    -   **Java**: `psvm`, `sout`, class structures.
-   **Syntax Highlighting**: Support for JavaScript, TypeScript, Python, Java, C++, C, C#, Rust, Go, PHP, Ruby, and more.

### 🤖 AI Integration
-   **AI Assistant**: Built-in chat panel for coding help and explanations.
-   **1-Click Code Fix**: "Fix Errors" button that automatically analyzes and corrects bugs in your code using Generative AI.

### 🔒 Local-Only Storage
-   **Privacy First**: No cloud database required.
-   **Offline Capable**: Your files are automatically saved to your browser's **Local Storage**.
-   **Persistent Workspace**: Your work remains safe even if you close or reload the browser.

### ⚡ Execution & Tools
-   **Multi-Language Runner**: Execute code directly in the browser using the Piston API.
-   **Integrated Terminal**: View real-time output and errors.
-   **File Management**: Create, edit, delete, and organize files in a virtual file system.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://react.dev/) (v19) + [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4) + `clsx`
-   **Editor**: [`@monaco-editor/react`](https://github.com/suren-atoyan/monaco-react)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **AI**: OpenRouter API integration

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd ide
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your OpenRouter API key:
    ```env
    VITE_OPENROUTER_API_KEY=your_api_key_here
    ```

4.  **Start the development server**
    ```bash
    npm run dev
    ```

5.  **Build for production**
    ```bash
    npm run build
    ```

## 🎮 Usage Guide

1.  **File Explorer**: Use the sidebar to create (`+`) files.
    -   *Tip*: Use `.c`, `.cpp`, `.py`, or `.java` extensions to enable predictive text.
2.  **Coding**: Type code in the editor.
    -   *Try*: Type `inc` in C for `#include`, or `psvm` in Java for `main`.
3.  **Run Code**: Click the **Run** button (top right) to execute.
4.  **Fix Errors**: Click the **Wand Icon** to have AI instantly debug your code.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT](LICENSE)
