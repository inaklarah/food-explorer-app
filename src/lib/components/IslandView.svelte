<script>
  export let island;
  export let onPrev;
  export let onNext;
  export let onOpen;
  export let favoriteCount = 0;
  export let onFavoritesClick;

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
</script>

<main style="background-color:{island.bg}">
  <!-- Top Bar mit Favoriten -->
  <div class="top-bar">
    <button 
      class="favorites-btn" 
      on:click={onFavoritesClick}
      title="Deine Favoriten anschauen"
    >
      ❤️ {favoriteCount}
    </button>
  </div>


  <header>
    <h1 style="color:{island.color}">{island.title}</h1>
  </header>

  <!-- Progressbar analog zu IslandDetail -->
  <div class="progress-bar">
    <div class="progress-fill" style="width: {(completedCount / island.tasks.length) * 100}%; background: {island.color}"></div>
  </div>
  <p class="progress-text">{completedCount} / {island.tasks.length} Aufgaben auf dieser Insel</p>

<style>
  .progress-bar {
    width: 100%;
    height: 16px;
    background: #eee;
    border-radius: 8px;
    margin: 16px 0 8px 0;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 8px;
    transition: width 0.3s;

  </style>

  <div class="island">
    <button class="arrow left" on:click={onPrev}>‹</button>

    <img src={island.image} alt={island.title} />

    <button class="arrow right" on:click={onNext}>›</button>
  </div>

  <button
    class="cta"
    style="background:{island.button}"
    on:click={onOpen}
  >
    Insel entdecken
  </button>

</main>

<style>
  main {
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .top-bar {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 16px;
    gap: 12px;
  }


  .favorites-btn {
    background: white;
    border: 2px solid #FFB3C3;
    border-radius: 12px;
    padding: 8px 16px;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #FF6B9D;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .favorites-btn:hover {
    background: #FFE5ED;
    border-color: #FF1E7E;
    color: #FF1E7E;
  }

  header {
    text-align: center;
    margin-bottom: 20px;
  }

  header h1 {
    margin: 0;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 32px;
    font-weight: 700;
  }


  .island {
    position: relative;
    width: 100%;
    max-width: 400px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
  }

  .island img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: none;
    background: white;
    color: #333;
    font-size: 28px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 10;
  }

  .arrow:hover {
    background: #f0f0f0;
    transform: translateY(-50%) scale(1.1);
  }

  .arrow.left {
    left: -20px;
  }

  .arrow.right {
    right: -20px;
  }

  .cta {
    width: 100%;
    max-width: 400px;
    padding: 16px 24px;
    border: none;
    border-radius: 16px;
    color: white;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 20px;
  }

  .cta:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .cta:active {
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    main {
      padding: 16px;
    }

    header h1 {
      font-size: 24px;
    }

    .arrow {
      width: 36px;
      height: 36px;
      font-size: 24px;
    }

    .arrow.left {
      left: 0;
    }

    .arrow.right {
      right: 0;
    }

    .cta {
      max-width: 100%;
    }
  }
</style>
