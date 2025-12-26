"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";

// Helper to create GoogleGenAI client
function createClient(apiKey: string, baseUrl?: string): GoogleGenAI {
  return new GoogleGenAI({
    apiKey,
    httpOptions: baseUrl ? { baseUrl } : undefined,
  });
}

// Helper to extract base64 data from data URL
function parseDataUrl(dataUrl: string): { data: string; mimeType: string } {
  const base64Data = dataUrl.split(",")[1];
  const mimeType = dataUrl.split(";")[0].split(":")[1] || "image/jpeg";
  return { data: base64Data, mimeType };
}

// Generate Image Action (runs in Node.js)
export const generateImage = action({
  args: {
    password: v.string(),
    prompt: v.string(),
    model: v.string(),
    aspectRatio: v.string(),
    imageSize: v.optional(v.string()),
    referenceImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { password, prompt, model, aspectRatio, imageSize, referenceImage } = args;

    // Validate password
    const appPassword = process.env.APP_PASSWORD;
    if (!appPassword || password !== appPassword) {
      return { error: "Invalid password", status: 401 };
    }

    try {
      // Create Gemini client
      const ai = createClient(
        process.env.GEMINI_API_KEY!,
        process.env.GEMINI_BASE_URL || undefined
      );

      // Build request parts
      const parts: any[] = [];
      if (referenceImage) {
        const { data, mimeType } = parseDataUrl(referenceImage);
        parts.push({ inlineData: { data, mimeType } });
        parts.push({ text: `Generate an image matching the style or subject of the provided reference. Prompt: ${prompt}` });
      } else {
        parts.push({ text: prompt });
      }

      // Build config
      const config: any = { imageConfig: { aspectRatio } };
      if (model === "gemini-3-pro-image-preview" && imageSize) {
        config.imageConfig.imageSize = imageSize;
      }

      // Call Gemini API
      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config,
      });

      // Extract image from response
      const candidates = response.candidates;
      if (!candidates?.[0]?.content?.parts) {
        return { error: "No image returned from API", status: 500 };
      }

      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
          };
        }
      }

      return { error: "No image in response", status: 500 };
    } catch (error: any) {
      console.error("generateImage error:", error);
      return { error: error.message || "Generation failed", status: 500 };
    }
  },
});

// Edit Image Action (runs in Node.js)
export const editImage = action({
  args: {
    password: v.string(),
    prompt: v.string(),
    model: v.string(),
    aspectRatio: v.string(),
    sourceImage: v.string(),
    maskImage: v.optional(v.string()),
    referenceImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { password, prompt, model, aspectRatio, sourceImage, maskImage, referenceImage } = args;

    // Validate password
    const appPassword = process.env.APP_PASSWORD;
    if (!appPassword || password !== appPassword) {
      return { error: "Invalid password", status: 401 };
    }

    try {
      // Create Gemini client
      const ai = createClient(
        process.env.GEMINI_API_KEY!,
        process.env.GEMINI_BASE_URL || undefined
      );

      // Build request parts
      const parts: any[] = [];

      // Source image (required)
      const { data: srcData, mimeType: srcMime } = parseDataUrl(sourceImage);
      parts.push({ inlineData: { data: srcData, mimeType: srcMime } });

      // Mask image (optional)
      if (maskImage) {
        const { data: maskData, mimeType: maskMime } = parseDataUrl(maskImage);
        parts.push({ inlineData: { data: maskData, mimeType: maskMime } });
      }

      // Reference image (optional)
      if (referenceImage) {
        const { data: refData, mimeType: refMime } = parseDataUrl(referenceImage);
        parts.push({ inlineData: { data: refData, mimeType: refMime } });
      }

      // Prompt with context
      const systemContext = maskImage
        ? "The second image is a mask where red marks the area to change. Keep everything outside red identical. "
        : "";
      parts.push({ text: `${systemContext}${prompt}` });

      // Call Gemini API
      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: { imageConfig: { aspectRatio } },
      });

      // Extract image from response
      const candidates = response.candidates;
      if (!candidates?.[0]?.content?.parts) {
        return { error: "No image returned from API", status: 500 };
      }

      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
          };
        }
      }

      return { error: "No image in response", status: 500 };
    } catch (error: any) {
      console.error("editImage error:", error);
      return { error: error.message || "Edit failed", status: 500 };
    }
  },
});
