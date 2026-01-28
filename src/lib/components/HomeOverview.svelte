<script>
  import { createEventDispatcher } from 'svelte';
  
  export let islands = [];
  export let favorites = [];
  
  const dispatch = createEventDispatcher();
  
  function selectIsland(index) {
    dispatch('selectisland', { index });
  }
  
  // Berechne Fortschritt für jede Insel
  function getIslandProgress(island) {
    const islandFavorites = favorites.filter(f => f.islandTitle === island.title);
    const total = island.tasks.length;
    const completed = Math.min(islandFavorites.length, total);
    return { completed, total };
  }
  
  // Generiere Sterne für visuellen Fortschritt
  function getStars(completed, total) {
    return Array.from({ length: total }, (_, i) => i < completed);
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
      <span class="stat-value">{islands.length}</span>
      <span class="stat-label">Inseln</span>
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
    padding: 1.5rem;
    padding-bottom: 100px;
    max-width: 800px;
    margin: 0 auto;
    background: linear-gradient(180deg, #FFF9F0 0%, #FFF4E6 100%);
    min-height: 100vh;
  }

  .home-header {
    text-align: center;
    margin-bottom: 2rem;
    margin-top: 1rem;
  }

  .home-header h1 {
    font-family: 'Inria Sans', sans-serif;
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    color: #7D5A3D;
    letter-spacing: 0.01em;
  }

  .subtitle {
    color: #A08875;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .stats-card {
    display: flex;
    justify-content: space-around;
    background: white;
    border-radius: 28px;
    padding: 1.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 16px rgba(139, 111, 71, 0.12);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #FFE8CC 0%, #FFD4A3 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FF9B71;
  }

  .stat-value {
    font-family: 'Inria Sans', sans-serif;
    font-size: 2.25rem;
    font-weight: 700;
    color: #7D5A3D;
  }

  .stat-label {
    font-size: 0.95rem;
    color: #A08875;
    font-weight: 600;
  }

  .islands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.25rem;
  }

  .island-card {
    position: relative;
    border: none;
    border-radius: 24px;
    padding: 1.25rem;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(139, 111, 71, 0.15);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 220px;
    text-align: left;
  }

  .island-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 8px 24px rgba(139, 111, 71, 0.25);
  }

  .island-card:active {
    transform: translateY(-2px) scale(1);
  }

  .island-image-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 90px;
  }

  .island-image {
    max-width: 90px;
    max-height: 90px;
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
    gap: 0.75rem;
  }

  .island-content h3 {
    font-family: 'Inria Sans', sans-serif;
    font-size: 1.15rem;
    font-weight: 600;
    margin: 0;
    text-align: center;
    letter-spacing: 0;
  }

  .stars-container {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
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
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 600px) {
    .home-header h1 {
      font-size: 2rem;
    }
    
    .islands-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
