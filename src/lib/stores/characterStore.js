/**
 * Character Store
 * Globaler State für den Explorer-Tiger
 * Verwaltet: Name, aktuelle Aufgabe, zuletzt gegessenes Essen
 */

import { writable } from 'svelte/store';

// Initialisiere Werte aus localStorage (Browser only)
function loadFromStorage(key, defaultValue) {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
}

// Character Name
export const characterName = writable('Timo');

// Aktuelle Aufgabe (z.B. welche Insel)
export const currentTask = writable(loadFromStorage('currentTask', null));

// Zuletzt eingegebenes Essen
export const lastEatenFood = writable(loadFromStorage('lastEatenFood', null));

// Chat-Zustand
export const isChatOpen = writable(false);

// Passive Kommentare (Sprechblasen)
export const passiveComment = writable(null);

// Tiger-Kommentare für verschiedene Events
export const tigerComments = {
  appStart: [
    'Willkommen zurück! Bereit für neue Abenteuer?',
    'Schön, dich wiederzusehen! Welche Insel erkunden wir heute?',
    'Hallo! Ich bin Timo, dein Entdecker-Tiger.'
  ],
  islandSwitch: [
    'Diese Insel sieht spannend aus!',
    'Mal sehen, was wir hier entdecken können.',
    'Jede Insel hat ihre eigenen Leckereien!'
  ]
};

/**
 * Gibt einen zufälligen Tiger-Kommentar für einen Event-Typ zurück
 * @param {string} type - "appStart" oder "islandSwitch"
 */
export function getTigerComment(type) {
  const arr = tigerComments[type];
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

// Speichere Änderungen automatisch in localStorage
characterName.subscribe(value => {
  if (typeof window !== 'undefined' && value) {
    localStorage.setItem('characterName', JSON.stringify(value));
  }
});

currentTask.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentTask', JSON.stringify(value));
  }
});

lastEatenFood.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lastEatenFood', JSON.stringify(value));
  }
});

/**
 * Zeigt eine passive Sprechblase für 4 Sekunden
 * @param {string} message - Die Nachricht, die der Tiger sagt
 */
export function showPassiveComment(message) {
  passiveComment.set(message);
  
  setTimeout(() => {
    passiveComment.set(null);
  }, 4000);
}
