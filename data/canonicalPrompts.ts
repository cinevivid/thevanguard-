interface CanonicalPrompt {
  prompt: string;
  keyFeatures: string[];
  aspectRatio: '16:9' | '1:1';
}

export const canonicalPrompts: Record<string, CanonicalPrompt> = {
  'Vanguard (Armored)': {
    prompt: `Full body portrait of armored warrior standing powerfully. 
Massive imposing figure 6'6" tall, 300 lbs, intimidating presence. 
Green biomechanical armor fused to pale flesh, black leather straps 
across chest and arms. Helmet with red glowing visor faceplate. 
Battle-worn armor (scratches, dents, weathered). Wrist-mounted guns 
on both gauntlets (mechanical detail visible). Armored boots, 
heavy gauntlets. Standing in neutral powerful pose, arms at sides, 
facing camera directly. Full body centered in frame.

Professional photography, cinematic lighting, Blade Runner 2049 
aesthetic, sci-fi warrior, Denis Villeneuve style, anamorphic lens. 
Dark background (concrete wall or simple black). Rim lighting on 
armor (highlights green metal).`,
    keyFeatures: [
      "Green armor (correct color, not silver or gray)",
      "Red visor glow (not blue, not white)",
      "Black leather straps (visible across armor)",
      "Wrist guns (both gauntlets, mechanical)",
      "Battle damage (scratches, weathered)",
      "Imposing scale (looks 6'6\", massive)",
    ],
    aspectRatio: '16:9'
  },
  'Vanguard (Unarmored)': {
    prompt: `Portrait of man without armor. Male 30s, pale skin (minimal sun exposure), 
muscular but lean warrior build. Completely shirtless (bare torso visible). 
Scars visible where armor was fused (chest, shoulders, arms) - surgical 
scars, healed but prominent. No hair on head (shaved or naturally bald). 
Strong facial resemblance to Duncan family (intelligent eyes, similar 
facial structure). Calm expression, no longer threatening. Sitting at 
table, arms resting on surface, relaxed posture.

Professional photography, cinematic lighting, desaturated tones, 
concrete wall background, interrogation room aesthetic.`,
    keyFeatures: [
      "Pale skin (sickly, not tanned)",
      "Visible scars (chest, shoulders, arms)",
      "No hair (bald head)",
      "Duncan family resemblance (eyes, face structure)",
      "Lean muscular build (warrior, not bodybuilder)",
      "Calm demeanor (not threatening)",
    ],
    aspectRatio: '16:9'
  },
  'Director Duncan': {
    prompt: `Portrait of scientist in 50s. White pearl goatee (perfectly groomed, 
signature look), twirled mustache (villain aesthetic). Sharp intelligent 
gray-blue eyes, intense focused gaze. White lab coat over dark military 
uniform (medals visible on uniform). Standing in office, family photo 
visible on desk behind him (mother's photo, important detail). 
Authoritative posture, hands behind back or one hand on desk. 
Serious expression, intelligent, calculating.

Professional photography, cinematic lighting, desaturated tones, 
underground base office aesthetic, Blade Runner 2049 style.`,
    keyFeatures: [
      "White PEARL goatee (not gray, not brown - PEARL WHITE)",
      "Twirled mustache (villain detail)",
      "Sharp intelligent eyes (gray-blue color)",
      "Lab coat over uniform (scientist authority)",
      "Family photo visible (mother, important prop)",
      "Age: 50s (not too young, not elderly)",
    ],
    aspectRatio: '1:1'
  },
  'Jamie Jackson': {
    prompt: `Portrait of young woman military interrogator. 23 years old, athletic 
build, determined expression. Dark circles under eyes (exhausted from 
poor sleep, struggling). Hair in tight professional bun (severe, 
controlled). Dark suit (black or charcoal gray, professional interrogator 
attire), white shirt underneath. Standing or seated at table, posture 
upright (military bearing). Neutral serious expression, focused, 
intelligent gaze. Pale lighting (fluorescent overhead).

Professional photography, cinematic lighting, desaturated 40%, 
interrogation room or office setting, Blade Runner 2049 aesthetic.`,
    keyFeatures: [
      "Age: Looks 23 (young, not teenager, not 30s)",
      "Dark circles under eyes (exhausted, visible)",
      "Hair in tight bun (professional, severe)",
      "Dark suit (black/charcoal, professional)",
      "Athletic build (fit, not thin, not heavy)",
      "Serious determined expression (not smiling)",
    ],
    aspectRatio: '1:1'
  },
  'Grandma Duncan': {
    prompt: `Portrait of elderly woman in hospital bed. Kind warm grandmother face, 
genuine smile, loving expression. White/gray hair, elderly 70s but 
healthy (not frail). Sitting up in hospital bed, wearing hospital gown. 
Purple bell flower arrangements visible surrounding her (on nightstand, 
windowsill, multiple vases). Natural warm window light illuminating 
face (soft, golden, angelic quality). Peaceful, comfortable atmosphere.

Professional photography, cinematic lighting, saturated colors 80% 
(normal life, warm tones), hospital room setting, soft focus background.`,
    keyFeatures: [
      "Elderly (70s) but healthy (not frail)",
      "Kind warm smile (genuine, loving)",
      "Purple bell flowers SURROUNDING HER (critical visual motif)",
      "Warm natural lighting (golden, soft)",
      "Hospital gown visible",
      "Peaceful comfortable expression",
    ],
    aspectRatio: '1:1'
  },
};