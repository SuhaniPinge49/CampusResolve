
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Analyzes campus maintenance issues using Gemini 3 Flash.
 * Follows strict guidelines for API initialization and result extraction.
 */
export const analyzeIssue = async (description: string, photoBase64?: string) => {
  // Using process.env.API_KEY directly as required by guidelines
  if (!process.env.API_KEY) return null;

  try {
    // Correct initialization with named parameter and direct env access
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [{ text: `Analyze this campus maintenance issue report: "${description}". Provide a short urgency assessment (High/Medium/Low) and a 1-sentence recommended action for the facilities team.` }];
    
    if (photoBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: photoBase64.split(',')[1] || photoBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urgency: { 
              type: Type.STRING, 
              description: "Urgency level: High, Medium, or Low" 
            },
            recommendation: { 
              type: Type.STRING, 
              description: "A single sentence of actionable advice for the facilities team" 
            }
          },
          required: ["urgency", "recommendation"],
          propertyOrdering: ["urgency", "recommendation"]
        }
      }
    });

    // Access the .text property directly (not as a function)
    const jsonStr = response.text?.trim();
    if (!jsonStr) return null;
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
};
