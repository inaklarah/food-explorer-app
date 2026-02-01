<script>
  export let island;
  export let onPrev;
  export let onNext;
  export let onOpen;

  // Fortschritt reaktiv aus localStorage holen
  import { onMount, onDestroy } from 'svelte';
  import { getTigerComment, showPassiveComment } from '../stores/characterStore.js';
  
  let completedCount = 0;
  let previousIslandTitle = null;

  function updateCompletedCount() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`island_${island.title}_completed`);
      completedCount = saved ? JSON.parse(saved).length : 0;
    } else {
      completedCount = 0;
    }
  }

  // Reaktiv auf Inselwechsel
  $: if (island) {
    if (previousIslandTitle !== null && previousIslandTitle !== island.title) {
      // Inselwechsel erkannt - zeige Tiger-Kommentar
      const comment = getTigerComment('islandSwitch');
      if (comment) {
        showPassiveComment(comment);
      }
    }
    previousIslandTitle = island.title;
    updateCompletedCount();
  }

  // Reaktiv auf storage-Events (z.B. wenn andere Komponenten Fortschritt speichern)
  function handleStorage(e) {
    if (e.key === `island_${island.title}_completed`) {
      updateCompletedCount();
    }
  }
  onMount(() => {
    updateCompletedCount();
    window.addEventListener('storage', handleStorage);
  });
  onDestroy(() => {
    window.removeEventListener('storage', handleStorage);
  });
  
  // Generiere Sterne für visuellen Fortschritt
  function getStars(completed, total) {
    return Array.from({ length: total }, (_, i) => i < completed);
  }
  
  $: stars = getStars(completedCount, island.tasks.length);
  
  // Berechne das dynamische Bild basierend auf Fortschritt
  $: displayImage = getDisplayImage(
    island.title,
    completedCount,
    island.tasks.length,
    island.image
  );

  // Pro Insel definieren, wo die Fortschrittsbilder liegen und wie sie heißen
  // Dadurch bleibt die Logik leicht erweiterbar.
  const progressConfigs = {
    Proteininsel: {
      folder: 'Fortschritt Fleisch',
      prefix: 'fleisch',
      usesBaseStage1: false,
      hasCompleteImage: false
    },
    Gemüseinsel: {
      folder: 'Fortschritt Gemüse',
      prefix: 'gemuese',
      usesBaseStage1: false,
      hasCompleteImage: true
    },
    Getreideinsel: {
      folder: 'Fortschritt Getreide',
      prefix: 'getreide',
      usesBaseStage1: true,
      hasCompleteImage: false
    },
    Getränkeinsel: {
      folder: 'Fortschritt Getränke',
      prefix: 'getraenke',
      usesBaseStage1: false,
      hasCompleteImage: false
    },
    Milchprodukteinsel: {
      folder: 'Fortschritt Milch',
      prefix: 'milch',
      usesBaseStage1: false,
      hasCompleteImage: true
    },
    Obstinsel: {
      folder: 'Fortschritt Obst',
      prefix: 'obst',
      usesBaseStage1: false,
      hasCompleteImage: false
    }
  };

  function getDisplayImage(islandTitle, completed, total, defaultImage) {
    const config = progressConfigs[islandTitle];
    if (!config) {
      return defaultImage;
    }

    // Ordnername für URLs sicher kodieren (Umlaute/Leerzeichen)
    const encodedFolder = encodeURIComponent(config.folder);

    const isComplete = completed >= total;

    // Optionales fertiges Bild am Ende
    if (isComplete && config.hasCompleteImage) {
      return `/islands/${encodedFolder}/${config.prefix}_fertig.png`;
    }

    // Stufe 1 anzeigen, solange Aufgabe 1 nicht abgeschlossen ist
    // Stufe 2 ab Abschluss von Aufgabe 1, usw.
    const stageNumber = Math.min(completed + 1, total);

    // Manche Inseln nutzen für Stufe 1 das Basisbild (z. B. Getreide)
    if (config.usesBaseStage1 && stageNumber === 1) {
      return defaultImage;
    }

    return `/islands/${encodedFolder}/${config.prefix}_${stageNumber}.png`;
  }

  // Beschreibungen für jede Insel basierend auf deren Nutzen
  function getIslandDescription(islandTitle) {
    const descriptions = {
      'Proteininsel': 'Proteine helfen beim Wachsen und machen dich stark',
      'Gemüseinsel': 'Gemüse schützt deinen Körper und hält dich gesund',
      'Getreideinsel': 'Kohlenhydrate geben dir Energie für den ganzen Tag',
      'Getränkeinsel': 'Trinken hält deinen Körper fit und dein Gehirn wach',
      'Milchprodukteinsel': 'Milchprodukte stärken deine Knochen und Zähne',
      'Obstinsel': 'Obst liefert Vitamine und schmeckt lecker süß'
    };
    return descriptions[islandTitle] || 'Entdecke neue Lebensmittel';
  }

  $: islandDescription = getIslandDescription(island.title);
</script>

<main style="background: linear-gradient(180deg, {island.bg} 0%, {island.bg}dd 100%);">
  <div class="content-wrapper">
    <header>
      <div class="header-content">
        <h1 style="color:{island.color}">{island.title}</h1>
        <p class="progress-description">{islandDescription}</p>
      </div>
      
      <div class="progress-indicator">
        <div class="stars-progress">
          {#each stars as filled}
            <span class="star" class:filled style="color: {island.color};">
              <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                <line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
            </span>
          {/each}
        </div>
        <p class="progress-text" style="color:{island.color}">{completedCount} von {island.tasks.length} Aufgaben geschafft</p>
      </div>
    </header>

    <div class="island">
      <button class="arrow left" on:click={onPrev} style="color: {island.color};" aria-label="Vorherige Insel">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <div class="island-image-wrapper">
        <img src={displayImage} alt={island.title} />
      </div>

      <button class="arrow right" on:click={onNext} style="color: {island.color};" aria-label="Nächste Insel">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>

    <button
      class="cta"
      style="background: {island.button}; border-color: {island.button};"
      on:click={onOpen}
    >
      Insel erkunden
    </button>
  </div>
</main>

<style>
  /* ===== MAIN CONTAINER ===== */
  main {
    height: 100vh;
    overflow: hidden;
    padding: 0;
    padding-bottom: var(--layout-padding-bottom);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    transition: background 0.4s ease;
  }

  .content-wrapper {
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    padding-bottom: calc(3rem + var(--spacing-md));
  }

  /* ===== HEADER ===== */
  header {
    width: 100%;
    max-width: 100%;
    margin-bottom: 0;
    background: white;
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    padding: var(--spacing-lg) var(--spacing-lg);
    padding-bottom: var(--spacing-xl);
    align-self: flex-start;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .header-content {
    margin-bottom: var(--spacing-md);
  }

  header h1 {
    margin: 0 0 var(--spacing-xs) 0;
    font-family: 'Inria Sans', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.01em;
    text-align: left;
  }

  .progress-description {
    margin: 0;
    font-size: clamp(0.875rem, 2.5vw, 1rem);
    color: var(--color-secondary-light);
    font-weight: 400;
    line-height: 1.4;
    text-align: left;
  }

  .progress-indicator {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border-light);
  }

  .stars-progress {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }

  .star {
    display: inline-flex;
    opacity: 0.3;
    transition: var(--transition-base);
    min-width: fit-content;
  }

  .star.filled {
    opacity: 1;
    transform: scale(1.05);
  }

  .progress-text {
    font-size: clamp(0.8125rem, 2.5vw, 0.9375rem);
    font-weight: 700;
    margin: 0;
    text-align: left;
    letter-spacing: 0.01em;
  }

  /* ===== ISLAND DISPLAY ===== */
  .island {
    position: relative;
    width: 100%;
    max-width: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    margin: auto 0;
    flex: 1;
  }

  .island-image-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: min(320px, 90vw);
    aspect-ratio: 1 / 1;
  }

  .island img {
    width: 100%;
    height: auto;
    max-width: 100%;
    object-fit: contain;
    filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.15));
    transition: var(--transition-slow);
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-15px) rotate(2deg);
    }
  }

  /* ===== NAVIGATION ARROWS ===== */
  .arrow {
    border: none;
    background: transparent;
    cursor: pointer;
    transition: var(--transition-base);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: var(--spacing-sm);
    min-width: clamp(2.5rem, 8vw, 3rem);
    min-height: clamp(2.5rem, 8vw, 3rem);
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    box-shadow: none;
  }

  .arrow:hover {
    transform: scale(1.2);
    box-shadow: none;
  }

  .arrow:active {
    transform: scale(0.95);
    box-shadow: none;
  }

  /* ===== CTA BUTTON ===== */
  .cta {
    position: fixed;
    bottom: clamp(5.5rem, 15vw + 1rem, 7rem);
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    padding: var(--spacing-md) var(--spacing-xl);
    border: 2px solid var(--color-primary);
    border-radius: var(--radius-full);
    background: var(--color-primary);
    color: white;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1rem, 3vw, 1.125rem);
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition-base);
    box-shadow: 0 4px 12px rgba(255, 155, 113, 0.3);
    letter-spacing: 0.02em;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    min-height: 3.5rem;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    z-index: 100;
  }

  .cta:hover {
    transform: translateX(-50%) translateY(-2px);
    background: var(--color-primary-light);
    border-color: var(--color-primary-light);
    box-shadow: 0 6px 16px rgba(255, 155, 113, 0.4);
  }

  .cta:active {
    transform: translateX(-50%) translateY(0);
    box-shadow: 0 4px 12px rgba(255, 155, 113, 0.3);
    outline: none;
  }

  .cta:focus,
  .cta:focus-visible {
    outline: none;
    box-shadow: none;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 480px) {
    main {
      padding: 0;
      padding-bottom: var(--layout-padding-bottom);
    }

    header h1 {
      font-size: 1.5rem;
    }

    .island-image-wrapper {
      max-width: min(240px, 80vw);
    }
  }

  @media (min-width: 768px) {
    main {
      padding: 0;
      padding-bottom: var(--layout-padding-bottom);
    }

    .content-wrapper {
      max-width: 900px;
    }

    header {
      max-width: 100%;
      padding: var(--spacing-xl);
      padding-top: var(--spacing-2xl);
      padding-bottom: var(--spacing-2xl);
    }

    .island {
      gap: var(--spacing-xl);
    }
  }

  @media (min-width: 1024px) {
    .content-wrapper {
      max-width: 1000px;
    }
  }
</style>
