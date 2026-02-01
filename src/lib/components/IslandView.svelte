<script>
  export let island;
  export let onPrev;
  export let onNext;
  export let onOpen;

  // Fortschritt reaktiv aus localStorage holen
  import { onMount, onDestroy } from 'svelte';
  let completedCount = 0;

  function updateCompletedCount() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`island_${island.title}_completed`);
      completedCount = saved ? JSON.parse(saved).length : 0;
    } else {
      completedCount = 0;
    }
  }

  // Reaktiv auf Inselwechsel
  $: island, updateCompletedCount();

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
</script>

<main style="background: linear-gradient(180deg, {island.bg} 0%, {island.bg}dd 100%);">
  <header>
    <h1 style="color:{island.color}">{island.title}</h1>
    
    <div class="stars-progress">
      {#each stars as filled}
        <span class="star" class:filled style="color: {island.color};">
          <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
            <line x1="4" y1="22" x2="4" y2="15"/>
          </svg>
        </span>
      {/each}
    </div>
    
    <p class="progress-text" style="color:{island.color}">{completedCount} von {island.tasks.length} Aufgaben geschafft</p>
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
    style="background: linear-gradient(180deg, {island.button} 0%, {island.button}dd 100%); box-shadow: 0 6px 0 {island.color}99;"
    on:click={onOpen}
  >
    Insel erkunden
  </button>

</main>

<style>
  /* ===== MAIN CONTAINER ===== */
  main {
    min-height: 100vh;
    padding: var(--spacing-xl) var(--spacing-md);
    padding-bottom: var(--layout-padding-bottom);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  /* ===== HEADER ===== */
  header {
    text-align: center;
    margin-bottom: var(--spacing-lg);
    width: 100%;
  }

  header h1 {
    margin: 0 0 var(--spacing-lg) 0;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1.75rem, 6vw, 2.25rem);
    font-weight: 500;
    line-height: 1.2;
  }

  .stars-progress {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-base);
    flex-wrap: wrap;
  }

  .star {
    display: inline-flex;
    opacity: 0.25;
    transition: var(--transition-base);
    min-width: fit-content;
  }

  .star.filled {
    opacity: 1;
    transform: scale(1.1);
  }

  .progress-text {
    font-size: clamp(0.875rem, 2.5vw, 1rem);
    font-weight: 500;
    margin: 0;
    opacity: 0.9;
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
    margin: var(--spacing-xl) 0;
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
  }

  .arrow:hover {
    transform: scale(1.2);
  }

  .arrow:active {
    transform: scale(0.95);
  }

  /* ===== CTA BUTTON ===== */
  .cta {
    width: 100%;
    max-width: clamp(280px, 90vw, 320px);
    padding: var(--spacing-md) var(--spacing-xl);
    border: none;
    border-radius: var(--radius-base);
    color: white;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1rem, 3vw, 1.125rem);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-base);
    margin-top: var(--spacing-lg);
    box-shadow: var(--shadow-button);
    letter-spacing: 0.02em;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    min-height: 3rem;
  }

  .cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(255, 133, 85, 0.35);
  }

  .cta:active {
    transform: translateY(0);
    box-shadow: var(--shadow-base);
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 480px) {
    main {
      padding: var(--spacing-md) var(--spacing-base);
      padding-bottom: 7.5rem;
    }

    header h1 {
      font-size: 1.75rem;
    }

    .island-image-wrapper {
      max-width: min(240px, 80vw);
    }
  }

  @media (min-width: 768px) {
    main {
      padding: var(--spacing-2xl);
      padding-bottom: 5rem;
    }

    header h1 {
      font-size: 2.25rem;
    }

    .island {
      gap: var(--spacing-xl);
    }
  }
</style>
