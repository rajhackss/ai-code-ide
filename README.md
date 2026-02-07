# Modern Web IDE

A powerful, browser-based Integrated Development Environment (IDE) built with modern web technologies. This project features a robust code editor, multi-language code execution, and an AI assistant panel.

## 🚀 Features

-   **Advanced Code Editor**: Powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/) (VS Code's editor), supporting syntax highlighting, sensing, and more.
-   **Multi-Language Execution**: Execute code directly in the browser using the [Piston API](https://github.com/engineer-man/piston). Supported languages include:
    -   JavaScript, TypeScript
    -   Python
    -   Java, C++, C, C#
    -   Rust, Go
    -   PHP, Ruby
-   **File Management**: Create, edit, and organize files within the IDE (Virtual File System).
-   **AI Assistance**: Integrated AI Panel for coding help and suggestions.
-   **Responsive Design**: A modern, clean interface built with Tailwind CSS.
-   **Integrated Terminal**: View execution output and errors in a built-in terminal window.

## 🛠️ Tech Stack

This project is built using the following technologies and libraries:

-   **Frontend Framework**: [React](https://react.dev/) (v19)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**:
    -   [Tailwind CSS](https://tailwindcss.com/) (v4)
    -   `clsx` & `tailwind-merge` for dynamic class management
    -   [PostCSS](https://postcss.org/) & [Autoprefixer](https://github.com/postcss/autoprefixer)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Editor Component**: [`@monaco-editor/react`](https://github.com/suren-atoyan/monaco-react)
-   **Linting**: [ESLint](https://eslint.org/)

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

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🎮 Usage

1.  **Edit Code**: Select a file from the sidebar or create a new one. Write code in the main editor window.
2.  **Run Code**: Click the "Run" button to execute your code via the Piston API.
3.  **View Output**: Results will appear in the specific terminal/output panel.
4.  **AI Help**: Open the AI panel to get assistance with your code.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT](LICENSE)
