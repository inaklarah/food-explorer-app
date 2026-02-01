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

**Inselbasierte Navigation**  
Sechs Inseln repräsentieren verschiedene Lebensmittelgruppen (Obst, Gemüse, Getreide, Milchprodukte, Fleisch/Fisch, Getränke). Kinder können frei zwischen den Inseln wechseln und diese in eigenem Tempo erkunden.

**Aufgaben ohne Bewertung**  
Jede Insel enthält Aufgaben, die durch das Ausprobieren von Lebensmitteln abgeschlossen werden. Es gibt keine Punktesysteme oder Erfolgsmetriken, nur das Abhaken zählt.

**Visueller Fortschritt**  
Inseln entwickeln sich weiter, je mehr Aufgaben erledigt wurden. Aus anfänglich unbewachsenen Inseln werden lebendige, bunte Welten.

**Lebensmittel-Eingabe**  
Ausprobierte Lebensmittel können eingetragen und gespeichert werden. Diese Eingaben sind direkt mit der jeweiligen Insel verknüpft.

**KI-gestützte Information**  
Eine integrierte KI liefert kindgerechte Informationen zu eingegebenen Lebensmitteln. Die Antworten sind verständlich formuliert und auf das jeweilige Lebensmittel zugeschnitten.

**Favoriten-Funktion**  
Lebensmittel, die gut ankommen, können als Favoriten markiert werden. Diese werden in einer separaten Liste gesammelt.

**Rezeptgenerator**  
Aus den gesammelten Favoriten lässt sich ein individuelles Rezept erstellen, das auf den persönlichen Vorlieben basiert.

**Tiger-Charakter als Begleiter**  
Ein Tiger Charakter führt durch die App, gibt Unterstützung und bietet eine Chat-Funktion für Fragen und Interaktion.

**Persistente Datenspeicherung**  
Alle Fortschritte, Favoriten und erledigte Aufgaben werden lokal gespeichert und bleiben auch nach App-Neustart erhalten.

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
