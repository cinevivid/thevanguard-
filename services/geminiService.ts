
import { GoogleGenAI, Modality, Part } from "@google/genai";
import { screenplay } from '../data/screenplay';
import { visualLookbook } from '../data/visualLookbook';
import { productionCalendar } from '../data/productionCalendar';
import { consistencyFormula } from '../data/consistencyFormula';
import { Shot, EmotionalArcPoint, PacingPoint, TimelineClip, Act, Scene } from "../types";
import { pitchDeck } from "../data/pitchDeck";
import { productionData } from "../data/productionData";

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// ... (existing functions: generateCharacterImages, generateCharacterConcepts, etc.)

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
  let specificPrompt: string;
  if (analysisType === 'emotional_arc') {
    if (!character) {
      yield `### AI Error: Character name is required for emotional arc analysis.`;
      return;
    }
    specificPrompt = analysisPrompts.emotional_arc(character);
  } else {
    const promptFn = analysisPrompts[analysisType];
    specificPrompt = (promptFn as () => string)();
  }
  
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

export const getDashboardData = async (shots: Shot[]): Promise<{shootList: string; directorNotes: string}> => {
    const ai = getAiClient();
    const prompt = `You are an AI production assistant. Analyze the provided production data and generate a "Daily Shoot List" and "AI Director's Notes" in a single JSON object.

    **CONTEXT:**
    - Today's Date (for this exercise): October 24, 2025
    - Production Calendar: Details the schedule.
    - Shot Status: A JSON array of all 430 shots and their current production status.

    **INSTRUCTIONS:**
    1.  **For 'shootList':** Determine the current date's tasks from the calendar. Identify the next 3-5 uncompleted shots in the scheduled scenes. Format this as a friendly, motivational markdown briefing.
    2.  **For 'directorNotes':** Analyze the overall production progress. Identify potential issues (e.g., bottlenecks, consistency risks). Provide one or two proactive, insightful notes as markdown.
    3.  **Output:** Return a single, valid JSON object with two keys: "shootList" and "directorNotes". Do not add any other text or markdown formatting around the JSON.

    ---
    **PRODUCTION CALENDAR:**
    ${productionCalendar}
    ---
    **CURRENT SHOT STATUS (JSON):**
    ${JSON.stringify(shots.map(s => ({id: s.id, scene: s.scene, status: s.status})))}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-pro",
          contents: [{ parts: [{ text: prompt }] }],
        });
        const text = response.text.trim().replace(/```json|```/g, '');
        return JSON.parse(text);
    } catch (error: any) {
        console.error("Error generating dashboard data:", error);
        if (error.message && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED'))) {
             throw new Error("API quota exceeded for Gemini 2.5 Pro. This may be a daily or per-minute limit. Please wait and try again, or check your billing details.");
        }
        throw new Error("Could not generate dashboard data. Please check the console.");
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

export async function* generateMusicIdeas(musicPrompt: string): AsyncGenerator<string> {
    const ai = getAiClient();
    const fullPrompt = `You are an AI Music Composer. Based on the following prompt, generate a brief description of a musical score. Include instrumentation, tempo, mood, and reference composers.
    
    **Prompt:** "${musicPrompt}"
    ---
    `;

    try {
        const response = await ai.models.generateContentStream({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: fullPrompt }] }] });
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

export async function* generateAssetTags(shot: Shot, imageBase64: string): AsyncGenerator<string[]> {
    const ai = getAiClient();
    const prompt = `You are an AI asset tagging system. Analyze the provided image and its description to generate relevant, searchable metadata tags.

    **CONTEXT:**
    - **Shot ID:** ${shot.id}
    - **Description:** ${shot.description}
    - **Characters:** ${shot.characters.join(', ')}
    - **Location:** ${shot.location}

    **INSTRUCTIONS:**
    1.  Analyze the image and the context.
    2.  Generate a list of 5-10 descriptive tags.
    3.  Include tags for: characters present, location, shot type (e.g., 'close-up', 'wide-shot'), key objects, mood/emotion, and color.
    4.  Format the output as a JSON array of strings. Example: ["jackson", "close-up", "interrogation-room", "fear", "dark"]
    5.  Output ONLY the JSON array.
    `;
    const contents = { parts: [{ text: prompt }, { inlineData: { mimeType: 'image/png', data: imageBase64 } }] };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents,
        });
        const text = response.text;
        const tags = JSON.parse(text.trim().replace(/\\\`\\\`\\\`json|\\\`\\\`\\\`/g, ''));
        yield tags;
    } catch (error) {
        console.error("Error generating asset tags:", error);
        yield ['tagging_error'];
    }
}

export async function* generatePressKitContent(): AsyncGenerator<string> {
  const ai = getAiClient();
  const prompt = `You are a professional film publicist. Using the provided screenplay and project documents, generate the content for an Electronic Press Kit (EPK) for the film "THE VANGUARD".

  **INSTRUCTIONS:**
  1. Generate a compelling logline.
  2. Write a 1-page synopsis.
  3. Write a Director's Statement from the perspective of Bhishan Rai.
  4. List key selling points.
  5. Format the output as clean, professional markdown.

  ---
  **CORPUS:**
  ${screenplay}
  ${pitchDeck}
  ---
  `;

  try {
    const response = await ai.models.generateContentStream({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: prompt }] }] });
    for await (const chunk of response) {
        yield chunk.text;
    }
  } catch (error) {
    console.error("Error generating EPK content:", error);
    yield "### Error: Could not generate EPK content.";
  }
}

export async function* generateTrailerCutlist(): AsyncGenerator<string> {
  const ai = getAiClient();
  const prompt = `You are a professional trailer editor. Read the entire screenplay for "THE VANGUARD" and create a "paper edit" or "cut list" for a 90-second theatrical trailer.

  **INSTRUCTIONS:**
  1. Identify high-impact visual moments, key dialogue lines, and major plot turning points.
  2. Structure the trailer in a three-act structure (Setup, Confrontation, Climax).
  3. List the shots by their **Shot ID** from the shot database.
  4. Add brief notes on the music and sound design.
  5. Format the output as a clean, timed list.

  ---
  **SCREENPLAY:**
  ${screenplay}
  ---
  **SHOT DATABASE:**
  ${JSON.stringify(productionData.shots.map(s => ({id: s.id, description: s.description})))}
  ---
  `;

  try {
    const response = await ai.models.generateContentStream({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: prompt }] }] });
    for await (const chunk of response) {
        yield chunk.text;
    }
  } catch (error) {
    console.error("Error generating trailer cutlist:", error);
    yield "### Error: Could not generate trailer cutlist.";
  }
}


export const getEmotionalArcData = async (character: string): Promise<EmotionalArcPoint[]> => {
  const ai = getAiClient();
  const prompt = `Analyze the screenplay for "THE VANGUARD" and generate the emotional arc data for the character "${character}".
  
  **INSTRUCTIONS:**
  1. Identify 5-7 key scenes that define the character's emotional journey.
  2. For each scene, provide an emotional intensity score from -10 (utter despair) to +10 (peak triumph/joy).
  3. Provide a brief description of the emotional beat.
  4. Format the output as a valid JSON array of objects.
  
  **JSON FORMAT:**
  [
    { "scene": "SCENE 006", "intensity": -8, "description": "Jackson's Failure Montage" },
    { "scene": "SCENE 020", "intensity": 3, "description": "First Successful Interrogation" }
  ]

  **SCREENPLAY:**
  ${screenplay}
  `;
  
  try {
    const response = await ai.models.generateContent({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: prompt }] }] });
    const text = response.text.trim().replace(/\\\`\\\`\\\`json|\\\`\\\`\\\`/g, '').replace(/```json|```/g, '');
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching emotional arc data:", error);
    return [];
  }
};

export const getPacingData = async (): Promise<PacingPoint[]> => {
  const ai = getAiClient();
  const prompt = `Analyze the screenplay for "THE VANGUARD" and generate pacing data based on scene intensity and average shot length (ASL).
  
  **INSTRUCTIONS:**
  1. Break the film into ~10 major sequences/scenes.
  2. For each, estimate the average shot length (ASL) in seconds.
  3. Classify the intensity as 'Low', 'Medium', or 'High'.
  4. Format the output as a valid JSON array of objects.

  **JSON FORMAT:**
  [
    { "scene": "SCENE 001", "asl": 5.6, "intensity": "Medium" },
    { "scene": "SCENE 006", "asl": 3.1, "intensity": "High" }
  ]

  **SCREENPLAY:**
  ${screenplay}
  `;
  try {
    const response = await ai.models.generateContent({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: prompt }] }] });
    const text = response.text.trim().replace(/\\\`\\\`\\\`json|\\\`\\\`\\\`/g, '').replace(/```json|```/g, '');
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching pacing data:", error);
    return [];
  }
};

export async function* analyzeShotComposition(shot: Shot, imageBase64: string): AsyncGenerator<string> {
    const ai = getAiClient();
    const prompt = `You are an expert Director of Photography like Roger Deakins. Your task is to analyze a generated storyboard image for the film "THE VANGUARD" based on the project's official documentation.

    **CONTEXT:**
    ---
    **VISUAL LOOKBOOK:**
    ${visualLookbook}
    ---
    **SHOT DETAILS:**
    - **ID:** ${shot.id}
    - **Description:** ${shot.description}
    - **Camera Angle:** ${shot.cameraAngle || 'Not specified'}
    - **Lens Type:** ${shot.lensType || 'Not specified'}
    - **Lighting:** ${shot.lightingSetup || 'Not specified'}
    ---

    **INSTRUCTIONS:**
    1.  The provided image is the storyboard frame to analyze.
    2.  Critique the shot based on professional cinematography principles and the project's specific Visual Lookbook.
    3.  Provide a detailed, bulleted list of feedback covering:
        *   **Composition:** Rule of Thirds, leading lines, headroom, power dynamics.
        *   **Lighting:** Does it match the lookbook for this scene? Is it motivated? Does it create the right mood?
        *   **Visual Storytelling:** What does this shot communicate? Does it match the script's intent? Are there any missed opportunities for visual metaphors?
        *   **Technical Execution:** Does the lens choice and camera angle match the description?
    4.  Provide 1-2 actionable suggestions for how to improve the prompt to get a better result.
    5.  Be professional, insightful, and constructive.
    `;
    const contents = { parts: [{ text: prompt }, { inlineData: { mimeType: 'image/png', data: imageBase64 } }] };

    try {
        const response = await ai.models.generateContentStream({
            model: "gemini-2.5-pro",
            contents,
        });

        for await (const chunk of response) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error analyzing shot composition:", error);
        yield "### AI Error: Could not analyze shot composition.";
    }
}

export async function* runProductionAudit(acts: Act[], scenes: Scene[], shots: Shot[]): AsyncGenerator<string> {
  const ai = getAiClient();
  const prompt = `You are an AI Executive Producer for the film "THE VANGUARD". Analyze the entire production database (Acts, Scenes, and Shots) and provide a high-level audit report.

  **INSTRUCTIONS:**
  1.  Review the status of all shots within the context of their scenes and acts.
  2.  Identify critical production blockers (e.g., hero sequences not started, entire acts with no locked storyboards, shots stuck in 'Pending Approval' for too long).
  3.  Flag inconsistencies (e.g., a shot marked "Video Complete" but its preceding shot is "Not Started").
  4.  Check for missing resources (e.g., shots requiring VFX that don't have a VFX prompt).
  5.  Provide a prioritized list of 3-5 critical issues that need immediate attention. Format as professional, actionable markdown.

  ---
  **PRODUCTION DATABASE (JSON):**
  ${JSON.stringify({ acts, scenes, shots: shots.map(s => ({id: s.id, status: s.status, vfxRequired: s.vfxRequired, prompts: s.prompts.length})) }, null, 2)}
  ---
  `;

   try {
    const response = await ai.models.generateContentStream({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: prompt }] }] });
    for await (const chunk of response) {
        yield chunk.text;
    }
  } catch (error) {
    console.error("Error running production audit:", error);
    yield "### Error: Could not run production audit.";
  }
}

export async function* verifyContinuity(shot1: {shot: Shot, imageBase64: string}, shot2: {shot: Shot, imageBase64: string}): AsyncGenerator<string> {
  const ai = getAiClient();
  const prompt = `You are an expert Continuity Supervisor for a major film. Your task is to analyze two sequential storyboard images for continuity errors.

  **CONTEXT:**
  ---
  **VISUAL LOOKBOOK:**
  ${visualLookbook}
  ---
  **SHOT 1 DETAILS:**
  - **ID:** ${shot1.shot.id}
  - **Description:** ${shot1.shot.description}

  **SHOT 2 DETAILS:**
  - **ID:** ${shot2.shot.id}
  - **Description:** ${shot2.shot.description}
  ---

  **INSTRUCTIONS:**
  1.  The first image is Shot 1. The second image is Shot 2. They are sequential.
  2.  **Critically analyze** both images for any inconsistencies.
  3.  Provide a detailed, bulleted list of your findings. Cover these categories:
      *   **Costume & Wardrobe:** Is the clothing identical? Any added or missing items?
      *   **Props:** Are all props present/absent correctly? Have they moved without reason?
      *   **Hair & Makeup:** Is the hair style identical? Any changes to makeup?
      *   **Lighting:** Is the direction and color of the light consistent between the shots?
      *   **Set Dressing:** Has anything in the background changed, appeared, or disappeared?
  4.  If a continuity error is found, state its severity (e.g., 'Minor', 'Noticeable', 'Critical') and suggest a fix.
  5.  If there are no errors, state "Continuity is clear."
  `;
  
  const contents = { parts: [
    { text: prompt }, 
    { inlineData: { mimeType: 'image/png', data: shot1.imageBase64 } },
    { inlineData: { mimeType: 'image/png', data: shot2.imageBase64 } },
  ]};

  try {
    const response = await ai.models.generateContentStream({
        model: "gemini-2.5-pro",
        contents,
    });

    for await (const chunk of response) {
        yield chunk.text;
    }
  } catch (error) {
    console.error("Error running continuity verification:", error);
    yield "### AI Error: Could not run continuity verification.";
  }
}

// NEW EXPERT FEATURES
export async function* generateLightingDiagram(sceneDescription: string): AsyncGenerator<string> {
    const ai = getAiClient();
    const prompt = `You are an AI Gaffer and Director of Photography. Based on the Visual Lookbook and a scene description, generate a simple, text-based lighting diagram and a prompt fragment for Midjourney.

    **CONTEXT:**
    ---
    **VISUAL LOOKBOOK:**
    ${visualLookbook}
    ---
    **SCENE DESCRIPTION:**
    ${sceneDescription}
    ---
    
    **INSTRUCTIONS:**
    1. Analyze the lookbook for the lighting style of the described scene/location.
    2. Create a simple top-down text diagram using characters like [K] for Key, [F] for Fill, [B] for Backlight, and [C] for Camera.
    3. Write a short Midjourney prompt fragment describing the lighting setup.
    4. Format as markdown.
    `;
    try {
        const response = await ai.models.generateContentStream({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: prompt }] }] });
        for await (const chunk of response) { yield chunk.text; }
    } catch (e) { yield "### AI Error: Could not generate lighting diagram."; }
}

export async function* suggestLensPackage(shotDescription: string): AsyncGenerator<string> {
    const ai = getAiClient();
    const prompt = `You are an AI Camera Assistant. Based on a shot description and standard cinematography principles, recommend a lens package (e.g., 24mm, 50mm, 85mm) and camera movement. Justify your choices.
    
    **SHOT DESCRIPTION:**
    ${shotDescription}
    ---
    `;
    try {
        const response = await ai.models.generateContentStream({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: prompt }] }] });
        for await (const chunk of response) { yield chunk.text; }
    } catch (e) { yield "### AI Error: Could not suggest lens package."; }
}

export const generatePropConcept = async (description: string): Promise<string[]> => {
  const ai = getAiClient();
  const fullPrompt = `Generate a cinematic concept art image of a sci-fi prop. Style should be grounded, realistic, and consistent with a Blade Runner 2049 aesthetic. Prop description: "${description}"`;
  const contents = { parts: [{ text: fullPrompt }] };
  const generateSingleImage = async () => {
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash-image', contents, config: { responseModalities: [Modality.IMAGE] } });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return part.inlineData.data;
    }
    throw new Error("No image data found in response");
  };
  try {
    const imagePromises = Array(4).fill(0).map(() => generateSingleImage());
    const results = await Promise.all(imagePromises);
    return results.filter((img): img is string => !!img);
  } catch (error) {
    console.error("Error generating prop concepts:", error);
    return [];
  }
};


export async function* generateAmbientAudio(prompt: string): AsyncGenerator<string> {
    const ai = getAiClient();
    const fullPrompt = `You are an AI Sound Designer. Generate a 60-second seamless loop of an ambient soundscape based on the following description: "${prompt}".
    
    **For this simulation, describe the soundscape in detail instead of generating audio.** Include layers, specific sounds, and overall mood.
    `;
    try {
        const response = await ai.models.generateContentStream({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: prompt }] }] });
        for await (const chunk of response) { yield chunk.text; }
    } catch (e) { yield "### AI Error: Could not generate ambient audio description."; }
}

export async function* analyzePacingOfClips(clips: TimelineClip[]): AsyncGenerator<string> {
    const ai = getAiClient();
    const clipData = clips.map(c => ({ id: c.shot?.id, duration: c.duration, description: c.shot?.description }));
    const prompt = `You are an AI Editor and Pacing Assistant. Analyze the following sequence of video clips from a scene's rough cut. Compare the pacing (average shot length) against the analysis from the Pacing Visualizer and the script's intent. Highlight sections that may be dragging or rushed.

    **CONTEXT:**
    ---
    **PACING ANALYSIS FROM SCRIPT:**
    (The AI would normally have access to the pacing visualizer data here, but for now, we'll use the script)
    ${screenplay}
    ---
    **CLIP DATA (JSON):**
    ${JSON.stringify(clipData, null, 2)}
    ---

    **INSTRUCTIONS:**
    1. Calculate the Average Shot Length (ASL) for this sequence.
    2. Based on the script context, determine if this pacing is appropriate.
    3. Provide a short, actionable critique. For example: "The ASL is 5.2s, which feels slow for an action sequence. Consider trimming 1-2 seconds from the establishing shot."
    `;
    try {
        const response = await ai.models.generateContentStream({ model: "gemini-2.5-pro", contents: [{ parts: [{ text: prompt }] }] });
        for await (const chunk of response) { yield chunk.text; }
    } catch (e) { yield "### AI Error: Could not analyze clip pacing."; }
}
