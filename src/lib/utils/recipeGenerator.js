/**
 * Wochenrezept-Generator für Food Explorer App
 * Kombiniert alle gesammelten Favoriten zu einem intelligenten Rezept
 */

export function generateWeeklyRecipe(weekEntries) {
  // Fallback wenn keine Einträge
  if (!weekEntries || weekEntries.length === 0) {
    return {
      title: "Dein Geheimrezept",
      introduction: "Diese Woche probierst du etwas ganz Besonderes!",
      ingredients: ["Deine Lieblingszutaten", "Etwas Neues zum Ausprobieren"],
      instructions: ["Lass dich überraschen!", "Mehr Abenteuer nächste Woche!"],
      tips: "Jede Woche wird es anders!"
    };
  }

  // Extrahiere Zutaten aus den Einträgen
  const ingredients = extractIngredients(weekEntries);
  const categories = categorizeByIsland(weekEntries);

  // Generiere Rezepttitel basierend auf Themen
  const title = generateTitle(categories);

  // Generiere Anleitung
  const instructions = generateInstructions(ingredients, categories);

  // Generiere Tipps
  const tips = generateTips(categories);

  return {
    title,
    introduction: `Aus deinen ${weekEntries.length} Lieblingsessen dieser Woche kreieren wir: "${title}"`,
    ingredients: ingredients.slice(0, 12), // Max 12 Zutaten
    instructions,
    tips
  };
}

/**
 * Extrahiert die Zutaten/Lebensmittel aus den Einträgen
 */
function extractIngredients(weekEntries) {
  const ingredients = new Set();

  weekEntries.forEach(entry => {
    // Hauptzutat
    if (entry.food) {
      ingredients.add(entry.food);
    }

    // Zusätzliche Zutaten je nach Kategorie
    const category = entry.islandCategory || "";

    if (category.includes("Süß")) {
      ingredients.add("Zucker oder Honig");
      ingredients.add("Butter");
    } else if (category.includes("Salz")) {
      ingredients.add("Öl");
      ingredients.add("Salz");
    } else if (category.includes("Frisch")) {
      ingredients.add("Frisches Wasser");
    } else if (category.includes("Protein")) {
      ingredients.add("Butter oder Öl");
    }
  });

  return Array.from(ingredients);
}

/**
 * Kategorisiert Einträge nach Island
 */
function categorizeByIsland(weekEntries) {
  const categories = {};

  weekEntries.forEach(entry => {
    const island = entry.islandCategory || "Sonstiges";
    if (!categories[island]) {
      categories[island] = [];
    }
    categories[island].push(entry.food);
  });

  return categories;
}

/**
 * Generiert einen intelligenten Rezepttitel
 */
function generateTitle(categories) {
  const titles = {
    "Fleisch- & Eierinsel": "Herzhaftes Protein-Rezept",
    "Gemüse- & Getreideinsel": "Buntes Gemüse-Getreide-Gericht",
    "Getränkeinsel": "Erfrischendes Getränke-Erlebnis",
    "Milchprodukteinsel": "Cremiges Milchprodukt-Abenteuer",
    "Obstinsel": "Fruchtiges Obst-Vergnügen"
  };

  const islandNames = Object.keys(categories);
  if (islandNames.length > 0) {
    return titles[islandNames[0]] || "Dein Wochenrezept";
  }
  return "Dein Wochenrezept";
}

/**
 * Generiert Zubereitungsschritte
 */
function generateInstructions(ingredients, categories) {
  const steps = [];

  // Schritt 1: Vorbereitung
  steps.push("Sammle alle deine Lieblingszutaten. Schau, wie farbenfroh sie sind!");

  // Schritt 2: Zubereitung basierend auf Zutaten
  if (ingredients.some(ing => ing.includes("Obst") || ing.includes("Apfel") || ing.includes("Erdbeere"))) {
    steps.push("Wasche und schneide dein Obst in kleine Stücke.");
  }
  if (ingredients.some(ing => ing.includes("Gemüse") || ing.includes("Gurke") || ing.includes("Karotte"))) {
    steps.push("Bereite dein Gemüse vor – roh oder leicht gegart, wie du es magst.");
  }
  if (ingredients.some(ing => ing.includes("Ei") || ing.includes("Fisch") || ing.includes("Käse"))) {
    steps.push("Brate oder koche dein Protein mit etwas Öl oder Butter.");
  }

  // Schritt 3: Kombinieren
  steps.push("Kombiniere alles auf einem Teller – achte auf die Farben und Texturen!");

  // Schritt 4: Genießen
  steps.push("Iss langsam und bemerke: Was schmeckt zusammen besonders gut?");

  // Schritt 5: Erfolg
  steps.push("🎉 Du hast diese Woche viel entdeckt! Große Gourmetin! 👨‍🍳");

  return steps;
}

/**
 * Generiert hilfreiche Tipps basierend auf den Kategorien
 */
function generateTips(categories) {
  const tips = [];

  if (Object.keys(categories).includes("Fleisch- & Eierinsel")) {
    tips.push("Fleisch und Eier liefern dir viel Energie – probiere verschiedene Zubereitungen!");
  }
  if (Object.keys(categories).includes("Gemüse- & Getreideinsel")) {
    tips.push("Je bunter dein Gemüse, desto mehr Vitamine! Kombiniere Getreide für mehr Abwechslung.");
  }
  if (Object.keys(categories).includes("Getränkeinsel")) {
    tips.push("Trinken ist wichtig! Probiere verschiedene Getränke und finde deinen Favoriten.");
  }
  if (Object.keys(categories).includes("Milchprodukteinsel")) {
    tips.push("Milchprodukte schmecken pur oder gemischt – entdecke neue Kombinationen!");
  }
  if (Object.keys(categories).includes("Obstinsel")) {
    tips.push("Obst ist süß und gesund – probiere viele Sorten und Farben!");
  }

  if (tips.length === 0) {
    tips.push("Kombiniere Lieblingsgeschmäcker auf neue Weise!");
    tips.push("Achte auf Farben, Texturen und Geschmäcker!");
  }

  return tips.join(" ");
}
