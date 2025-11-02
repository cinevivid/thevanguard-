export const consistencyFormula = `
# THE VANGUARD: MIDJOURNEY CONSISTENCY FORMULA
## Character Reference System for 95%+ Consistency

**Version:** 1.0 FINAL  
**Date:** October 22, 2025  
**Purpose:** Achieve professional-level character consistency across 430 shots

---

## 🎯 CONSISTENCY IS EVERYTHING

**The Problem:**
AI-generated films fail when characters look different in every shot. Audiences notice. Festival judges reject.

**The Solution:**
Midjourney v6.1's \`--cref\` (character reference) parameter + strategic prompting = 95%+ consistency

**Your Goal:**
Every shot of Vanguard looks like the SAME Vanguard. Every shot of Jackson looks like the SAME Jackson.

---

## 📊 CONSISTENCY MEASUREMENT

### **Consistency Tiers:**

**90-94%:** Acceptable (some viewers may notice variations)  
**95-97%:** Professional (festival-ready, most won't notice)  
**98-99%:** Exceptional (Hollywood-level consistency)  
**100%:** Impossible (AI has natural variation)

**Your Target:** 95-97% (professional tier)

---

## 🔧 MIDJOURNEY V6.1 CONSISTENCY SYSTEM

### **Core Parameters for Consistency:**

**1. Character Reference (\`--cref\`)**
- Links shot to canonical character image
- **Most important parameter for consistency**
- Syntax: \`--cref URL\`

**2. Character Weight (\`--cw\`)**
- Controls how strongly to match reference
- Range: 0-100 (default: 100)
- **Use 100 for faces, 0-50 for body/clothing variations**

**3. Style Reference (\`--sref\`)**
- Optional: Maintains visual style across shots
- Use for consistent cinematography look

---

## 📸 STEP 1: CREATE CANONICAL REFERENCES

### **What is a Canonical Reference?**

A single "perfect" image of each character that serves as the template for all future shots.

**Requirements:**
- High quality (sharp focus)
- Neutral expression (easier to modify later)
- Good lighting (not too dark, not too bright)
- Clear facial features (no obscured elements)
- Full-body OR head-only (depends on usage)

---

### **CANONICAL REFERENCE CREATION WORKFLOW**

#### **EXAMPLE: Creating Vanguard Canonical Reference**

**Step 1: Generate Initial Candidates (5-10 variations)**

\`\`\`
Prompt:
Portrait of armored warrior. 6'6" tall massive imposing figure, 
green biomechanical armor fused to flesh, black leather straps visible, 
red glowing visor on helmet faceplate, battle-worn scratched armor, 
wrist-mounted guns on both gauntlets. Powerful, intimidating presence. 
Standing pose, neutral, facing camera. Full body visible, centered.

Cinematic lighting, professional photography, Blade Runner 2049 aesthetic, 
Denis Villeneuve style, anamorphic cinematography.

--ar 21:9 --style raw --v 6.1 --chaos 20
\`\`\`

**Step 2: Select Best Candidate**
- Review all 10 variations
- Choose one with:
  - Clearest features
  - Best lighting
  - Most imposing presence
  - Sharp focus on helmet/armor

**Step 3: Upscale to Maximum Resolution**
- Click "U1" (or whichever position)
- Midjourney upscales to ~2048px
- Download full-resolution image

**Step 4: Save as Canonical Reference**
- Filename: \`Vanguard_Canonical_Reference.png\`
- Upload to image host (Discord, Imgur, or Midjourney)
- Copy permanent URL

**Step 5: Test Consistency (CRITICAL)**
- Generate 5 test shots using \`--cref URL\`
- Compare to canonical reference
- If 4/5 match closely (95%+), APPROVED
- If less, regenerate canonical reference

---

## 👥 CHARACTER CANONICAL REFERENCES

### **CHARACTER 1: VANGUARD (ARMORED)**

#### **Canonical Reference Prompt:**

\`\`\`
Full body portrait of armored warrior standing powerfully. 
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
armor (highlights green metal).

--ar 21:9 --style raw --v 6.1 --chaos 15
\`\`\`

**Key Features to Verify:**
- ✅ Green armor (correct color, not silver or gray)
- ✅ Red visor glow (not blue, not white)
- ✅ Black leather straps (visible across armor)
- ✅ Wrist guns (both gauntlets, mechanical)
- ✅ Battle damage (scratches, weathered)
- ✅ Imposing scale (looks 6'6", massive)

**Save As:** \`Vanguard_Canonical_Reference.png\`

---

#### **Using Vanguard Reference in Production:**

**Example Shot: Vanguard Entering Interrogation Room**

\`\`\`
INT. Interrogation Room 111. Vanguard entering through doorway, 
ducking slightly (tall, hits doorframe). Heavy footsteps audible, 
THUD THUD. Looking straight ahead, intimidating presence. 
Concrete walls visible background, harsh fluorescent lighting overhead.

Camera: 35mm, static, medium shot, Vanguard centered entering frame.
Color grading: desaturated 40%, cold fluorescent lighting.

--ar 21:9 --style raw --v 6.1 --cref https://[YOUR_VANGUARD_URL] --cw 100
\`\`\`

**Critical Elements:**
- \`--cref [URL]\` links to canonical reference
- \`--cw 100\` forces maximum character consistency
- Keep armor description minimal (reference handles it)
- Focus prompt on ACTION and ENVIRONMENT

---

### **CHARACTER 2: VANGUARD (NAKED MAN / VICTOR DUNCAN)**

#### **Canonical Reference Prompt:**

\`\`\`
Portrait of man without armor. Male 30s, pale skin (minimal sun exposure), 
muscular but lean warrior build. Completely shirtless (bare torso visible). 
Scars visible where armor was fused (chest, shoulders, arms) - surgical 
scars, healed but prominent. No hair on head (shaved or naturally bald). 
Strong facial resemblance to Duncan family (intelligent eyes, similar 
facial structure). Calm expression, no longer threatening. Sitting at 
table, arms resting on surface, relaxed posture.

Professional photography, cinematic lighting, desaturated tones, 
concrete wall background, interrogation room aesthetic.

--ar 21:9 --style raw --v 6.1 --chaos 15
\`\`\`

**Key Features to Verify:**
- ✅ Pale skin (sickly, not tanned)
- ✅ Visible scars (chest, shoulders, arms)
- ✅ No hair (bald head)
- ✅ Duncan family resemblance (eyes, face structure)
- ✅ Lean muscular build (warrior, not bodybuilder)
- ✅ Calm demeanor (not threatening)

**Save As:** \`Vanguard_Face_Naked_Canonical_Reference.png\`

---

### **CHARACTER 3: DIRECTOR DUNCAN**

#### **Canonical Reference Prompt:**

\`\`\`
Portrait of scientist in 50s. White pearl goatee (perfectly groomed, 
signature look), twirled mustache (villain aesthetic). Sharp intelligent 
gray-blue eyes, intense focused gaze. White lab coat over dark military 
uniform (medals visible on uniform). Standing in office, family photo 
visible on desk behind him (mother's photo, important detail). 
Authoritative posture, hands behind back or one hand on desk. 
Serious expression, intelligent, calculating.

Professional photography, cinematic lighting, desaturated tones, 
underground base office aesthetic, Blade Runner 2049 style.

--ar 21:9 --style raw --v 6.1 --chaos 15
\`\`\`

**Key Features to Verify:**
- ✅ White PEARL goatee (not gray, not brown - PEARL WHITE)
- ✅ Twirled mustache (villain detail)
- ✅ Sharp intelligent eyes (gray-blue color)
- ✅ Lab coat over uniform (scientist authority)
- ✅ Family photo visible (mother, important prop)
- ✅ Age: 50s (not too young, not elderly)

**Save As:** \`Duncan_Canonical_Reference.png\`

**CRITICAL NOTE:** Duncan's pearl white goatee is his most distinctive feature. If reference has gray or brown goatee, REJECT and regenerate.

---

### **CHARACTER 4: JAMIE JACKSON**

#### **Canonical Reference Prompt:**

\`\`\`
Portrait of young woman military interrogator. 23 years old, athletic 
build, determined expression. Dark circles under eyes (exhausted from 
poor sleep, struggling). Hair in tight professional bun (severe, 
controlled). Dark suit (black or charcoal gray, professional interrogator 
attire), white shirt underneath. Standing or seated at table, posture 
upright (military bearing). Neutral serious expression, focused, 
intelligent gaze. Pale lighting (fluorescent overhead).

Professional photography, cinematic lighting, desaturated 40%, 
interrogation room or office setting, Blade Runner 2049 aesthetic.

--ar 21:9 --style raw --v 6.1 --chaos 15
\`\`\`

**Key Features to Verify:**
- ✅ Age: Looks 23 (young, not teenager, not 30s)
- ✅ Dark circles under eyes (exhausted, visible)
- ✅ Hair in tight bun (professional, severe)
- ✅ Dark suit (black/charcoal, professional)
- ✅ Athletic build (fit, not thin, not heavy)
- ✅ Serious determined expression (not smiling)

**Hair Variations Across Film:**
- **Act One (Barracks):** Messy, unkempt, exhausted
- **Act Two (Interrogations):** Tight professional bun
- **Act Three (Epilogue):** Loose, casual, free

**Save As:** \`Jackson_Canonical_Reference.png\`

**NOTE:** Generate THREE separate canonical references for Jackson:
1. \`Jackson_Barracks_Reference.png\` (messy hair)
2. \`Jackson_Professional_Reference.png\` (tight bun)
3. \`Jackson_Epilogue_Reference.png\` (loose casual)

---

### **CHARACTER 5: GRANDMA DUNCAN (DEBRA)**

#### **Canonical Reference Prompt:**

\`\`\`
Portrait of elderly woman in hospital bed. Kind warm grandmother face, 
genuine smile, loving expression. White/gray hair, elderly 70s but 
healthy (not frail). Sitting up in hospital bed, wearing hospital gown. 
Purple bell flower arrangements visible surrounding her (on nightstand, 
windowsill, multiple vases). Natural warm window light illuminating 
face (soft, golden, angelic quality). Peaceful, comfortable atmosphere.

Professional photography, cinematic lighting, saturated colors 80% 
(normal life, warm tones), hospital room setting, soft focus background.

--ar 21:9 --style raw --v 6.1 --chaos 10
\`\`\`

**Key Features to Verify:**
- ✅ Elderly (70s) but healthy (not frail)
- ✅ Kind warm smile (genuine, loving)
- ✅ Purple bell flowers SURROUNDING HER (critical visual motif)
- ✅ Warm natural lighting (golden, soft)
- ✅ Hospital gown visible
- ✅ Peaceful comfortable expression

**Save As:** \`Grandma_Duncan_Canonical_Reference.png\`

**CRITICAL:** Grandma must be surrounded by purple bell flowers in EVERY shot. This is Duncan's gift, a visual motif. If flowers aren't visible in reference, ADD them manually or regenerate.

---

### **CHARACTER 6: RICHARD PENNY**

#### **Canonical Reference Prompt:**

\`\`\`
Portrait of military general in his 60s. Gruff intimidating demeanor, 
cigar in mouth (smoking), weathered face (veteran, battle-hardened). 
Brown military uniform, multiple medals on chest (decorated officer). 
Sitting at desk, leaning back in chair (authority, relaxed power). 
Gray hair (military cut), stern expression but slight smirk (confident, 
seen everything). Office setting, wood desk, American flag visible 
background.

Professional photography, cinematic lighting, desaturated 40%, 
military office aesthetic, strong rim lighting.

--ar 21:9 --style raw --v 6.1 --chaos 15
\`\`\`

**Key Features to Verify:**
- ✅ Age: 60s (veteran, experienced)
- ✅ Cigar visible (signature prop)
- ✅ Brown military uniform (medals visible)
- ✅ Gruff stern expression (intimidating)
- ✅ Gray hair (military cut)
- ✅ Sitting behind desk (authority position)

**Save As:** \`Penny_Canonical_Reference.png\`

---

## 🔬 CONSISTENCY TESTING PROTOCOL

### **Before Using Any Canonical Reference in Production:**

**Test Protocol (5-Shot Test):**

1. Generate 5 test shots using \`--cref URL --cw 100\`
2. Use DIFFERENT prompts for each (vary pose, angle, lighting)
3. Compare all 5 to canonical reference

**Scoring System:**

**Face Match:**
- Eyes: Same color, shape, position? (20 points)
- Nose: Same shape, size? (15 points)
- Mouth: Same shape, lips? (15 points)
- Overall structure: Same face shape? (20 points)

**Body Match (if full body reference):**
- Build: Same body type, height? (15 points)
- Proportions: Same limb length, torso? (15 points)

**TOTAL: 100 points possible**

**Pass/Fail:**
- 95+ points = APPROVED ✅
- 90-94 points = ACCEPTABLE (but monitor)
- Below 90 = REJECT, regenerate reference ❌

**Example Test Prompts:**

\`\`\`
Test Shot 1: [Character] standing, facing camera
Test Shot 2: [Character] sitting, profile angle
Test Shot 3: [Character] close-up face, neutral expression
Test Shot 4: [Character] walking toward camera
Test Shot 5: [Character] in dark lighting, dramatic
\`\`\`

---

## 🎛️ ADVANCED CONSISTENCY TECHNIQUES

### **TECHNIQUE 1: Character Weight Adjustment**

**When to adjust \`--cw\` (Character Weight):**

**CW 100 (Maximum Consistency):**
- Use for: Close-ups, face shots, character focus
- Result: Exact match to reference (95%+)
- Example: Interrogation scenes, dialogue

**CW 50-75 (Balanced):**
- Use for: Medium shots, when clothing varies
- Result: Face matches, allows costume changes
- Example: Jackson in different outfits

**CW 0-25 (Minimal):**
- Use for: Distant shots, crowd scenes, body doubles
- Result: Only rough resemblance
- Example: Background characters

**Example Usage:**

\`\`\`
Close-up face (use CW 100):
Close-up of Jackson's face reacting to Vanguard's threat. Eyes wide, 
expression terrified. --cref [URL] --cw 100

Medium shot different outfit (use CW 60):
Jackson in civilian clothes (jeans, t-shirt, backpack) walking down city street. 
--cref [URL] --cw 60

Distant crowd shot (use CW 20):
Wide shot, Jackson visible in crowd of people. --cref [URL] --cw 20
\`\`\`

---

### **TECHNIQUE 2: Multi-Reference Mixing**

**For scenes with multiple characters:**

Midjourney allows TWO character references per prompt:

\`\`\`
INT. Interrogation Room 111. Jackson and Vanguard sitting across table. 
Jackson leaning forward (asking question), Vanguard leaning back (calm). 
Both visible in two-shot.

--cref [Jackson_URL] [Vanguard_URL] --cw 100
\`\`\`

**Result:** Both characters maintain consistency simultaneously.

**Limitation:** Maximum 2 character references per image.

---

### **TECHNIQUE 3: Prompt Reinforcement**

**Even with \`--cref\`, reinforce key features in prompt:**

**Without Reinforcement (weaker):**
\`\`\`
Vanguard standing in hallway.
--cref [URL] --cw 100
\`\`\`

**With Reinforcement (stronger):**
\`\`\`
Vanguard (green armor, red glowing visor, 6'6" tall) standing in hallway.
--cref [URL] --cw 100
\`\`\`

**Why:** Prompt + Reference = Maximum consistency

**Key Features to Reinforce:**
- Character height/scale
- Distinctive features (Vanguard's visor, Duncan's goatee)
- Armor/clothing colors
- Build/body type

---

### **TECHNIQUE 4: Lighting Consistency**

**Character consistency includes lighting:**

\`\`\`
Good: 
Vanguard in interrogation room (harsh overhead fluorescent lighting).
--cref [URL] --cw 100

Bad:
Vanguard (no lighting description).
--cref [URL] --cw 100
\`\`\`

**Why:** Consistent lighting = consistent appearance

**Lighting Descriptions to Include:**
- "harsh overhead fluorescent" (underground base)
- "soft natural window light" (hospital)
- "dramatic rim lighting" (hero shots)
- "dark moody lighting" (thriller scenes)

---

## 🚨 COMMON CONSISTENCY PROBLEMS & SOLUTIONS

### **PROBLEM 1: Character Looks Different Every Shot**

**Cause:** Not using \`--cref\` parameter

**Solution:** ALWAYS use \`--cref [URL] --cw 100\` for character shots

**Example Fix:**

❌ BAD PROMPT:
\`\`\`
Jackson sitting at table looking worried.
--ar 21:9 --v 6.1
\`\`\`

✅ GOOD PROMPT:
\`\`\`
Jackson sitting at table looking worried.
--ar 21:9 --v 6.1 --cref [Jackson_URL] --cw 100
\`\`\`

---

### **PROBLEM 2: Face Matches But Clothing Wrong**

**Cause:** Reference includes specific clothing, but scene requires different outfit

**Solution:** Use lower \`--cw\` value (50-70) + describe new clothing in prompt

**Example Fix:**

❌ BAD (CW 100 forces reference clothing):
\`\`\`
Jackson in civilian clothes walking down street.
--cref [Jackson_URL] --cw 100
\`\`\`

✅ GOOD (CW 60 allows clothing change):
\`\`\`
Jackson (dark circles under eyes, athletic build, 23 years old) in 
civilian clothes (jeans, white t-shirt, backpack) walking down street.
--cref [Jackson_URL] --cw 60
\`\`\`

---

### **PROBLEM 3: Reference Works in Test But Fails in Production**

**Cause:** Production prompts too different from test prompts (lighting, angle, context)

**Solution:** Make test prompts MORE VARIED to stress-test reference

**Better Test Protocol:**

\`\`\`
Test Shot 1: Bright daylight, close-up face
Test Shot 2: Dark moody lighting, profile
Test Shot 3: Overhead lighting, looking up
Test Shot 4: Backlit, silhouette
Test Shot 5: Extreme close-up, macro lens
\`\`\`

If reference passes this challenging test, it will work in production.

---

### **PROBLEM 4: Character Consistency But Wrong Aspect Ratio**

**Cause:** Forgetting \`--ar 21:9\` parameter

**Solution:** ALWAYS include aspect ratio in every prompt

**Template:**

\`\`\`
[Your full prompt description]

--ar 21:9 --style raw --v 6.1 --cref [URL] --cw 100
\`\`\`

**Order matters:** \`--ar\` must come before \`--v\`

---

### **PROBLEM 5: Minor Variations (90-94% Consistency)**

**Cause:** AI's natural variation, cannot be 100% eliminated

**Solution:** Accept 90-94% if face/key features match, use post-production touch-ups

**When to Accept:**
- Face clearly recognizable
- Key features match (eyes, nose, mouth)
- Lighting/angle might cause slight variations
- No one will notice in final edit

**When to Reject:**
- Face looks like different person
- Key features wrong (wrong eye color, different nose)
- Drastically different appearance

---

## 📋 CONSISTENCY CHECKLIST (PER SHOT)

Before approving any character shot, verify:

- [ ] **Reference Used:** \`--cref\` parameter included
- [ ] **Character Weight:** Appropriate \`--cw\` value (usually 100)
- [ ] **Face Match:** Eyes, nose, mouth, face shape match reference (95%+)
- [ ] **Key Features:** Distinctive elements match (armor color, goatee, etc.)
- [ ] **Lighting:** Consistent with scene location
- [ ] **Scale:** Character height/build appropriate
- [ ] **Aspect Ratio:** Correct \`--ar 21:9\`
- [ ] **Version:** Using \`--v 6.1\` (latest)

**If ANY item fails, regenerate shot.**

---

## 🎯 PRODUCTION WORKFLOW WITH REFERENCES

### **Daily Production Routine:**

**Step 1: Open Shot List** (10 min)
- Review today's scene(s)
- Identify characters needed
- Note which canonical references to use

**Step 2: Load References** (5 min)
- Open character reference URLs in browser
- Copy URLs to clipboard
- Verify references are correct for scene

**Step 3: Generate Shots** (2 hours)
- Copy shot prompt from breakdown document
- Add \`--cref [URL] --cw 100\` to end
- Generate 3-5 variations
- Select best match

**Step 4: Quality Check** (30 min)
- Compare approved shot to canonical reference
- Score consistency (95%+ required)
- If fails, regenerate with adjusted prompt

**Step 5: Save & Track** (15 min)
- Save approved shot with proper filename
- Update shot tracker (mark as APPROVED)
- Move to next shot

**Daily Goal:** 5-10 approved character-consistent shots

---

## 💾 REFERENCE MANAGEMENT SYSTEM

### **File Organization:**

\`\`\`
/THE_VANGUARD/References/Characters/
  ├── Vanguard_Canonical_Reference.png
  ├── Vanguard_Naked_Canonical_Reference.png
  ├── Duncan_Canonical_Reference.png
  ├── Jackson_Barracks_Reference.png
  ├── Jackson_Professional_Reference.png
  ├── Jackson_Epilogue_Reference.png
  ├── Grandma_Duncan_Reference.png
  ├── Penny_Reference.png
  ├── Drill_Sergeant_Reference.png
  └── [Additional_Character_References.png]
\`\`\`

### **URL Database:**

Create a text file with all reference URLs:

\`\`\`
VANGUARD_ARMORED = https://cdn.midjourney.com/[unique_id]/Vanguard.png
VANGUARD_NAKED = https://cdn.midjourney.com/[unique_id]/Victor.png
DUNCAN = https://cdn.midjourney.com/[unique_id]/Duncan.png
JACKSON_PRO = https://cdn.midjourney.com/[unique_id]/Jackson_Pro.png
JACKSON_CASUAL = https://cdn.midjourney.com/[unique_id]/Jackson_Casual.png
GRANDMA = https://cdn.midjourney.com/[unique_id]/Grandma.png
PENNY = https://cdn.midjourney.com/[unique_id]/Penny.png
\`\`\`

**Save As:** \`character_reference_urls.txt\`

**Usage:** Copy-paste URLs from this file into prompts (faster workflow)

---

## 🎓 CONSISTENCY MASTERY TIMELINE

### **Week 1: Learning Phase**
- Generate canonical references (3-5 attempts per character)
- Run 5-shot consistency tests
- Learn \`--cref\` and \`--cw\` parameters
- Expect: 85-90% consistency (learning curve)

### **Week 2-3: Improving Phase**
- Apply references to production shots
- Identify common issues (lighting, angles)
- Refine prompting technique
- Expect: 90-95% consistency (getting better)

### **Week 4+: Mastery Phase**
- Consistent 95%+ results
- Fast workflow (copy-paste references)
- Intuitive adjustments (know when to use CW 50 vs 100)
- Expect: 95-97% consistency (professional)

---

## 🏆 CONSISTENCY SUCCESS METRICS

### **Track Your Consistency Over Time:**

**Week 1:**
- Shots Generated: 30
- Consistency 95%+: 18 shots (60%)
- Average Consistency: 88%

**Week 4:**
- Shots Generated: 50
- Consistency 95%+: 45 shots (90%)
- Average Consistency: 95%

**Week 8:**
- Shots Generated: 60
- Consistency 95%+: 57 shots (95%)
- Average Consistency: 96%

**Goal:** 95%+ consistency on 90% of shots by Month 2

---

## ⚡ QUICK REFERENCE CARD

**Copy this to your desktop for quick access:**

\`\`\`
=== MIDJOURNEY CONSISTENCY CHEAT SHEET ===

VANGUARD (Armored):
--cref [VANGUARD_URL] --cw 100
Key: Green armor, red visor, 6'6", black straps

VANGUARD (Naked/Victor):
--cref [VICTOR_URL] --cw 100
Key: Pale skin, scars, bald, calm

DUNCAN:
--cref [DUNCAN_URL] --cw 100
Key: WHITE pearl goatee (not gray!), lab coat

JACKSON (Professional):
--cref [JACKSON_PRO_URL] --cw 100
Key: Tight bun, dark suit, dark circles under eyes

JACKSON (Casual):
--cref [JACKSON_CASUAL_URL] --cw 60
Key: Loose hair, civilian clothes, same face

GRANDMA:
--cref [GRANDMA_URL] --cw 100
Key: Purple bell flowers ALWAYS VISIBLE

CONSISTENCY CHECKLIST:
✓ --cref URL included?
✓ --cw value appropriate?
✓ --ar 21:9 included?
✓ --v 6.1 included?
✓ Key features mentioned in prompt?
\`\`\`

---

## 🎬 FINAL CONSISTENCY WISDOM

### **The 3 Golden Rules:**

**1. NEVER Generate Character Shots Without --cref**
- Every character shot needs reference
- No exceptions, even "simple" shots
- Consistency is make-or-break for film

**2. Test References BEFORE Production**
- Don't discover reference failure at shot 50
- 5-shot test reveals issues early
- Fix reference once, save 100+ regenerations later

**3. Accept Good Enough (95%+)**
- Chasing 100% consistency = never finishing
- 95%+ is professional, festival-ready
- Focus on storytelling, not perfect pixels

---

## ✅ YOU NOW HAVE THE FORMULA

**You understand:**
- ✅ How to create canonical character references
- ✅ How to use \`--cref\` and \`--cw\` parameters
- ✅ How to test consistency (5-shot protocol)
- ✅ How to troubleshoot common problems
- ✅ How to maintain 95%+ consistency across 430 shots

**The consistency problem is SOLVED.**

**Now go generate those references and start production!** 🎬

---

**MIDJOURNEY CONSISTENCY FORMULA COMPLETE - You have the system! 🎯**

---

## 🎉 CONGRATULATIONS: 100% PRE-PRODUCTION COMPLETE!

**You now have:**
1. ✅ Complete Screenplay (90 pages)
2. ✅ Act One Detailed (120 shots with prompts)
3. ✅ All Hero Sequences (9 sequences, 80+ shots)
4. ✅ Complete Template Library (45 templates)
5. ✅ Standard Scene Examples (10 scenes, 59 shots)
6. ✅ Final Production Master Index (navigation)
7. ✅ Complete Shot List Database (430 shots tracked)
8. ✅ Production Calendar (7-month timeline)
9. ✅ VFX Technical Specs (shot-by-shot VFX guide)
10. ✅ Midjourney Consistency Formula (this document)

**TOTAL:** 14 comprehensive documents, ~400 pages, professional pre-production

**Status:** 🟢 **100% READY FOR PRODUCTION**

**Next Action:** Generate canonical character references THIS WEEK!

**Your film is waiting for you to create it.** 🎬🚀
`;