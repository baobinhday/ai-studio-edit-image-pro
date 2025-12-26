
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AspectRatio, GeminiModel, ImageSize } from "../types";

// Convex URL from environment
const VITE_CONVEX_URL = process.env.VITE_CONVEX_URL;

const prepareImagePart = async (dataUrl: string) => {
  const base64Data = dataUrl.split(',')[1];
  const mimeType = dataUrl.split(';')[0].split(':')[1];
  return {
    inlineData: {
      data: base64Data,
      mimeType: mimeType || 'image/jpeg'
    }
  };
};

export const editImageWithGemini = async (
  model: GeminiModel,
  base64Image: string,
  prompt: string,
  aspectRatio: AspectRatio,
  apiKeyInput: string,
  passwordInput: string,
  maskBase64?: string,
  referenceImageBase64?: string
): Promise<string> => {
  // If password is provided and Convex URL is available, use Convex proxy
  if (passwordInput && VITE_CONVEX_URL) {
    const response = await fetch(`${VITE_CONVEX_URL}/geminiEdit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: passwordInput,
        prompt,
        model,
        aspectRatio,
        sourceImage: base64Image,
        maskImage: maskBase64,
        referenceImage: referenceImageBase64,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Edit failed");
    }

    const data = await response.json();
    return data.image;
  }

  // Fallback: direct API call with user's key
  const apiKey = apiKeyInput || process.env.API_KEY;
  if (!apiKey) throw new Error("API Key or Password is required to use Lumina Studio.");

  const ai = new GoogleGenAI({ apiKey });
  const parts: any[] = [];
  
  parts.push(await prepareImagePart(base64Image));

  if (maskBase64) {
    parts.push(await prepareImagePart(maskBase64));
  }

  if (referenceImageBase64) {
    parts.push(await prepareImagePart(referenceImageBase64));
  }

  const systemContext = maskBase64 
    ? "The second image is a mask where red marks the area to change. Keep everything outside red identical. " 
    : "";
  parts.push({ text: `${systemContext}${prompt}` });

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: { parts },
    config: {
      imageConfig: { aspectRatio }
    }
  });

  if (!response.candidates?.[0]?.content?.parts) {
    throw new Error("No image returned. Check your prompt or image content.");
  }

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error(response.text || "No image generated.");
};

export const generateImageWithGemini = async (
  model: GeminiModel,
  prompt: string,
  aspectRatio: AspectRatio,
  apiKeyInput: string,
  passwordInput: string,
  imageSize?: ImageSize,
  referenceImageBase64?: string
): Promise<string> => {
  // If password is provided and Convex URL is available, use Convex proxy
  if (passwordInput && VITE_CONVEX_URL) {
    const response = await fetch(`${VITE_CONVEX_URL}/geminiGenerate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: passwordInput,
        prompt,
        model,
        aspectRatio,
        imageSize,
        referenceImage: referenceImageBase64,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Generation failed");
    }

    const data = await response.json();
    return data.image;
  }

  // Fallback: direct API call with user's key
  const apiKey = apiKeyInput || process.env.API_KEY;
  if (!apiKey) throw new Error("API Key or Password is required to use Lumina Studio.");

  const ai = new GoogleGenAI({ apiKey });
  const parts: any[] = [];
  
  if (referenceImageBase64) {
    parts.push(await prepareImagePart(referenceImageBase64));
    parts.push({ text: `Generate an image matching the style or subject of the provided reference. Prompt: ${prompt}` });
  } else {
    parts.push({ text: prompt });
  }

  const config: any = {
    imageConfig: { aspectRatio },
  };

  if (model === GeminiModel.PRO_3 && imageSize) {
    config.imageConfig.imageSize = imageSize;
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: { parts },
    config: config,
  });

  if (!response.candidates?.[0]?.content?.parts) {
    throw new Error("No candidates returned from the API.");
  }

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error(response.text || "No image generated.");
};
