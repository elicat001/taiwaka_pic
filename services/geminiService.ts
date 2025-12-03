import { GoogleGenAI } from "@google/genai";
import { extractBase64Data, getMimeType } from '../utils/fileUtils';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImageWithGemini = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  try {
    // User requested to use the original image without compression, even if large.
    const mimeType = getMimeType(imageBase64);
    const rawData = extractBase64Data(imageBase64);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: rawData,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      
      // Look for the image part
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }

      // If no image found, check for text (potentially an error message or refusal from the model)
      for (const part of parts) {
        if (part.text) {
          throw new Error(part.text);
        }
      }
    }

    throw new Error("Gemini 未返回图像数据。");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Improve error message for common issues
    if (error.message?.includes('413') || error.message?.includes('xhr error')) {
      throw new Error("图片文件太大，无法通过 API 处理。请尝试使用较小（小于 10MB）或分辨率较低的图片。");
    }
    throw error;
  }
};