<script>
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  
  export let islands = [];
  export let favorites = [];
  
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
      <span class="stat-value">{remainingTasks}</span>
      <span class="stat-label">Aufgaben offen</span>
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
        style="background: {island.bg};"
        on:click={() => selectIsland(index)}
      >
        <div class="island-image-container">
          {#if island.image}
            <img src={island.image} alt={island.title} class="island-image" />
          {/if}
        </div>
        
        <div class="island-content">
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
</div>

<style>
  .home-container {
    padding: 1rem;
    padding-bottom: clamp(6.25rem, 20vw, 8rem);
    max-width: 100%;
    margin: 0 auto;
    background: linear-gradient(180deg, #FFF9F0 0%, #FFF4E6 100%);
    min-height: 100vh;
  }

  .home-header {
    text-align: center;
    margin-bottom: max(1.5rem, 2vw);
    margin-top: 0.75rem;
  }

  .home-header h1 {
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1.75rem, 6vw, 2.5rem);
    margin-bottom: 0.75rem;
    color: #7D5A3D;
    letter-spacing: 0.01em;
    line-height: 1.3;
  }

  .subtitle {
    color: #A08875;
    font-size: clamp(0.95rem, 3.5vw, 1.1rem);
    font-weight: 500;
    line-height: 1.5;
  }

  .stats-card {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
    background: white;
    border-radius: clamp(1.5rem, 4vw, 1.75rem);
    padding: clamp(1.25rem, 4vw, 1.75rem);
    margin-bottom: clamp(1.5rem, 4vw, 2rem);
    box-shadow: 0 4px 16px rgba(139, 111, 71, 0.12);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .stat-icon {
    width: clamp(2.75rem, 8vw, 3rem);
    height: clamp(2.75rem, 8vw, 3rem);
    background: linear-gradient(135deg, #FFE8CC 0%, #FFD4A3 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FF9B71;
    flex-shrink: 0;
  }

  .stat-value {
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1.5rem, 5vw, 2.25rem);
    font-weight: 700;
    color: #7D5A3D;
  }

  .stat-label {
    font-size: clamp(0.75rem, 2.5vw, 0.95rem);
    color: #A08875;
    font-weight: 600;
    text-align: center;
  }

  .islands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(clamp(140px, 40vw, 180px), 1fr));
    gap: clamp(0.75rem, 3vw, 1.25rem);
    padding: 0 clamp(0, 2vw, 1rem);
  }

  .island-card {
    position: relative;
    border: none;
    border-radius: clamp(1.25rem, 3vw, 1.5rem);
    padding: clamp(0.75rem, 3vw, 1.25rem);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(139, 111, 71, 0.15);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: clamp(200px, 50vw, 220px);
    text-align: left;
    touch-action: manipulation;
    min-width: 0;
  }

  .island-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 8px 24px rgba(139, 111, 71, 0.25);
  }

  .island-card:active {
    transform: translateY(-2px) scale(1);
  }

  @media (hover: none) {
    .island-card:active {
      transform: scale(0.98);
    }
  }

  .island-image-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 90px;
  }

  .island-image {
    max-width: clamp(70px, 15vw, 90px);
    max-height: clamp(70px, 15vw, 90px);
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(139, 111, 71, 0.15));
    transition: transform 0.3s ease;
  }

  .island-card:hover .island-image {
    transform: scale(1.1) rotate(5deg);
  }

  .island-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .island-content h3 {
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1rem, 3vw, 1.15rem);
    font-weight: 600;
    margin: 0;
    text-align: center;
    letter-spacing: 0;
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
    transition: all 0.2s ease;
  }

  .star.filled {
    opacity: 1;
    animation: pop 0.3s ease;
  }

  @keyframes pop {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  .completion-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: white;
    width: clamp(28px, 7vw, 32px);
    height: clamp(28px, 7vw, 32px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    .home-container {
      padding: 0.75rem;
    }

    .home-header h1 {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }

    .islands-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 768px) {
    .home-container {
      max-width: 900px;
      padding-top: 2rem;
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
