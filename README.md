# Modern AI-Powered Web IDE

A powerful, browser-based Integrated Development Environment (IDE) built with modern web technologies. This project features a robust code editor with predictive text, multi-language code execution, and an AI assistant panel—all accessible via secure Google Authentication.

## 🚀 Key Features

### 🔐 Secure Authentication
-   **Google Sign-In**: integrated secure login using Firebase Authentication.
-   **User Profile**: Display of user avatar (email initial) and easy logout functionality in the sidebar.

### 💻 Advanced Editor
-   **Powered by Monaco Editor**: The same editor engine as VS Code.
-   **Predictive Code & Autocomplete**: Intelligent snippets and keyword completion for various languages.
-   **Realtime HTML Preview**: Instant split-view preview for HTML files with support for inline CSS and JS.
-   **Syntax Highlighting**: Support for JavaScript, TypeScript, Python, Java, C++, C, C#, Rust, Go, PHP, Ruby, and more.

### 🤖 AI Integration
-   **Smart AI Assistant**: Enhanced chat interface with **Markdown support** (code blocks, lists, bold text) and Google-like fonts (Inter, JetBrains Mono).
-   **Powered by Gemini**: Uses the latest Google Gemini models for accurate coding help.
-   **1-Click Code Fix**: "Fix Errors" button that automatically analyzes and corrects bugs.

### ⚡ Seamless Workflow
-   **Flat File System**: Simplified file explorer with root-level file management.
-   **Local-Only Storage**: Your files are automatically saved to your browser's **Local Storage**.
-   **Multi-Language Runner**: Execute code directly in the browser using the Piston API.
-   **Integrated Terminal**: View real-time output and errors.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://react.dev/) (v19) + [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4) + `clsx`
-   **Auth**: [Firebase Authentication](https://firebase.google.com/docs/auth)
-   **Editor**: [`@monaco-editor/react`](https://github.com/suren-atoyan/monaco-react)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **AI**: Google Gemini API integration

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
    Create a `.env` file in the root directory and add your API keys:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key__here
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    ```
    *Note: You need a Firebase project with Google Authentication enabled.*

4.  **Start the development server**
    ```bash
    npm run dev
    ```

5.  **Build for production**
    ```bash
    npm run build
    ```

## 🎮 Usage Guide

1.  **Login**: Sign in using your Google account.
2.  **File Explorer**: Use the sidebar to create (`+`) files.
    -   *Tip*: Use `.c`, `.cpp`, `.py`, or `.java` extensions to enable predictive text.
3.  **Coding**: Type code in the editor.
    -   *Try*: Type `inc` in C for `#include`, or `psvm` in Java for `main`.
4.  **Run Code**: Click the **Run** button (top right) to execute.
5.  **Fix Errors**: Click the **Wand Icon** to have AI instantly debug your code.
6.  **Logout**: Click the logout icon in the sidebar to sign out.

