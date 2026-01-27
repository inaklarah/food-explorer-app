# 🍽️ Food Explorer App

Eine interaktive Lern-App für Kinder zum Erkunden neuer Lebensmittel. Kindgerecht, spielerisch und ohne Druck!

## ✨ Features (Januar 2026 Update)

- **6 thematische Islands** 🏝️ - Süß, Salzig, Frisch, Protein, Farbspiel, Entdecken
- **Input-Feld für gegessenes Essen** - Dein Kind gibt ein, was es probiert hat
- **AI-generierte Rezeptvorschläge** - Personalisierte Rezepte vom Backend
- **Favoriten-System** ❤️ - "Das mochte ich!" Button zum Speichern
- **Wochentracking** 📊 - Automatischer Counter (0-7)
- **Intelligentes Wochenrezept** - Nach 7 Favoriten kombiniert die KI ein Rezept
- **Lob & Ermutigung** - Automatische Praise-Nachrichten beim Probieren
- **Offline Storage** - Alles wird lokal mit localStorage gespeichert

## 🚀 Quick Start

### Voraussetzungen
- Node.js 16+
- Ollama (für AI-Features)

### Installation & Starten

```bash
# 1. Backend starten (Port 3000)
cd backend
npm install
node index.js

# 2. Ollama-Proxy starten (Port 3001)  
cd ollama-proxy
npm install
node index.js

# 3. Frontend starten (Port 5173)
npm install
npm run dev
```

Öffne [http://localhost:5173](http://localhost:5173) im Browser.

## 📖 Dokumentation

- **[FEATURES_UPDATE.md](FEATURES_UPDATE.md)** - Übersicht aller neuen Features
- **[IMPLEMENTATION_DETAILS.md](IMPLEMENTATION_DETAILS.md)** - Technische Details
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - Was testen?
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System-Architektur
- **[INTEGRATION_CHECKLIST.md](INTEGRATION_CHECKLIST.md)** - Integration Guide

## 🎯 App-Ablauf

```
1. Onboarding
   ↓
2. Island-Übersicht (Start)
   ├─ 6 Islands zum Erkunden
   ├─ Week-Counter (0/7)
   └─ Favoriten-Button ❤️
   ↓
3. Island-Task (Detail)
   ├─ Aktuelle Aufgabe
   ├─ Input-Feld: "Was hast du gegessen?"
   ├─ AI-Rezept
   └─ Zwei Buttons:
      ├─ ❤️ "Das mochte ich!" → Speichert
      └─ ✓ "Aufgabe fertig" → Nächste Task
   ↓
4. Nach 7 Favoriten
   ├─ Weekly Recap Modal
   ├─ Favoriten-Grid anzeigen
   ├─ Kombiniertes Wochenrezept
   └─ "Neue Woche starten" Button
```

## 📁 Projektstruktur

```
src/
├── App.svelte (State & Router)
└── lib/
    ├── components/
    │   ├── FoodInput.svelte (Input + Rezept)
    │   ├── IslandDetail.svelte (Task-Screen)
    │   ├── IslandView.svelte (Island-Übersicht)
    │   ├── FavoritesList.svelte (Favoriten)
    │   ├── WeeklyRecapModal.svelte (Wochenende)
    │   └── Onboarding.svelte (Intro)
    ├── data/
    │   └── islands.js (6 Islands + 42 Tasks)
    └── utils/
        └── recipeGenerator.js (Rezept-KI)
```

## 💾 Datenspeicherung

```javascript
localStorage["foodExplorerFavorites"]  // Array mit Lieblingsspeisen
localStorage["weeklyTaskCount"]        // Counter für Wochentracker
```

## 🎨 Design

- **Responsive** - Funktioniert auf Mobile & Desktop
- **Farbenfroh** - Jede Island hat eigene Farbpalette
- **Animiert** - Smooth Übergänge & Feedback
- **Kindgerecht** - Große Buttons, klare Texte

## 🔧 Technologie

- **Svelte** - UI-Framework
- **Vite** - Build Tool
- **Node.js** - Backend
- **Ollama** - AI/LLM
- **localStorage** - Persistent Storage

## 🧪 Testen

Siehe [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) für vollständige Test-Anleitung.

```bash
# Terminal 1: Backend
cd backend && node index.js

# Terminal 2: Ollama-Proxy
cd ollama-proxy && node index.js

# Terminal 3: Frontend
npm run dev

# Terminal 4: Tests (optional)
npm run test
```

## 🐛 Häufige Probleme

| Problem | Lösung |
|---------|--------|
| "Cannot find module" | `npm install` im jeweiligen Ordner |
| Port 3000/3001 belegt | `lsof -i :3000` und Prozess killen |
| Weekly Recap nicht sichtbar | localStorage in DevTools checken |
| Rezepte nicht generiert | Ollama aktiv? Port 3001 aktiv? |

## 📞 Support

Bei Fragen oder Bugs:
1. Checke die Konsole (F12 → Console)
2. Lies die Dokumentations-Dateien
3. Schau in die ARCHITECTURE.md für Details

## 📝 Lizenz

Schulprojekt - HFG 2526 WiSe IG3

---

**Version:** 2.0 (Januar 2026)  
**Status:** ✅ Ready for Testing  
**Autor:** Ina Haas

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `checkJs` in the JS template?**

It is likely that most cases of changing variable types in runtime are likely to be accidental, rather than deliberate. This provides advanced typechecking out of the box. Should you like to take advantage of the dynamically-typed nature of JavaScript, it is trivial to change the configuration.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/sveltejs/svelte-hmr/tree/master/packages/svelte-hmr#preservation-of-local-state).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```js
// store.js
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
