# Design-System Dokumentation - Food Explorer App

## Übersicht

Das Design-System wurde vollständig überarbeitet, um ein konsistentes, kinderfreundliches UI über alle Seiten hinweg zu gewährleisten.

## 🎨 Farbsystem

### Primärfarben (Orange-Töne)
- **Primary Main**: `#FF9B71` - Warmes Orange für Buttons und Akzente
- **Primary Light**: `#FFB997` - Helleres Orange für Hover-Effekte
- **Primary Dark**: `#FF8555` - Dunkleres Orange für Kontrast
- **Primary Soft**: `#FFF4E6` - Sehr helles Orange für subtile Hintergründe

### Sekundärfarben (Braun-Töne)
- **Secondary Main**: `#7D5A3D` - Warmes Braun für Überschriften
- **Secondary Light**: `#A08875` - Helleres Braun für Fließtext
- **Secondary Lighter**: `#C4B5A8` - Noch heller für Subtexte
- **Secondary Soft**: `#FFF9F0` - Sehr helles Beige für Hintergründe

### Hintergrundfarben
- **Background Primary**: `#FFF9F0` - Haupt-Hintergrund
- **Background Secondary**: `#FFF4E6` - Sekundärer Hintergrund
- **Background Card**: `#FFFFFF` - Karten-Hintergrund

## ✏️ Typografie

### Schriftfamilien
- **Heading**: `Quicksand` - Für alle Überschriften (rund und freundlich)
- **Body**: `Poppins` - Für Fließtexte (gut lesbar)

### Schriftgrößen (Responsive mit clamp)
- **3xl**: `clamp(2.25rem, 7vw, 3rem)` - Große Überschriften
- **2xl**: `clamp(1.75rem, 6vw, 2.5rem)` - Haupt-Überschriften
- **xl**: `clamp(1.375rem, 4.5vw, 1.75rem)` - Unterüberschriften
- **lg**: `clamp(1.125rem, 3.5vw, 1.375rem)` - Große Texte
- **base**: `clamp(1rem, 3vw, 1.125rem)` - Standard-Text
- **sm**: `clamp(0.875rem, 2.5vw, 1rem)` - Kleine Texte
- **xs**: `clamp(0.75rem, 2vw, 0.875rem)` - Sehr kleine Texte

### Schriftstärken
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## 📐 Abstände (Spacing)

Alle Abstände sind responsive mit `clamp()`:
- **xs**: `clamp(0.25rem, 1vw, 0.5rem)`
- **sm**: `clamp(0.5rem, 1.5vw, 0.75rem)`
- **base**: `clamp(0.75rem, 2vw, 1rem)`
- **md**: `clamp(1rem, 2.5vw, 1.25rem)`
- **lg**: `clamp(1.25rem, 3vw, 1.75rem)`
- **xl**: `clamp(1.5rem, 4vw, 2rem)`
- **2xl**: `clamp(2rem, 5vw, 3rem)`

## 🔲 Rundungen (Border Radius)

- **sm**: `clamp(0.5rem, 1.5vw, 0.75rem)`
- **base**: `clamp(0.75rem, 2vw, 1rem)`
- **md**: `clamp(1rem, 2.5vw, 1.25rem)`
- **lg**: `clamp(1.25rem, 3vw, 1.75rem)`
- **xl**: `clamp(1.5rem, 4vw, 2rem)`
- **full**: `999px` - Für Pill-Buttons
- **circle**: `50%` - Für runde Elemente

## 🎯 Button-Styles

### Primärer Button
```css
background: linear-gradient(135deg, #FF9B71 0%, #FFB997 100%);
color: white;
border-radius: var(--radius-base);
box-shadow: var(--shadow-button);
```

**Hover**: Hebt sich leicht an mit verstärktem Schatten
**Active**: Kehrt zur Ausgangsposition zurück

### Sekundärer Button
```css
background: white;
color: #FF9B71;
border: 2px solid #E7C6B1;
```

### Icon Button
- Runde Form mit `border-radius: 50%`
- Weißer Hintergrund
- Primärfarbe für Icons
- Hover: Scale-Effekt (1.1)

### Text Button
- Transparenter Hintergrund
- Nur Text, keine starke Hervorhebung
- Für weniger wichtige Aktionen

## 🃏 Card-Styles

```css
background: white;
border-radius: var(--radius-lg);
padding: var(--spacing-lg);
box-shadow: var(--shadow-md);
```

## 📱 Layout-Struktur

### Seiten-Aufbau (konsistent auf allen Seiten)

1. **Header-Bereich**
   - Optional: Zurück-Button (links)
   - Titel (zentriert oder links)
   - Optional: Action-Buttons (rechts)

2. **Content-Bereich**
   - Haupt-Inhalt mit Padding
   - Scrollable wenn nötig

3. **Bottom Navigation (MenuBar)**
   - Fixiert am unteren Rand
   - 3 Items: Start, Inseln, Favoriten
   - Active-State mit Farb- und Hintergrund-Änderung

### Safe Area für Bottom Navigation
Alle Seiten haben ein `padding-bottom: var(--layout-padding-bottom)` 
um Platz für die fixierte Navigation zu schaffen.

## 🎭 Animationen & Transitions

### Standard-Übergänge
- **Fast**: `0.15s ease` - Für kleine Interaktionen
- **Base**: `0.2s ease` - Standard für die meisten Elemente
- **Medium**: `0.25s cubic-bezier(0.4, 0, 0.2, 1)` - Für komplexe Bewegungen
- **Slow**: `0.3s ease` - Für große Elemente

### Hover-Effekte
- Buttons: `translateY(-2px)` + verstärkter Schatten
- Cards: Erhöhter Schatten
- Icons: `scale(1.1)`

### Touch-Optimierung
- `touch-action: manipulation`
- `-webkit-tap-highlight-color: transparent`
- Keine Outline bei Focus (nur für Touch-Geräte)

## 🎨 Schatten (Shadows)

- **sm**: Leichter Schatten für subtile Tiefe
- **base**: Standard-Schatten für Cards
- **md**: Mittlerer Schatten für hervorgehobene Elemente
- **lg**: Starker Schatten für modals und wichtige Cards
- **button**: Spezieller Schatten für Buttons (orange Tönung)

## 📋 CSS Custom Properties

Alle Design-Tokens sind als CSS Custom Properties in `app.css` definiert:

```css
:root {
  --color-primary: #FF9B71;
  --color-secondary: #7D5A3D;
  --spacing-md: clamp(1rem, 2.5vw, 1.25rem);
  --radius-lg: clamp(1.25rem, 3vw, 1.75rem);
  /* ... und viele mehr */
}
```

## 🔧 Verwendung in Komponenten

Statt hartcodierte Werte:
```css
/* ❌ Alt */
padding: 1rem;
color: #7D5A3D;
border-radius: 1.25rem;
```

Verwende Design-Tokens:
```css
/* ✅ Neu */
padding: var(--spacing-md);
color: var(--color-secondary);
border-radius: var(--radius-lg);
```

## 📂 Datei-Struktur

```
src/
├── app.css                 # Globale Styles + CSS Custom Properties
├── lib/
│   ├── theme.js           # JavaScript Design-System Definition
│   └── components/
│       ├── HomeOverview.svelte      # Überarbeitet
│       ├── IslandView.svelte        # Überarbeitet
│       ├── FavoritesList.svelte     # Überarbeitet
│       └── MenuBar.svelte           # Überarbeitet
```

## ✅ Vorteile des neuen Systems

1. **Konsistenz**: Einheitliches Look & Feel über alle Seiten
2. **Wartbarkeit**: Zentrale Definition aller Design-Werte
3. **Responsive**: Automatische Anpassung an verschiedene Bildschirmgrößen
4. **Performance**: Effiziente CSS mit Variablen
5. **Skalierbar**: Einfach erweiterbar für neue Komponenten
6. **Accessibility**: Touch-optimiert und kinderfreundlich

## 🎯 Designprinzipien

1. **Kinderfreundlich**: Große, leicht tippbare Buttons
2. **Ruhig**: Nicht zu viele Farben oder Animationen
3. **Übersichtlich**: Klare Hierarchie und Struktur
4. **Konsistent**: Gleiche Muster auf allen Seiten
5. **Responsiv**: Funktioniert auf allen Geräten

## 🚀 Nächste Schritte

Um das Design-System weiterzuentwickeln:

1. Weitere Komponenten standardisieren
2. Dark Mode hinzufügen (optional)
3. Accessibility-Tests durchführen
4. Performance-Optimierung
5. Design-Dokumentation erweitern
