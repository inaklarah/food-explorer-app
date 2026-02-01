# Food Explorer

## Kurzbeschreibung

**Food Explorer** ist eine interaktive Lern-App für **picky eater** (wählerische Esser:innen).

Die App unterstützt Kinder dabei, Lebensmittel spielerisch, freiwillig und ohne Druck zu entdecken. Im Mittelpunkt steht nicht, ob ein Lebensmittel schmeckt, sondern das **Ausprobieren und Wahrnehmen** an sich.

Die Anwendung ist als **Inselwelt** aufgebaut. Jede Insel steht für eine Lebensmittelgruppe wie Obst und Gemüse, Milchprodukte oder Getränke. Nutzer:innen können Inseln erkunden, Aufgaben erledigen und Fortschritt sammeln, unabhängig davon, wie sie ein Lebensmittel bewerten würden.

**Der Fokus des Projekts liegt auf einer positiven Nutzererfahrung, bei der Neugier wichtiger ist als Leistung.**

---

## Konzept und Fokus

Viele picky eater machen früh negative Erfahrungen mit Essen, häufig verbunden mit Druck oder Erwartungen.

Dieses Projekt verfolgt bewusst einen **anderen Ansatz**:

- Essen wird nicht bewertet
- Es gibt kein richtig oder falsch
- Fortschritt entsteht allein durch das Ausprobieren

**Ziel der App** ist es, Hemmschwellen abzubauen und einen spielerischen Zugang zu neuen Lebensmitteln zu ermöglichen.

---

## Features

- **Inselbasierte Struktur** mit verschiedenen Lebensmittelgruppen
- **Aufgaben pro Insel**, die ohne Bewertung abgeschlossen werden
- **Visuelle Veränderung der Inseln**, sobald Aufgaben erledigt wurden
- **Eingabe von ausprobierten Lebensmitteln**
- **KI-generierte Informationen** zu Lebensmitteln
- **Favoriten-Funktion**, um positive Erfahrungen festzuhalten und daraus ein Rezept zu generieren
- **Charakter in Form eines Tigers** als Begleiter durch die App mit Motivation und Chat Funktion

---

## Technische Umsetzung und Herausforderungen

### Zentrale Herausforderungen

#### 1. Inseln die sich verändern
Die Inseln verändern sich visuell, sobald Aufgaben erledigt wurden. Dadurch wird Fortschritt sichtbar, **ohne mit Zahlen oder Bewertungen zu arbeiten**. Viele Bilder mussten dabei mit den aufgaben verknüpft werden.

#### 2. KI-Integration
Die Integration der KI hat mehrere Anläufe gebraucht, bis die Ergebnisse sinnvoll und stabil waren. Besonders die **Ausgestaltung der Prompts** und das Zusammenspiel zwischen Frontend und Service waren herausfordernd.

#### 3. Konzept und Aufbau der App
Zu Beginn habe ich einzelne Features umgesetzt, ohne die gesamte App-Struktur vollständig zu planen. Das führte dazu, dass grundlegende Funktionen wie Navigation oder Menüführung später ergänzt werden mussten, was den Entwicklungsprozess verlängert hat.

Diese Erfahrung hat deutlich gemacht, wie wichtig eine **frühe Planung der App-Struktur** ist.

---

## Projekt starten

### Voraussetzungen

- Node.js Version 16 oder höher
- Ein laufender KI-Service wie Ollama

### Startanleitung

**1) Backend starten**
```bash
cd backend
npm install
npm start
```

**2) Ollama-Proxy starten**
```bash
cd ollama-proxy
npm install
npm start
```

**3) Frontend starten**
```bash
npm install
npm run dev
```

Die App läuft anschließend im Browser unter:  
http://localhost:5173

---

## Fazit

**Food Explorer** zeigt, wie eine App gestaltet werden kann, die Essen nicht als Leistung versteht, sondern als **Erfahrungsraum**.

Durch den spielerischen Aufbau und den Fokus auf das Ausprobieren entsteht eine positive Umgebung für picky eater, die Neugier fördert und Druck reduziert.