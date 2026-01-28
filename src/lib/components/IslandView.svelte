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
      <img src={island.image} alt={island.title} />
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
  main {
    min-height: 100vh;
    padding: 32px 20px;
    padding-bottom: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  header {
    text-align: center;
    margin-bottom: 20px;
    width: 100%;
  }

  header h1 {
    margin: 0 0 1.5rem 0;
    font-family: 'Inria Sans', sans-serif;
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  .stars-progress {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .star {
    display: inline-flex;
    opacity: 0.25;
    transition: all 0.2s ease;
  }

  .star.filled {
    opacity: 1;
    transform: scale(1.1);
  }

  .progress-text {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    opacity: 0.9;
  }

  .island {
    position: relative;
    width: 100%;
    max-width: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 20px 0;
    flex: 1;
  }

  .island-image-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 320px;
  }

  .island img {
    width: 100%;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.15));
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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

  .arrow {
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 8px;
  }

  .arrow:hover {
    transform: scale(1.2);
  }

  .arrow:active {
    transform: scale(0.95);
  }

  .cta {
    width: 100%;
    max-width: 320px;
    padding: 18px 36px;
    border: none;
    border-radius: 16px;
    color: white;
    font-family: 'Inria Sans', sans-serif;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 20px;
    box-shadow: 0 4px 16px rgba(255, 133, 85, 0.25);
    letter-spacing: 0.02em;
  }

  .cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(255, 133, 85, 0.35);
  }

  .cta:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 133, 85, 0.2);
  }

  @media (max-width: 600px) {
    main {
      padding: 24px 16px;
      padding-bottom: 120px;
    }

    header h1 {
      font-size: 28px;
    }

    .arrow {
      width: 48px;
      height: 48px;
    }

    .island-image-wrapper {
      max-width: 240px;
    }

    .cta {
      max-width: 100%;
      font-size: 18px;
    }
  }
</style>
