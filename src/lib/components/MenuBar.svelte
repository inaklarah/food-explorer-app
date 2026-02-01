<script>
  import { createEventDispatcher } from 'svelte';
  
  export let currentView = 'home'; // 'home', 'islands', 'favorites'
  
  const dispatch = createEventDispatcher();
  
  function navigate(view) {
    dispatch('navigate', { view });
  }
</script>

<nav class="menu-bar">
  <button 
    class="menu-item" 
    class:active={currentView === 'home'}
    on:click={() => navigate('home')}
  >
    <span class="icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </span>
    <span class="label">Start</span>
  </button>
  
  <button 
    class="menu-item" 
    class:active={currentView === 'islands'}
    on:click={() => navigate('islands')}
  >
    <span class="icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </span>
    <span class="label">Inseln</span>
  </button>
  
  <button 
    class="menu-item" 
    class:active={currentView === 'favorites'}
    on:click={() => navigate('favorites')}
  >
    <span class="icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill={currentView === 'favorites' ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </span>
    <span class="label">Favoriten</span>
  </button>
</nav>

<style>
  /* ===== MENU BAR ===== */
  .menu-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--color-bg-card);
    display: flex;
    justify-content: space-around;
    padding: var(--spacing-sm) var(--spacing-xs) var(--spacing-sm);
    box-shadow: 0 -4px 20px var(--shadow-strong);
    z-index: var(--zIndex-menuBar);
    border-top: none;
    gap: var(--spacing-xs);
  }

  /* ===== MENU ITEM ===== */
  .menu-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm) var(--spacing-base);
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    color: var(--color-secondary-light);
    border-radius: var(--radius-full);
    min-height: 3rem;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    box-shadow: none;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    transition: var(--transition-base);
  }

  .menu-item:hover {
    background: var(--color-primary-soft);
  }

  .menu-item:active {
    background: var(--color-primary-soft);
  }

  .menu-item:focus,
  .menu-item:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .menu-item.active {
    color: var(--color-primary);
    background: var(--color-primary-soft);
  }

  /* ===== ICON ===== */
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(1.25rem, 6vw, 1.5rem);
    height: clamp(1.25rem, 6vw, 1.5rem);
  }

  /* ===== LABEL ===== */
  .label {
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(0.625rem, 2vw, 0.8rem);
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1.1;
  }

  /* Platz für die fixierte MenuBar schaffen */
  :global(body) {
    padding-bottom: clamp(4rem, 12vw, 5rem);
  }

  /* ===== RESPONSIVE ===== */
  @media (min-width: 768px) {
    .menu-bar {
      padding: var(--spacing-sm);
      gap: var(--spacing-lg);
    }

    .menu-item {
      padding: var(--spacing-sm) var(--spacing-md);
    }
  }
</style>
