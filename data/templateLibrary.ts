export const templateLibrary = `
THE VANGUARD: COMPLETE TEMPLATE LIBRARY
45 Reusable Prompt Templates for AI Film Generation
Version: 1.0
Date: October 22, 2025
Purpose: Customizable prompt templates for remaining ~180 standard shots

---

TEMPLATE INDEX
DIALOGUE TEMPLATES (15)
1. Two-Person Interrogation (Tense)
2. Two-Person Conversation (Casual)
... and 43 more templates.

---

HOW TO USE THESE TEMPLATES
Step 1: Choose Template
Find the template that matches your shot type (dialogue, reaction, establishing, etc.)

Step 2: Customize Variables
Replace bracketed variables with scene-specific details:
*   [CHARACTER_NAME] → Jackson, Duncan, Vanguard, etc.
*   [LOCATION] → Interrogation Room, Duncan's Office, etc.

---

TEMPLATE 1: TWO-PERSON INTERROGATION (TENSE)
Use For: High-stakes questioning, authority vs. subject, psychological pressure
BASE PROMPT STRUCTURE:
INT. [LOCATION]. Two people at interrogation table. [CHARACTER_A] (interrogator) sitting across from [CHARACTER_B] (subject). [CHARACTER_A] leaning forward [BODY_LANGUAGE_A]. [CHARACTER_B] [BODY_LANGUAGE_B]. Camera positioned [CAMERA_POSITION]. [LIGHTING] lighting. Tension visible. Shot type: [SHOT_TYPE].
Cinematography: [LENS], [MOVEMENT], [FRAMING]. Color grading: [COLOR_GRADE]. Atmosphere: [ATMOSPHERE].
--ar 21:9 --style raw --v 6.1 --cref [CHARACTER_A_REF] [CHARACTER_B_REF]
`;