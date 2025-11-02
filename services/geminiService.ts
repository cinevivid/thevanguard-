import { GoogleGenAI, Modality, Part } from "@google/genai";
import { screenplay } from '../data/screenplay';
import { visualLookbook } from '../data/visualLookbook';
import { productionCalendar } from '../data/productionCalendar';
import { consistencyFormula } from '../data/consistencyFormula';
import { Shot } from "../types";

// Assume process.env.API_KEY is available
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateCharacterImages = async (prompt: string, aspectRatio: '1:1' | '16:9'): Promise<string[]> => {
  const ai = getAiClient();
  const fullPrompt = `${prompt}\n\nAspect ratio: ${aspectRatio}`;
  
  const contents = { parts: [{ text: fullPrompt }] };

  const generateSingleImage = async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: contents,
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image data found in response");
  };

  try {
    // Generate 4 images in parallel
    const imagePromises = Array(4).fill(0).map(() => generateSingleImage());
    const images = await Promise.all(imagePromises);
    return images.filter((img): img is string => !!img);
  } catch (error) {
    console.error("Error generating character images:", error);
    return [];
  }
};

export const generateCharacterConcepts = async (description: string): Promise<string[]> => {
  const ai = getAiClient();
  const fullPrompt = `Generate a cinematic headshot for a film character. The image should be a professional actor-style portrait with dramatic lighting. The background should be neutral (gray or black). The character is described as: "${description}".

Style: cinematic portrait, dramatic lighting, headshot, professional photography, anamorphic lens flare.
`;
  
  const contents = { parts: [{ text: fullPrompt }] };

  const generateSingleImage = async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: contents,
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image data found in response");
  };

  try {
    const imagePromises = Array(4).fill(0).map(() => generateSingleImage());
    const images = await Promise.all(imagePromises);
    return images.filter((img): img is string => !!img);
  } catch (error) {
    console.error("Error generating character concepts:", error);
    return [];
  }
};


export const generateStoryboardImages = async (prompt: string, characterRefs: { name: string, imageBase64: string }[]): Promise<string[]> => {
  const ai = getAiClient();
  const referenceInstructions = characterRefs.map((ref, index) => 
    `The character '${ref.name}' should look like the person in reference image ${index + 1}.`
  ).join(' ');

  const fullPrompt = `You are a storyboard artist for a major film production. Create a cinematic storyboard frame based on the following scene description. 
  You have been provided with one or more reference images of the characters. ${referenceInstructions}
  
  Scene description: ${prompt}`;

  const imageParts: Part[] = characterRefs.map(ref => ({
    inlineData: {
      mimeType: 'image/png',
      data: ref.imageBase64,
    },
  }));
  
  const contents = { parts: [{ text: fullPrompt }, ...imageParts] };

  const generateSingleImage = async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: contents,
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image data found in response");
  };

  try {
    // Generate 4 images in parallel
    const imagePromises = Array(4).fill(0).map(() => generateSingleImage());
    const images = await Promise.all(imagePromises);
    return images.filter((img): img is string => !!img);
  } catch (error) {
    console.error("Error generating storyboard images:", error);
    return [];
  }
};


export async function* chatWithCorpusStream(question: string, corpus: string): AsyncGenerator<string> {
  const ai = getAiClient();
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

export const generateVideoFromImage = async (prompt: string, imageBase64: string) => {
  const ai = getAiClient();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: imageBase64,
      mimeType: 'image/png',
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });
  return operation;
};

export const getVideoOperationStatus = async (operation: any) => {
  const ai = getAiClient();
  const status = await ai.operations.getVideosOperation({ operation: operation });
  return status;
}

export const fetchGeneratedVideo = async (downloadLink: string): Promise<Blob> => {
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }
  return response.blob();
};

export async function* generatePromptWithAIDirector(shotId: string, shotDescription: string): AsyncGenerator<string> {
  const ai = getAiClient();
  const prompt = `You are an AI Director for the film "THE VANGUARD". Your task is to generate a detailed, professional Midjourney prompt for a specific shot.

You have access to the full screenplay and the Director's Visual Lookbook. Synthesize information from these sources to create the perfect prompt.

**CONTEXT:**
---
**SCREENPLAY:**
${screenplay}
---
**VISUAL LOOKBOOK:**
${visualLookbook}
---

**YOUR TASK:**
Generate a detailed Midjourney prompt for the following shot:

- **Shot ID:** ${shotId}
- **Description:** ${shotDescription}

**INSTRUCTIONS:**
1.  **Find the Scene:** Locate the relevant scene in the screenplay based on the shot ID and description.
2.  **Extract Details:** Pull key details from the screenplay: characters, action, location, dialogue, and mood.
3.  **Apply Visual Style:** Incorporate the specific cinematography, color palette, and lighting rules from the Visual Lookbook for this type of scene/location.
4.  **Compose the Prompt:** Combine all information into a single, structured Midjourney prompt. Include camera details, lighting, color, style references, and all necessary technical parameters (\`--ar 21:9 --style raw --v 6.1\`).
5.  **Output ONLY the prompt text.** Do not add any explanation or surrounding text.`;

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-pro",
      contents: [{ parts: [{ text: prompt }] }],
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error in AI Director prompt generation:", error);
    yield `// AI Director Error: Could not generate prompt. Please check console.`;
  }
}

export async function* generateScriptBreakdown(): AsyncGenerator<string> {
  const ai = getAiClient();
  const prompt = `You are an expert First Assistant Director. Your task is to read the provided screenplay for "THE VANGUARD" and generate a preliminary shot list.

**INSTRUCTIONS:**
1.  Read the entire screenplay carefully.
2.  For each scene, break down the action and dialogue into individual shots.
3.  Suggest a standard shot type for each (e.g., WIDE, MEDIUM, CLOSE-UP, INSERT).
4.  Write a brief, one-line description for each shot.
5.  Format the output as clean markdown, using headings for scenes. Do not include prompts or technical details, just the shot list itself.

**EXAMPLE FORMAT:**
### SCENE 1: ALIEN DESERT - NIGHT
- WIDE: Two moons in an alien sky.
- WIDE: A circle of sand rises into the air.
- MEDIUM: Three priests stand around the circle.
...and so on.

---
**SCREENPLAY:**
${screenplay}
---
`;

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-pro",
      contents: [{ parts: [{ text: prompt }] }],
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error in script breakdown:", error);
    yield "### AI Error: Could not generate script breakdown. Please check the console.";
  }
}

const analysisPrompts = {
  emotional_arc: (character: string) => `Analyze the emotional arc of the character "${character}" throughout the screenplay. Identify key turning points, their motivations, and how their emotional state evolves from beginning to end. Present this as a scene-by-scene breakdown.`,
  visual_motifs: () => `Analyze the screenplay for recurring visual motifs (e.g., colors, objects, symbols, locations). Explain their symbolic meaning and how they contribute to the film's themes.`,
  pacing_rhythm: () => `Analyze the pacing and rhythm of the screenplay. Identify sequences of high action versus quiet introspection. Create a timeline or chart that visualizes the film's tempo from scene to scene.`,
  full_analysis: () => `Perform a comprehensive script analysis. Generate a professional logline, a one-paragraph summary, identify the core themes, and provide a brief character arc summary for the main protagonists (Vanguard, Jackson, Duncan).`,
  continuity_errors: () => `Act as a script supervisor. Read the screenplay carefully and identify potential continuity errors. Look for inconsistencies in character knowledge, timelines, prop usage, or physical descriptions across different scenes. List any potential issues you find.`
};

export type AnalysisType = keyof typeof analysisPrompts;

export async function* analyzeScript(analysisType: AnalysisType, character?: string): AsyncGenerator<string> {
  const ai = getAiClient();
  // @ts-ignore
  const specificPrompt = analysisPrompts[analysisType](character);
  
  const prompt = `You are an expert script analyst AI. Your task is to analyze the screenplay for "THE VANGUARD" based on the user's specific request. Provide a detailed, professional-level analysis. Use markdown for formatting.

---
**SCREENPLAY:**
${screenplay}
---

**ANALYSIS REQUEST:**
${specificPrompt}
`;

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-pro",
      contents: [{ parts: [{ text: prompt }] }],
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error(`Error in script analysis (${analysisType}):`, error);
    yield `### AI Error: Could not perform analysis: ${analysisType}. Please check the console.`;
  }
}

export async function* getDailyShootList(shots: Shot[]): AsyncGenerator<string> {
    const ai = getAiClient();
    const prompt = `You are an AI First Assistant Director. Based on the provided production calendar and the current status of all 430 shots, determine today's date (assume today is October 24, 2025 for this exercise) and generate a "Daily Shoot List". 

    **INSTRUCTIONS:**
    1.  Find the current date in the production calendar.
    2.  Identify the scenes scheduled for this week.
    3.  Look at the current status of shots in those scenes.
    4.  Create a prioritized list of the next 3-5 UNCOMPLETED shots to work on today.
    5.  Present this as a friendly, motivational daily briefing. Be specific.

    ---
    **PRODUCTION CALENDAR:**
    ${productionCalendar}
    ---
    **CURRENT SHOT STATUS (JSON):**
    ${JSON.stringify(shots.map(s => ({id: s.id, scene: s.scene, status: s.status})))}
    ---
    `;

    try {
        const response = await ai.models.generateContentStream({
          model: "gemini-2.5-pro",
          contents: [{ parts: [{ text: prompt }] }],
        });
        for await (const chunk of response) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error generating daily shoot list:", error);
        yield "Could not generate today's shoot list. Please check the console.";
    }
}

export async function* getAIDirectorNotes(shots: Shot[]): AsyncGenerator<string> {
    const ai = getAiClient();
    const prompt = `You are the AI Director for "THE VANGUARD". Analyze the current production progress and provide one or two proactive, insightful notes.

    **INSTRUCTIONS:**
    1. Review the overall completion percentage.
    2. Identify which scenes are complete vs. in-progress.
    3. Look for potential issues (e.g., many shots generated but not locked, a character appearing in many recent shots).
    4. Synthesize your findings into a helpful, high-level suggestion, like a real director would. Example ideas: suggest a 'consistency check' on a character, recommend moving to VFX planning for a completed scene, or note that a major milestone is approaching.
    5. Be creative and insightful. Format as markdown.

    ---
    **CURRENT SHOT STATUS (JSON):**
    ${JSON.stringify(shots.map(s => ({id: s.id, scene: s.scene, status: s.status})))}
    ---
    `;

    try {
        const response = await ai.models.generateContentStream({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: prompt }] }] });
        for await (const chunk of response) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error generating AI director notes:", error);
        yield "Could not generate director's notes. Please check the console.";
    }
}

export const generateMoodboardImages = async (prompt: string): Promise<string[]> => {
    const ai = getAiClient();
    const fullPrompt = `Generate a cinematic mood board image for a sci-fi film. The image should be rich in atmospheric detail and suitable for pre-production concept art. Style: Blade Runner 2049, Denis Villeneuve. Prompt: ${prompt}`;
    
    const contents = { parts: [{ text: fullPrompt }] };
  
    const generateSingleImage = async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: contents,
        config: { responseModalities: [Modality.IMAGE] },
      });
      return response.candidates[0].content.parts[0].inlineData?.data;
    };
  
    try {
      const imagePromises = Array(4).fill(0).map(() => generateSingleImage());
      const images = await Promise.all(imagePromises);
      return images.filter((img): img is string => !!img);
    } catch (error) {
      console.error("Error generating mood board images:", error);
      return [];
    }
};

export async function* getColorBibleAnalysis(scene: string): AsyncGenerator<string> {
    const ai = getAiClient();
    const prompt = `You are an AI Colorist. Analyze the provided Visual Lookbook and provide a detailed color grading and lighting plan for the following scene: "${scene}".
    
    **INSTRUCTIONS:**
    1. Find the scene or location type in the Visual Lookbook.
    2. Extract the specified color palette (primary, accent), saturation level, and lighting design.
    3. Provide a concise, actionable summary for a colorist, including DaVinci Resolve settings if possible.
    
    ---
    **VISUAL LOOKBOOK:**
    ${visualLookbook}
    ---
    `;

    try {
        const response = await ai.models.generateContentStream({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: prompt }] }] });
        for await (const chunk of response) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error generating color bible analysis:", error);
        yield "Could not generate color analysis. Please check the console.";
    }
}

export async function* generateMusicIdeas(prompt: string): AsyncGenerator<string> {
    const ai = getAiClient();
    const fullPrompt = `You are an AI Music Composer. Based on the following prompt, generate a brief description of a musical score. Include instrumentation, tempo, mood, and reference composers.
    
    **Prompt:** "${prompt}"
    ---
    `;

    try {
        const response = await ai.models.generateContentStream({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: prompt }] }] });
        for await (const chunk of response) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error generating music ideas:", error);
        yield "Could not generate music ideas. Please check the console.";
    }
}

export const generateSoundEffect = async (prompt: string): Promise<string | null> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Generate a sound effect of: ${prompt}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
};

export async function* runQualityControl(imageBase64: string, characterRefs: {name: string, imageBase64: string}[], shot: Shot): AsyncGenerator<string> {
  const ai = getAiClient();

  const imageParts: Part[] = [
    { inlineData: { mimeType: 'image/png', data: imageBase64 } },
    ...characterRefs.map(ref => ({
      inlineData: { mimeType: 'image/png', data: ref.imageBase64 },
    }))
  ];

  const prompt = `You are an AI Quality Control agent and Script Supervisor for the film "THE VANGUARD". Your task is to analyze a generated storyboard image against the project's official documentation.

  **CONTEXT:**
  ---
  **VISUAL LOOKBOOK:**
  ${visualLookbook}
  ---
  **CONSISTENCY FORMULA (Character Descriptions):**
  ${consistencyFormula}
  ---
  **SHOT DETAILS:**
  - **ID:** ${shot.id}
  - **Description:** ${shot.description}
  - **Characters:** ${shot.characters.join(', ')}
  ---

  **INSTRUCTIONS:**
  1. The first image provided is the storyboard frame to analyze.
  2. The subsequent images are the canonical character references.
  3. Compare the storyboard frame against all provided context.
  4. Provide a concise, bulleted list of feedback.
  5. **Be critical.** Look for inconsistencies in:
     - Character facial features, clothing, and build compared to the references.
     - Lighting and color palette compared to the Visual Lookbook for the scene's location.
     - Overall composition and mood compared to the shot description.
  6. If it's a good match, say so. If there are problems, list them specifically.`;

  const contents = { parts: [{ text: prompt }, ...imageParts] };

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-pro",
      contents: contents,
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error in AI Quality Control:", error);
    yield "Error running QC analysis. Please check console.";
  }
}

// FIX: Added dummy implementation for generateAssetTags
export const generateAssetTags = async (shot: Shot): Promise<string[]> => {
  console.log(`Generating tags for shot ${shot.id}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  const tags = ['sci-fi', shot.complexity.toLowerCase()];
  if (shot.characters.length > 0) {
    tags.push(...shot.characters.map(c => c.toLowerCase()));
  }
  tags.push(shot.location.toLowerCase() || 'unknown-location');
  return tags;
}

// FIX: Added dummy implementation for generatePressKitContent
export async function* generatePressKitContent(): AsyncGenerator<string> {
  yield "### THE VANGUARD - PRESS KIT\n\n";
  await new Promise(res => setTimeout(res, 200));
  yield "**Logline:** A military interrogator discovers the armored alien she's questioning is actually a human time traveler—and the key to stopping her own obsessed mentor from destroying the timeline.\n\n";
  await new Promise(res => setTimeout(res, 200));
  yield "**Synopsis:** In an underground military facility, interrogator Jamie Jackson questions an imposing alien warrior called 'The Vanguard.' As she uncovers his impossible origin—a human soldier from the future, trapped and weaponized by time itself—she must stop her mentor from stealing the alien's armor and unraveling the fabric of reality.\n";
}

// FIX: Added dummy implementation for generateTrailerCutlist
export async function* generateTrailerCutlist(): AsyncGenerator<string> {
  yield "AI Generated Trailer Cutlist for THE VANGUARD (90 seconds)\n\n";
  await new Promise(res => setTimeout(res, 200));
  yield "### OPENING (0-15s)\n";
  yield "* A01-S001-A - Alien desert establishing shot.\n";
  yield "* A01-S004-A - Vanguard materializes in city.\n";
  yield "* A01-S005-A - Glass shatters.\n\n";
  await new Promise(res => setTimeout(res, 200));
  yield "### RISING TENSION (15-45s)\n";
  yield "* A02-S020-A - Jackson interrogates Vanguard.\n";
  yield "* A02-S024-B - Hologram timeline appears.\n";
  yield "* A02-S040-A - Duncan approaches with magnetic boots.\n\n";
  await new Promise(res => setTimeout(res, 200));
  yield "### CLIMAX (45-75s)\n";
  yield "* A03-S050-D - Neural tendrils pierce skin (body horror).\n";
  yield "* A02-S035-037 - Quick cut of Grandma's death.\n";
  yield "* A03-S057-B - Hyper slow-mo bullet trajectory.\n\n";
  await new Promise(res => setTimeout(res, 200));
  yield "### FINALE (75-90s)\n";
  yield "* A03-S066-A - Victor's hands become transparent.\n";
  yield "* TITLE CARD: THE VANGUARD\n";
}