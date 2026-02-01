<script>
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  
  export let islands = [];
  export let favorites = [];
  export let resetToken = 0;
  export let onResetProgress;
  
  const dispatch = createEventDispatcher();
  
  function selectIsland(index) {
    dispatch('selectisland', { index });
  }
  
  let completedMap = {};

  function updateCompletedMap() {
    if (typeof window === 'undefined') {
      completedMap = {};
      return;
    }

    const next = {};
    for (const island of islands) {
      const saved = localStorage.getItem(`island_${island.title}_completed`);
      next[island.title] = saved ? JSON.parse(saved).length : 0;
    }
    completedMap = next;
  }

  function handleStorage(event) {
    if (event.key && event.key.startsWith('island_') && event.key.endsWith('_completed')) {
      updateCompletedMap();
    }
  }

  onMount(() => {
    updateCompletedMap();
    window.addEventListener('storage', handleStorage);
  });

  onDestroy(() => {
    window.removeEventListener('storage', handleStorage);
  });

  $: islands, updateCompletedMap();
  // Externes Reset-Signal: Fortschritt neu berechnen
  $: resetToken, updateCompletedMap();

  // Berechne Fortschritt für jede Insel
  function getIslandProgress(island) {
    const total = island.tasks.length;
    const completed = Math.min(completedMap[island.title] ?? 0, total);
    return { completed, total };
  }
  
  // Generiere Sterne für visuellen Fortschritt
  function getStars(completed, total) {
    return Array.from({ length: total }, (_, i) => i < completed);
  }

  $: totalTasks = islands.reduce((sum, island) => sum + island.tasks.length, 0);
  $: completedTasksTotal = islands.reduce(
    (sum, island) => sum + Math.min(completedMap[island.title] ?? 0, island.tasks.length),
    0
  );
  $: remainingTasks = Math.max(totalTasks - completedTasksTotal, 0);
  $: completedTasksDisplay = Math.min(completedTasksTotal, totalTasks);

  // Bilde Inseltitel auf Tiger-Bilder ab
  function getTigerImage(islandTitle) {
    const mapping = {
      'Proteininsel': '/explorer/Insel%20Tiger/tiger_fleisch.png',
      'Gemüseinsel': '/explorer/Insel%20Tiger/tiger_gemuese.png',
      'Getreideinsel': '/explorer/Insel%20Tiger/tiger_getreide.png',
      'Getränkeinsel': '/explorer/Insel%20Tiger/tiger_getraenke.png',
      'Milchprodukteinsel': '/explorer/Insel%20Tiger/tiger_milch.png',
      'Obstinsel': '/explorer/Insel%20Tiger/tiger_obst.png'
    };
    return mapping[islandTitle] || '/explorer/Insel%20Tiger/tiger.png';
  }
</script>

<div class="home-container">
  <header class="home-header">
    <h1>Deine Entdeckungswelt</h1>
    <p class="subtitle">Besuche alle Inseln und sammle tolle Erlebnisse</p>
  </header>
  
  <div class="stats-card">
    <div class="stat">
      <div class="stat-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <span class="stat-value">{completedTasksDisplay}</span>
      <span class="stat-label">Aufgaben geschafft</span>
    </div>
    <div class="stat">
      <div class="stat-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <span class="stat-value">{favorites.length}</span>
      <span class="stat-label">Favoriten</span>
    </div>
  </div>

  
  <div class="islands-grid">
    {#each islands as island, index}
      {@const progress = getIslandProgress(island)}
      {@const stars = getStars(progress.completed, progress.total)}
      <button 
        class="island-card"
        style="background-image: url('{getTigerImage(island.title)}'); border-color: {island.bg};"
        on:click={() => selectIsland(index)}
      >
        <div class="island-overlay">
          <div class="island-content" style="background: {island.bg};">
            <h3 style="color: {island.color};">{island.title}</h3>
            
            <div class="stars-container">
              {#each stars as filled}
                <span class="star" class:filled style="color: {island.color};">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                    <line x1="4" y1="22" x2="4" y2="15"/>
                  </svg>
                </span>
              {/each}
            </div>

          </div>
        </div>
        
        {#if progress.completed === progress.total}
          <div class="completion-badge" style="background: {island.color};">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Fortschritt zurücksetzen: sicherer Neustart -->
  <div class="reset-section">
    <button
      type="button"
      class="reset-button"
      on:click={() => onResetProgress && onResetProgress()}
      aria-label="Fortschritt zurücksetzen"
    >
      Fortschritt zurücksetzen
    </button>
  </div>
</div>

<style>
  /* ===== CONTAINER ===== */
  .home-container {
    min-height: 100vh;
    background: linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
    padding: var(--spacing-md);
    padding-bottom: var(--layout-padding-bottom);
  }

  /* ===== HEADER ===== */
  .home-header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
    padding-top: var(--spacing-base);
  }

  .home-header h1 {
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1.75rem, 6vw, 2.5rem);
    font-weight: 500;
    color: var(--color-secondary);
    margin-bottom: var(--spacing-base);
    line-height: 1.3;
  }

  .subtitle {
    color: var(--color-secondary-light);
    font-size: clamp(0.95rem, 3.5vw, 1.1rem);
    font-weight: 500;
    line-height: 1.5;
  }

  /* ===== STATS CARD ===== */
  .stats-card {
    display: flex;
    justify-content: space-around;
    gap: var(--spacing-md);
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
    box-shadow: var(--shadow-md);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    flex: 1;
    min-width: 0;
  }

  .stat-icon {
    width: clamp(2.75rem, 8vw, 3rem);
    height: clamp(2.75rem, 8vw, 3rem);
    background: linear-gradient(135deg, #FFE8CC 0%, #FFD4A3 100%);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
    flex-shrink: 0;
  }

  .stat-value {
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1.5rem, 5vw, 2.25rem);
    font-weight: 500;
    color: var(--color-secondary);
  }

  .stat-label {
    font-size: clamp(0.75rem, 2.5vw, 0.95rem);
    color: var(--color-secondary-light);
    font-weight: 500;
    text-align: center;
  }

  /* ===== ISLANDS GRID ===== */
  .islands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(clamp(140px, 40vw, 180px), 1fr));
    gap: var(--spacing-md);
    padding: 0 var(--spacing-xs);
  }

  /* ===== ISLAND CARD ===== */
  .island-card {
    position: relative;
    border: 4px solid;
    border-radius: var(--radius-lg);
    padding: 0;
    cursor: pointer;
    transition: var(--transition-medium);
    box-shadow: var(--shadow-md);
    min-height: clamp(200px, 50vw, 220px);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .island-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: var(--shadow-lg);
  }

  .island-card:active {
    transform: translateY(-2px) scale(1);
  }

  @media (hover: none) {
    .island-card:active {
      transform: scale(0.98);
    }
  }

  .island-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .island-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-md);
    border-radius: var(--radius-md) var(--radius-md) 0 0;
  }

  .island-content h3 {
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1rem, 3vw, 1.15rem);
    font-weight: 500;
    margin: 0;
    text-align: center;
    line-height: 1.3;
  }

  .stars-container {
    display: flex;
    justify-content: center;
    gap: clamp(0.125rem, 1vw, 0.25rem);
    flex-wrap: wrap;
  }

  .star {
    display: inline-flex;
    opacity: 0.3;
    transition: var(--transition-base);
  }

  .star.filled {
    opacity: 1;
    animation: pop 0.3s ease;
  }

  @keyframes pop {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  .completion-badge {
    position: absolute;
    top: var(--spacing-base);
    right: var(--spacing-base);
    color: white;
    width: clamp(28px, 7vw, 32px);
    height: clamp(28px, 7vw, 32px);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  /* ===== RESET SECTION ===== */
  .reset-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
  }

  .reset-button {
    border: none;
    background: transparent;
    color: var(--color-secondary);
    font-family: 'Fredoka', sans-serif;
    font-weight: 500;
    font-size: clamp(0.8rem, 2.5vw, 0.95rem);
    padding: var(--spacing-xs) var(--spacing-sm);
    cursor: pointer;
    opacity: 0.7;
    box-shadow: none;
    min-height: auto;
    transition: var(--transition-base);
  }

  .reset-button:hover {
    opacity: 1;
    transform: none;
    box-shadow: none;
  }

  .reset-button:focus,
  .reset-button:focus-visible {
    outline: none;
    box-shadow: none;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 480px) {
    .home-container {
      padding: var(--spacing-base);
    }

    .islands-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 768px) {
    .home-container {
      max-width: var(--layout-max-width);
      margin: 0 auto;
      padding-top: var(--spacing-xl);
    }

    .islands-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
  }

  @media (min-width: 1024px) {
    .islands-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
  }
</style>
