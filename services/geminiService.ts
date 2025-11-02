
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeScriptWithAI = async (screenplay: string): Promise<string> => {
  const prompt = `You are an Academy Award-winning script coverage analyst. 
  Analyze this screenplay and provide a detailed, professional report covering the following points. Use markdown for formatting.
  
  1.  **Logline:** Is it clear? Can you suggest a better one?
  2.  **Three-Act Structure:** Is it sound? Identify the inciting incident, Act 1 break, midpoint, and Act 2 break.
  3.  **Character Analysis:** Are the protagonist's goals and antagonist's motivations clear and consistent? Are the character arcs complete?
  4.  **Conflict:** Detail the external and internal conflicts. Do they escalate properly? Are the stakes clear?
  5.  **Dialogue Quality:** Does the dialogue have subtext, or is it too "on the nose"? Provide examples.
  6.  **Pacing:** Are there sections that feel slow or rushed?
  7.  **Plot Holes:** Are there any logic gaps or inconsistencies?
  8.  **Suggestions for Improvement:** What key changes would elevate this script? Which scenes could be cut or merged?
  9.  **Overall Rating (1-10) for:** Concept, Execution, Marketability.
  
  Screenplay:
  ---
  ${screenplay}
  ---
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing script:", error);
    return "An error occurred while analyzing the script. Please check the console for details.";
  }
};

export const checkContinuityWithAI = async (
  imageBase64A: string, 
  mimeTypeA: string, 
  imageBase64B: string, 
  mimeTypeB: string
): Promise<string> => {
    const prompt = `As an expert film continuity supervisor, compare these two consecutive shots.
Shot A is the previous shot, and Shot B is the current shot.
Analyze them meticulously for any continuity errors.

Check the following:
1.  **Costume:** Are all articles of clothing identical and in the same state (e.g., buttons done, sleeves rolled)?
2.  **Hair & Makeup:** Is hair styling and makeup perfectly consistent?
3.  **Props:** Have any props appeared, disappeared, or changed position?
4.  **Set Dressing:** Are all background elements in the exact same place?
5.  **Lighting:** Does the lighting direction, quality, and shadows match perfectly?
6.  **Character Position/Pose:** Is the character's posture and position consistent with the previous shot, accounting for expected movement?

Respond ONLY with a JSON object with the following structure:
{
  "continuity_maintained": boolean,
  "confidence": number (0.0 to 1.0),
  "issues": [
    {
      "type": "costume" | "prop" | "makeup" | "lighting" | "set_dressing" | "position",
      "severity": "minor" | "noticeable" | "glaring",
      "description": "A detailed explanation of the continuity error."
    }
  ]
}
If no issues are found, the "issues" array should be empty.
`;
  
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
            parts: [
                { inlineData: { data: imageBase64A, mimeType: mimeTypeA } },
                { inlineData: { data: imageBase64B, mimeType: mimeTypeB } },
                { text: prompt },
            ],
        },
    });
    return response.text;
  } catch (error) {
    console.error("Error checking continuity:", error);
    return JSON.stringify({
      continuity_maintained: false,
      confidence: 0,
      issues: [{
        type: "system",
        severity: "glaring",
        description: "An API error occurred. Check the console."
      }]
    }, null, 2);
  }
};


export async function* chatWithCorpusStream(question: string, corpus: string): AsyncGenerator<string> {
  const prompt = `You are The Vanguard's production assistant AI. Your knowledge is strictly limited to the documents provided below in the corpus. Your task is to answer the user's question based ONLY on this corpus. Do not use any external knowledge. If the answer is not in the corpus, say so. Use markdown for formatting.

--- CORPUS START ---

${corpus}

--- CORPUS END ---

User Question: ${question}`;

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error in chatWithCorpusStream:", error);
    yield "Sorry, an error occurred while communicating with the AI. Please check the console for details.";
  }
}
