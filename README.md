# Lumina AI Image Studio 🎨

Lumina is a professional-grade AI image editing and generation platform powered by the Google Gemini API. It allows users to perform complex image manipulations through natural language and high-fidelity generation in up to 4K resolution.

## ✨ Features

- **Dual-Engine Support**: Switch between **Gemini 2.5 Flash** for speed and **Gemini 3 Pro** for high-quality (1K/2K/4K) synthesis.
- **Smart Masking**: Use the brush tool to highlight specific areas of an uploaded image for targeted AI editing (In-painting).
- **Style Presets**: Instantly apply aesthetics like Cyberpunk, Noir, Vintage, or Cartoon.
- **Reference Images**: Upload a reference image to guide the style or subject of your generations.
- **Project History**: A visual sidebar to manage and revisit your previous creations.
- **Responsive Canvas**: Smooth zooming and panning for detailed editing.
- **Secure Backend Proxy**: Optional Convex backend for secure API key management.

## 🚀 Getting Started

### Prerequisites

- A Google Gemini API Key (obtainable from [Google AI Studio](https://aistudio.google.com/)).
- Node.js 18+ and pnpm (or npm)

### Quick Start

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd lumina
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Start the development server**:

   ```bash
   pnpm run dev
   ```

4. **Open the app** at `http://localhost:3000` and enter your Gemini API key in the sidebar.

## 🔐 Authentication Options

You have two ways to authenticate with the Gemini API:

### Option 1: Direct API Key (Simple)

Enter your Gemini API key directly in the "Gemini API Key" field in the sidebar.

### Option 2: Server Password with Convex (Secure)

Use a password to access a shared API key stored securely on the server.

#### Setting Up Convex Backend

1. **Initialize Convex**:

   ```bash
   pnpm convex dev
   ```

   ```bash
   pnpm convex deploy
   ```

   Follow the prompts to create a new project.

2. **Configure environment variables** in the [Convex Dashboard](https://dashboard.convex.dev):
   - Go to your project → **Settings** → **Environment Variables**
   - Add these secrets:
     | Name | Description |
     |------|-------------|
     | `GEMINI_API_KEY` | Your Gemini API key |
     | `APP_PASSWORD` | Password users will enter |
     | `GEMINI_BASE_URL` | (Optional) Custom API endpoint |

3. **Deploy to production**:

   ```bash
   pnpm convex deploy
   ```

4. **Configure frontend env**:

   ```bash
   cp .env.example .env
   ```

   Add your Convex URL to `.env`:

   ```
   VITE_CONVEX_URL=https://YOUR_DEPLOYMENT.convex.site
   ```

5. **Start the app** and use the "Server Password" field to authenticate.

## 🛠️ Environment Variables

| Variable          | Description                                    |
| ----------------- | ---------------------------------------------- |
| `GEMINI_API_KEY`  | (Optional) Default API key for direct calls    |
| `VITE_CONVEX_URL` | Convex deployment URL for proxy authentication |

## 🚢 Deployment

### GitHub Pages

This project is configured for **GitHub Pages** deployment.

A workflow is included in `.github/workflows/deploy.yml` that automatically builds and deploys the app when you push to the `main` branch.

**To deploy**:

1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**

### Convex Backend

Deploy your Convex backend separately:

```bash
pnpm convex deploy
```

## 📁 Project Structure

```
├── App.tsx                 # Main application component
├── components/             # React UI components
├── services/
│   └── geminiService.ts    # Gemini API integration
├── convex/                 # Convex backend (HTTP actions)
│   ├── http.ts             # HTTP route definitions
│   └── gemini.ts           # Gemini proxy actions
├── types.ts                # TypeScript type definitions
└── vite.config.ts          # Vite configuration
```

## 📝 License

MIT License - Created with ❤️ for the AI Creative Community.
