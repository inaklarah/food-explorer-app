# 🐯 Explorer-Tiger Integration - Dokumentation

## Übersicht

Der Explorer-Tiger ist ein interaktiver KI-Begleiter für Kinder (5-9 Jahre), der durch die Food-Explorer-App führt, motiviert und Essens-Entdeckungen kommentiert.

---

## 📂 Komponenten-Architektur

### **1. CharacterAvatar.svelte**
**Pfad:** `/src/lib/components/CharacterAvatar.svelte`

**Funktion:**
- Fixierter Tiger-Avatar über der Menüleiste (unten rechts)
- Zeigt passive Sprechblasen (automatische Kommentare)
- Klick öffnet den Chat-Dialog
- Pulsierender Ring für Aufmerksamkeit

**Props:**
```javascript
characterName: string // Name des Tigers (z.B. "Leo")
```

**Features:**
- Position: `bottom: 90px, right: 20px`
- Hover-Effekt mit sanfter Animation
- Sprechblase verschwindet nach 4 Sekunden automatisch

---

### **2. CharacterChat.svelte**
**Pfad:** `/src/lib/components/CharacterChat.svelte`

**Funktion:**
- Modal-Dialog für interaktive Gespräche
- Nutzt Ollama-API für KI-Antworten
- Zeigt Chat-Historie
- Loading-Indicator während KI-Antwort

**Features:**
- Bottom-Sheet auf Mobile, zentriertes Modal auf Desktop
- System-Prompt definiert Tiger-Persönlichkeit
- Kontext-Integration (aktuelles Essen, Aufgabe)
- Enter-Taste zum Senden

**KI-Integration:**
```javascript
const SYSTEM_PROMPT = `
Du bist ein freundlicher Explorer-Tiger.
- Abenteuerlustig, motivierend, kindgerecht
- 1-3 kurze Sätze pro Antwort
- Nutze Emojis: 🥕🍎⭐
- Stelle neugierige Fragen
`;
```

---

### **3. characterStore.js**
**Pfad:** `/src/lib/stores/characterStore.js`

**Funktion:**
- Globaler State für Tiger-Kontext
- Automatische localStorage-Synchronisation

**Stores:**
```javascript
characterName       // Name des Tigers
currentTask         // Aktuelle Insel/Aufgabe
lastEatenFood       // Zuletzt eingegebenes Essen
isChatOpen          // Chat-Dialog-Status
passiveComment      // Aktuelle Sprechblase
```

**Helper:**
```javascript
showPassiveComment(message) // Zeigt Sprechblase für 4 Sekunden
```

---

## 🔌 Integration in bestehende Komponenten

### **App.svelte**
```svelte
<script>
  import CharacterAvatar from "./lib/components/CharacterAvatar.svelte";
  import CharacterChat from "./lib/components/CharacterChat.svelte";
  import { characterName } from "./lib/stores/characterStore.js";
</script>

<!-- Auf allen Views außer Onboarding -->
<CharacterAvatar characterName={$characterName} />
<CharacterChat />
```

### **Onboarding.svelte**
- Namensgebung-Schritt hinzugefügt
- 2-Step-Prozess:
  1. Welcome Screen
  2. Tiger benennen (optional überspringbar)
- Speichert Name in `characterName` Store

### **FoodInput.svelte**
```javascript
import { showPassiveComment, lastEatenFood, currentTask } from '../stores/characterStore.js';

// Nach erfolgreicher Eingabe:
const randomComment = tigerComments[Math.floor(Math.random() * tigerComments.length)];
showPassiveComment(randomComment);
lastEatenFood.set(food.trim());
currentTask.set(island.title);
```

**Tiger-Kommentare:**
```javascript
const tigerComments = [
  "Mmmh, das klingt lecker! 🥕",
  "Toll! Du hast etwas Neues probiert! ⭐",
  "Wow, das mag ich auch! 😋",
  // ...
];
```

---

## 🎨 UI/UX Design

### **Farben & Styling**
- Avatar-Border: `#FF9B71`
- Gradient-Background: `#FFF9F0` → `#FFE8D6`
- Sprechblase: White mit `#FF9B71` Border
- Shadow: `0 6px 24px rgba(255, 155, 113, 0.4)`

### **Positionierung**
```css
.character-avatar-container {
  position: fixed;
  bottom: 90px;  /* Über MenuBar */
  right: 20px;
  z-index: 900;
}
```

### **Responsiveness**
- Mobile: Avatar 70px × 70px
- Desktop: Avatar 80px × 80px
- Chat: Bottom-Sheet (Mobile) / Centered Modal (Desktop)

---

## 🤖 KI-Verhalten

### **Persönlichkeit**
- ✅ Neugierig, freundlich, motivierend
- ✅ Nie bewertend oder negativ
- ✅ Einfache Sprache (5-9 Jahre)
- ✅ 1-3 Sätze pro Antwort

### **Kontext-Integration**
Der Tiger erhält Kontext über:
```javascript
${$currentTask ? `- Aktuelle Aufgabe: ${$currentTask}` : ''}
${$lastEatenFood ? `- Zuletzt entdeckt: ${$lastEatenFood}` : ''}
```

### **Beispiel-Dialoge**
```
Kind: "Ich habe eine Karotte gegessen"
Tiger: "Wow! Karotten sind super für deine Augen! 🥕 Magst du sie roh oder gekocht?"

Kind: "Ich mag keine Tomaten"
Tiger: "Das ist okay! Vielleicht probierst du sie mal anders? 🍅 Kennst du Tomatensaft?"
```

---

## 🔧 Technische Details

### **Abhängigkeiten**
- Ollama-Proxy: `http://localhost:3000/ai`
- Svelte Transitions: `fade`, `fly`, `scale`
- Svelte Stores: `writable`

### **localStorage-Schlüssel**
```javascript
'characterName'              // Tiger-Name
'currentTask'                // Aktuelle Aufgabe
'lastEatenFood'              // Letztes Essen
'foodExplorerFavorites'      // Favoriten-Liste
```

### **API-Endpunkte**
```javascript
POST http://localhost:3000/ai
Body: { prompt: string }
Response: { text: string }
```

---

## 📋 Erweiterbarkeit

### **Anderen Charakter nutzen**
1. Ersetze `/explorer/tiger.png` durch neues Bild
2. Passe `SYSTEM_PROMPT` in `CharacterChat.svelte` an
3. Ändere `tigerComments` in `FoodInput.svelte`

**Beispiel: Hase statt Tiger**
```javascript
// characterStore.js
export const characterType = writable('rabbit'); // 'tiger' | 'rabbit'

// CharacterAvatar.svelte
<img src="/explorer/{$characterType}.png" alt={characterName} />
```

### **Mehr Sprechblasen-Trigger**
```javascript
// In beliebiger Komponente:
import { showPassiveComment } from '../stores/characterStore.js';

function onSpecialEvent() {
  showPassiveComment("Wow, du bist fleißig heute! ⭐");
}
```

### **Chat-Erweiterungen**
- Voice-Input mit Web Speech API
- Animierte Tiger-Emotionen (happy, surprised, etc.)
- Vorschläge-Buttons statt Freitext
- Mehr Kontext (Fortschritt, Lieblingsessen, etc.)

---

## 🚀 Verwendung

### **1. Server starten**
```bash
# Terminal 1: Ollama Proxy
cd ollama-proxy
npm start

# Terminal 2: Backend
cd backend
npm start

# Terminal 3: Frontend
npm run dev
```

### **2. Testen**
1. App öffnen → Tiger-Name vergeben
2. Insel auswählen → Essen eingeben
3. Tiger zeigt automatisch Sprechblase
4. Klick auf Tiger → Chat öffnet sich
5. Mit Tiger chatten über Essen

---

## 🎯 UX-Hinweise für Kinder

### **✅ Gut funktioniert:**
- Kurze, klare Sätze
- Emojis als visuelle Verstärkung
- Lob und Ermutigung
- Neugierige Fragen statt Bewertungen

### **❌ Vermeiden:**
- Lange Textwände
- Negative/kritische Formulierungen
- Komplexe Fachbegriffe
- Zu viele Fragen gleichzeitig

### **💡 Best Practices:**
```javascript
// ✅ Gut
"Yummy! Äpfel sind knackig und süß! 🍎 Welche Farbe magst du lieber?"

// ❌ Schlecht
"Äpfel (Malus domestica) enthalten wichtige Vitamine wie Vitamin C, 
Ballaststoffe und sekundäre Pflanzenstoffe. Sie sollten täglich 
mindestens einen Apfel essen."
```

---

## 📝 Checkliste für Deployment

- [x] CharacterAvatar erstellt
- [x] CharacterChat erstellt
- [x] characterStore implementiert
- [x] Onboarding-Namensgebung
- [x] FoodInput-Integration (passive Kommentare)
- [x] App.svelte-Integration
- [x] localStorage-Persistenz
- [x] Responsive Design (Mobile + Desktop)
- [x] KI-Prompts optimiert
- [x] Dokumentation erstellt

---

## 🐛 Bekannte Einschränkungen

- Tiger erscheint erst nach Onboarding (nicht auf Onboarding-Screen)
- Ollama muss lokal laufen (kein Fallback)
- Chat-Historie wird nicht gespeichert (bei Reload verloren)
- Keine Multi-Language-Support (nur Deutsch)

---

## 📞 Support

Bei Fragen zur Integration:
1. Prüfe Browser-Console auf Fehler
2. Stelle sicher Ollama läuft: `curl http://localhost:11434/api/generate`
3. Prüfe localStorage: `localStorage.getItem('characterName')`

**Viel Erfolg mit deinem Explorer-Tiger! 🐯**
