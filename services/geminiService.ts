
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AspectRatio, GeminiModel, ImageSize } from "../types";

export const editImageWithGemini = async (
  model: GeminiModel,
  base64Image: string,
  prompt: string,
  maskBase64?: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });
  
  const imagePart = {
    inlineData: {
      mimeType: "image/png",
      data: base64Image.split(',')[1] || base64Image,
    },
  };

  const parts: any[] = [imagePart];

  if (maskBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/png",
        data: maskBase64.split(',')[1] || maskBase64,
      },
    });
  }

  const textPart = {
    text: maskBase64 
      ? `Edit the first image based on the areas highlighted in the second image (the mask) according to this prompt: "${prompt}"` 
      : `Apply the following change to this image: ${prompt}`,
  };
  
  parts.push(textPart);

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: { parts },
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) throw new Error("No image was returned from the AI model.");
  return imageUrl;
};

export const generateImageWithGemini = async (
  model: GeminiModel,
  prompt: string,
  aspectRatio: AspectRatio,
  imageSize?: ImageSize
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });
  
  const config: any = {
    imageConfig: {
      aspectRatio: aspectRatio,
    },
  };

  // imageSize is only supported by Gemini 3 Pro
  if (model === GeminiModel.PRO_3 && imageSize) {
    config.imageConfig.imageSize = imageSize;
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [{ text: prompt }],
    },
    config: config,
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) throw new Error("No image was generated. Please try a different prompt.");
  return imageUrl;
};
