# Lumina AI Image Studio 🎨

Lumina is a professional-grade AI image editing and generation platform powered by the Google Gemini API. It allows users to perform complex image manipulations through natural language and high-fidelity generation in up to 4K resolution.

## ✨ Features

- **Dual-Engine Support**: Switch between **Gemini 2.5 Flash** for speed and **Gemini 3 Pro** for high-quality (1K/2K/4K) synthesis.
- **Smart Masking**: Use the brush tool to highlight specific areas of an uploaded image for targeted AI editing (In-painting).
- **Style Presets**: Instantly apply aesthetics like Cyberpunk, Noir, Vintage, or Cartoon.
- **Reference Images**: Upload a reference image to guide the style or subject of your generations.
- **Project History**: A visual sidebar to manage and revisit your previous creations.
- **Responsive Canvas**: Smooth zooming and panning for detailed editing.

## 🚀 Getting Started

### Prerequisites

- A Google Gemini API Key (obtainable from [Google AI Studio](https://aistudio.google.com/)).

### How to Run (Quick Start)

Since this project uses ESM modules and modern web standards, you can run it using any static file server.

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd lumina
   ```

2. **Run with a local server**:
   If you have Node.js installed, you can use `npx` to serve the files instantly:
   ```bash
   npx serve .
   ```
   _Note: This requires a browser that supports `.tsx` files directly if your server doesn't transpile them. For a production-ready dev experience, see the "How to Dev" section below._

### How to Dev

For the best development experience with Hot Module Replacement (HMR) and TypeScript support:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server (Vite recommended)**:

   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🛠️ Configuration

### API Key

You can use the application in two ways:

1. **Runtime Input**: Enter your API key directly into the "Authentication" field in the left sidebar.
2. **Environment Variable**: Set an `API_KEY` environment variable in your deployment environment.

## 🚢 Deployment

This project is configured for **GitHub Pages**.

### GitHub Actions

A workflow is included in `.github/workflows/deploy.yml` that automatically builds and deploys the app to the `/lumina` path when you push to the `main` branch.

**To deploy successfully**:

1. Ensure your repository name is `lumina`.
2. Go to your GitHub Repository **Settings > Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.

## 📝 License

MIT License - Created with ❤️ for the AI Creative Community.
