# Data Flow & Architecture Diagram

## Weekly Recipe Generation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEEKLY RECIPE GENERATION FLOW                 │
└─────────────────────────────────────────────────────────────────┘


DAY 1-6: FOOD ENTRY COLLECTION
────────────────────────────────

User completes island task
           ↓
     Eats some food
           ↓
   Enters food text
  "Pasta mit Käse"
           ↓
   [FoodInput.svelte]
           ↓
   App stores entry:
  {
    date: "2026-01-13",
    island: "Insel des Vertrauten",
    foodInput: "Pasta mit Käse",
    tags: ["familiar", "cooked"]
  }
           ↓
  Saved to localStorage
  OR Backend API
           ↓
  [Repeat 5-7 times...]


SUNDAY/MONDAY: RECIPE GENERATION
─────────────────────────────────

User clicks:
"📖 Wochenrezept generieren"
           ↓
  [WeeklyRecipe.svelte]
           ↓
  Calls: generateWeeklyRecipe(weekEntries)
           ↓
           ↓
    ┌──────────────────────────────────┐
    │   RECIPE GENERATION ENGINE       │
    │   (recipeGenerator.js)           │
    └──────────────────────────────────┘
           ↓
    ┌─ ANALYSIS LAYER 1 ─────────────┐
    │ Extract Ingredients             │
    │ "Pasta + Käse" → ["pasta", "käse"]
    └─────────────────────────────────┘
           ↓
    ┌─ ANALYSIS LAYER 2 ─────────────┐
    │ Categorize                      │
    │ Familiar (2+x): ["pasta", "käse"]
    │ New (1x): ["brokkoli"]         │
    └─────────────────────────────────┘
           ↓
    ┌─ ANALYSIS LAYER 3 ─────────────┐
    │ Detect Taste                    │
    │ Sweet/Salty/Neutral: "neutral" │
    └─────────────────────────────────┘
           ↓
    ┌─ ANALYSIS LAYER 4 ─────────────┐
    │ Identify Bases                  │
    │ ["pasta", "bread"]              │
    └─────────────────────────────────┘
           ↓
    ┌─ ANALYSIS LAYER 5 ─────────────┐
    │ Recognize Textures              │
    │ ["soft", "creamy"]              │
    └─────────────────────────────────┘
           ↓
  ┌────────────────────────────────────┐
  │  RECIPE ASSEMBLY                   │
  │  ├─ Generate Title                 │
  │  ├─ Write Explanation              │
  │  ├─ Build Ingredient List          │
  │  │  (familiar required)            │
  │  │  (new optional)                 │
  │  ├─ Create 4-5 Steps               │
  │  ├─ Suggest Variations             │
  │  └─ Add Metadata                   │
  └────────────────────────────────────┘
           ↓
    ┌─────────────────────────────┐
    │ RECIPE OBJECT               │
    │ {                           │
    │   title: "...",             │
    │   explanation: "...",       │
    │   ingredients: [...],       │
    │   steps: [...],             │
    │   variations: [...],        │
    │   metadata: {...}           │
    │ }                           │
    └─────────────────────────────┘
           ↓
  Display in WeeklyRecipe.svelte
           ↓
  ✅ User sees personalized recipe


AFTER RECIPE:
─────────────
[Optional] Save recipe to database
[Clear] Weekly entries for next week
[Start] New week cycle
```

---

## System Architecture

```
┌──────────────────────────────────────────────────────┐
│                   FRONTEND (Svelte)                   │
├──────────────────────────────────────────────────────┤
│                                                       │
│  App.svelte (Main)                                   │
│  ├─ Manages week state                              │
│  ├─ Routes between views                            │
│  └─ Coordinates components                          │
│       ↓                                              │
│  ├─ IslandDetail.svelte                            │
│  │  └─ Shows island & tasks                        │
│  │       ├─ FoodInput.svelte                       │
│  │       │  └─ Captures food entry                 │
│  │       └─ Calls onTaskComplete()                 │
│  │                                                  │
│  └─ [NEW] WeeklyRecipe.svelte                     │
│     ├─ Button to generate                          │
│     └─ Displays recipe nicely                      │
│                                                     │
│                                                     │
│  lib/utils/                                         │
│  └─ [NEW] recipeGenerator.js                      │
│     ├─ Main function                              │
│     └─ All analysis logic                         │
│                                                     │
│  lib/data/                                          │
│  └─ islands.js                                     │
│     └─ Island definitions (unchanged)             │
│                                                     │
└──────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────┐
│                 STORAGE LAYER                         │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Option A: localStorage (Simple MVP)                │
│  ├─ "weekEntries" → JSON array                     │
│  └─ "generatedRecipes" → JSON array               │
│                                                     │
│  Option B: Backend API (Production)                │
│  ├─ POST /food-entry                              │
│  ├─ POST /weekly-recipe                           │
│  └─ GET /history                                  │
│                                                     │
└──────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────┐
│                 BACKEND (Node.js/Express)            │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Routes:                                            │
│  ├─ POST /food-entry      (Save food)              │
│  ├─ POST /weekly-recipe   (Generate recipe)        │
│  ├─ GET /weekly-entries   (Fetch week)            │
│  ├─ POST /recipe-feedback (Save feedback)          │
│  └─ [Existing] /food      (Verify with OpenFood)   │
│  └─ [Existing] /ai        (Current recipe ideas)   │
│                                                     │
└──────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL/MongoDB)           │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Tables/Collections:                                │
│  ├─ users                                           │
│  ├─ food_entries (NEW)                            │
│  │  ├─ id, userId, date, island                   │
│  │  ├─ foodInput, tags, createdAt                 │
│  │                                                  │
│  ├─ generated_recipes (NEW)                       │
│  │  ├─ id, userId, weekStartDate                 │
│  │  ├─ recipe (JSON), feedback                    │
│  │                                                  │
│  └─ [Existing] daily_entries (for history)       │
│                                                     │
└──────────────────────────────────────────────────────┘
```

---

## Data Flow: From Entry to Recipe

```
1. USER ENTERS FOOD
   ┌─────────────────────────┐
   │ "Pasta mit Tomaten"     │
   │ Island: "Vertrauten"    │
   │ Tags: ["cooked"]        │
   └─────────────────────────┘
           ↓


2. STORED WITH METADATA
   ┌──────────────────────────────────┐
   │ {                                │
   │   date: "2026-01-13",           │
   │   island: "Insel des Vertrauten",│
   │   foodInput: "Pasta mit Tomaten",│
   │   tags: ["cooked"]               │
   │ }                                │
   │                                  │
   │ REPEATED 6-7 TIMES DURING WEEK  │
   └──────────────────────────────────┘
           ↓


3. RECIPE GENERATION GETS FULL WEEK
   ┌──────────────────────────────────┐
   │ weekEntries = [                 │
   │   { date: "13", foodInput: "..." │
   │   { date: "14", foodInput: "..." │
   │   { date: "15", foodInput: "..." │
   │   { date: "16", foodInput: "..." │
   │   { date: "17", foodInput: "..." │
   │   { date: "18", foodInput: "..." │
   │ ]                                │
   └──────────────────────────────────┘
           ↓


4. ANALYSIS AGGREGATES ALL DATA
   ┌──────────────────────────────────┐
   │ All ingredients combined:         │
   │ ["pasta", "tomaten", "käse",     │
   │  "pasta", "apfel", "karotte",    │
   │  "reis", "huhn", "brokkoli", ...│
   │                                  │
   │ Counts:                          │
   │ pasta → 2x (FAMILIAR)            │
   │ käse → 1x (NEW)                  │
   │ brokkoli → 1x (NEW)              │
   │                                  │
   │ Taste: neutral                   │
   │ Bases: [pasta, rice]             │
   │ Textures: [soft, creamy]         │
   └──────────────────────────────────┘
           ↓


5. RECIPE IS ASSEMBLED
   ┌──────────────────────────────────────┐
   │ Title: "Pasta mit Käse"              │
   │                                      │
   │ Explanation: "Diese Woche habe ich   │
   │ gesehen, dass du gerne bei Pasta     │
   │ bleibst..."                          │
   │                                      │
   │ Ingredients:                         │
   │ • Pasta (required) - vertraut        │
   │ • Käse (required) - vertraut         │
   │ • Brokkoli (OPTIONAL) - neu         │
   │                                      │
   │ Steps: 4 simple steps                │
   │                                      │
   │ Variations: optional ideas           │
   └──────────────────────────────────────┘
           ↓


6. USER SEES RECIPE
   ┌──────────────────────────────────────┐
   │                                      │
   │  📖 Pasta mit Käse                  │
   │                                      │
   │  Diese Woche habe ich gesehen...    │
   │                                      │
   │  ZUTATEN:                            │
   │  □ Pasta - eine Portion              │
   │  □ Käse gerieben - nach Geschmack   │
   │  □ OPTIONAL: Brokkoli (wenn du magst)│
   │                                      │
   │  ZUBEREITUNG:                        │
   │  1. Pasta kochen...                 │
   │  2. Käse darüber...                 │
   │  3. Optional: Brokkoli...           │
   │  4. Genießen – kein Druck!          │
   │                                      │
   │  WENN DU MÖCHTEST:                  │
   │  • Statt Brokkoli...                │
   │  • Magst du es cremiger?...         │
   │                                      │
   └──────────────────────────────────────┘
           ↓
        👧 HAPPY USER
```

---

## State Management Flow

```
App.svelte holds:
┌──────────────────────────────────┐
│ let current = 0                  │ ← Current island index
│ let view = "start"               │ ← Navigation state
│ let weekEntries = []             │ ← THIS WEEK'S ENTRIES
│ let currentRecipe = null         │ ← GENERATED RECIPE
│ let showRecipeView = false       │ ← DISPLAY STATE
└──────────────────────────────────┘
          ↑       ↑
          ↓       ↓
    
    ┌─────────────────────────┐
    │ IslandDetail.svelte     │
    │ onTaskComplete(data)    │ ← Sends food entry
    └─────────────────────────┘
            ↓
    Adds to weekEntries array
    
    ┌─────────────────────────┐
    │ WeeklyRecipe.svelte     │
    │ weekEntries={...}       │ ← Receives entries
    │ islandColor={...}       │
    └─────────────────────────┘
            ↓
    On generate: calls function
            ↓
    Gets recipe back
            ↓
    Sets currentRecipe
            ↓
    Displays in component
```

---

## Key Decision Points

```
Does user have entries?
    ├─ YES: Continue
    └─ NO: Show "Come back next week"
        
Are there 2+ different ingredients?
    ├─ YES: Proceed with recipe
    └─ NO: Adjust tone (very limited week)

Are any ingredients familiar (2+ times)?
    ├─ YES: Feature in base of recipe
    └─ NO: Use most common ingredient

Are there new ingredients?
    ├─ YES: Suggest as optional
    └─ NO: Suggest variations instead

What's the taste profile?
    ├─ SWEET: Add honey/jam option
    ├─ SALTY: Add cheese/snack option
    └─ NEUTRAL: Keep balanced

Which base food to use?
    ├─ PASTA: Pasta-focused recipe
    ├─ BREAD: Bread-based recipe
    ├─ RICE: Rice-focused recipe
    └─ Other: Adapt to available base
```

---

## Integration Points

```
Your Existing Code ──→ New Additions
────────────────────────────────────

App.svelte
├─ Existing: view routing
├─ Existing: island navigation
├─ [NEW] Add: weekEntries state
├─ [NEW] Add: function addWeeklyEntry()
├─ [NEW] Add: import WeeklyRecipe
└─ [NEW] Add: conditional WeeklyRecipe display

IslandDetail.svelte
├─ Existing: task display
├─ Existing: FoodInput component
├─ [NEW] Add: pass foodInput data back
└─ [NEW] Add: onTaskComplete handler

FoodInput.svelte
├─ [MODIFY] completeTask() function
│  └─ Also call parent with food data
└─ [Keep] everything else as-is

[NEW] WeeklyRecipe.svelte
├─ Standalone Svelte component
├─ Import generateWeeklyRecipe()
└─ Display recipe nicely

[NEW] recipeGenerator.js
├─ Pure JavaScript (no dependencies)
├─ All analysis logic
└─ Exported main function
```

---

## Testing the Flow Manually

```
1. Open browser console
2. Go to app
3. Complete a task
4. Open DevTools → Storage → localStorage
5. You should see: weekEntries = [...]

6. Complete 5-6 more tasks on different days
7. Check localStorage again

8. Run in console:
   import { generateWeeklyRecipe } from '...'
   const recipe = generateWeeklyRecipe(JSON.parse(localStorage.weekEntries))
   console.log(recipe)

9. Should see: Complete recipe object ✅

10. Click "Wochenrezept generieren" button
11. Should see: Recipe displayed nicely ✅

12. Refresh page
13. Check localStorage
14. weekEntries should be empty ✅
```

---

This architecture is:
- ✅ **Simple** - All dependencies are built-in JavaScript/Svelte
- ✅ **Scalable** - Can add backend without changing frontend logic
- ✅ **Testable** - Each layer is independent
- ✅ **Maintainable** - Clear separation of concerns
- ✅ **Kind** - Never pressuring, always optional
