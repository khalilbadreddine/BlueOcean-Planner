import { GoogleGenAI } from "@google/genai";
import { UserPreferences } from "../types";

// Initialize Gemini Client
// Using a factory function to ensure we always get the latest key if it changes (though typically static in env)
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlueOceanStrategy = async (prefs: UserPreferences): Promise<string> => {
  const ai = getAiClient();

  const basePrompt = `
    You are a world-class Product Strategist and Venture Capital analyst. 
    Your goal is to discover a "Blue Ocean" digital product opportunity—a product with high demand but low current competition.
    
    User Context:
    ${prefs.industry ? `- Preferred Industry: ${prefs.industry}` : '- Industry: Open to best opportunity'}
    ${prefs.targetAudience ? `- Target Audience: ${prefs.targetAudience}` : '- Target Audience: Undefined (Find the most painful gap)'}
    ${prefs.skills ? `- Founder Skills/Assets: ${prefs.skills}` : '- Skills: Generalist'}
    ${prefs.initialIdea ? `- Initial Concept Seed: ${prefs.initialIdea}` : '- Concept: Totally open'}

    Task:
    1.  **Identify a Unique Digital Product Idea:** It must be innovative, scalable, and address a specific, urgent pain point.
    2.  **Develop a Detailed Business Plan:** Include Value Proposition, Revenue Model, Go-to-Market Strategy, and Competitor Analysis (why it's low competition).
    3.  **Create a Detailed "Cahier des Charges" (Requirements Specification):**
        *   Functional Requirements (Core features for MVP).
        *   Non-Functional Requirements (Security, Performance, Scalability).
        *   User Roles & Journeys.
        *   Tech Stack Recommendation (No code generation, just architecture).

    Constraint:
    *   DO NOT write code. Focus entirely on the Strategy, Business Plan, and Specifications.
    *   The idea MUST be unique and not a generic clone of existing popular apps.
    *   Use deep reasoning to validate the "Low Competition" claim.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: basePrompt,
      config: {
        // Max thinking budget for deepest reasoning capability
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });

    return response.text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate business plan.");
  }
};
