<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  import FoodInput from "./FoodInput.svelte";
  
  export let island;
  export let onBack;
  export let favorites = [];
  
  let completedTasks = [];
  
  // Beim Start: Gespeicherte Aufgaben laden
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`island_${island.title}_completed`);
    if (saved) {
      completedTasks = JSON.parse(saved);
    }
  }
  
  $: currentTaskIndex = completedTasks.length;
  $: currentTask = island.tasks[currentTaskIndex];
  $: isComplete = currentTaskIndex >= island.tasks.length;
  
  // Generiere Sterne für visuellen Fortschritt
  function getStars(completed, total) {
    return Array.from({ length: total }, (_, i) => i < completed);
  }
  
  $: stars = getStars(completedTasks.length, island.tasks.length);
  
  function completeTask() {
    completedTasks = [...completedTasks, currentTask.id];
    
    // Speichere die erledigten Aufgaben
    if (typeof window !== 'undefined') {
      localStorage.setItem(`island_${island.title}_completed`, JSON.stringify(completedTasks));
    }
  }
</script>

<div class="island-detail-container" style="background: linear-gradient(180deg, {island.bg}22 0%, #FFF9F0 100%);">
<header>
  <button class="back" on:click={onBack} aria-label="Zurück" style="color: {island.color}">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  </button>
  <span class="title" style="color: {island.color}">{island.title}</span>
</header>

<!-- Progress mit Sternen -->
<div class="stars-progress">
  {#each stars as filled}
    <span class="star" class:filled style="color: {island.color};">
      <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
        <line x1="4" y1="22" x2="4" y2="15"/>
      </svg>
    </span>
  {/each}
</div>
<p class="progress-text" style="color: {island.color}">{completedTasks.length} von {island.tasks.length} Aufgaben geschafft</p>

  {#if isComplete}
    <section class="completion-section" style="background: {island.bg};">
      <div class="celebration-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="{island.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <h2 style="color: {island.color};">Super gemacht!</h2>
      <p>Du hast alle Aufgaben auf dieser Insel geschafft!</p>
      
      {#if favorites.length > 0}
        <div class="favorites-preview">
          <p class="preview-label">Deine Favoriten</p>
          <div class="favorites-mini">
            {#each favorites.slice(-3) as fav}
              <span class="mini-fav" style="background: {island.bg}; border-color: {island.color}; color: {island.color};">{fav.food}</span>
            {/each}
          </div>
        </div>
      {/if}

      <button class="back-button" on:click={onBack} style="background: linear-gradient(180deg, {island.button} 0%, {island.button}dd 100%); box-shadow: 0 6px 0 {island.color}99;">
        Zurück zur Übersicht
      </button>
    </section>
  {:else}
    <!-- Task Section -->
    <section class="task-section" style="background: {island.bg};">
      <div class="task-badge" style="background: {island.color};">
        <span>Aufgabe {currentTaskIndex + 1}</span>
      </div>
      <h2 style="color: {island.color};">{currentTask.title}</h2>
      <p>{currentTask.description}</p>
    </section>

    <!-- Food Input Component -->
    <FoodInput 
      {island} 
      onTaskComplete={completeTask}
      on:addfavorite={e => dispatch('addfavorite', e.detail)}
    />
  {/if}
</div>

<style>
  .island-detail-container {
    padding: clamp(1rem, 3vw, 1.5rem);
    padding-bottom: clamp(7.5rem, 20vw, 8rem);
    min-height: 100vh;
  }

  /* Header */
  header {
    display: flex;
    align-items: center;
    gap: clamp(0.75rem, 2vw, 1rem);
    margin-bottom: clamp(1.25rem, 3vw, 2rem);
    padding-top: 0.5rem;
  }

  .back {
    width: clamp(3rem, 10vw, 3rem);
    height: clamp(3rem, 10vw, 3rem);
    min-width: 3rem;
    min-height: 3rem;
    padding: 0;
    background: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .back:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  .back:active {
    transform: scale(0.95);
  }

  .title {
    flex: 1;
    text-align: left;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1.25rem, 4vw, 1.375rem);
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.3;
    min-width: 0;
    word-wrap: break-word;
  }

  /* Progress mit Sternen */
  .stars-progress {
    display: flex;
    justify-content: center;
    gap: clamp(0.25rem, 1vw, 0.5rem);
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }

  .star {
    display: inline-flex;
    opacity: 0.25;
    transition: all 0.3s ease;
    min-width: fit-content;
  }

  .star.filled {
    opacity: 1;
    transform: scale(1.15);
    animation: starPop 0.4s ease;
  }

  @keyframes starPop {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1.15);
    }
  }

  .progress-text {
    text-align: center;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(0.875rem, 2.5vw, 1rem);
    font-weight: 400;
    margin-bottom: clamp(1rem, 3vw, 1.5rem);
  }

  /* Task Section */
  .task-section {
    border-radius: clamp(1.5rem, 4vw, 1.75rem);
    padding: clamp(1.25rem, 4vw, 2rem);
    margin-bottom: clamp(1rem, 3vw, 1.5rem);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
  }

  .task-badge {
    display: inline-block;
    color: white;
    padding: clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.75rem, 2.5vw, 1.25rem);
    border-radius: 50px;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(0.75rem, 2vw, 0.875rem);
    font-weight: 400;
    margin-bottom: clamp(0.75rem, 2vw, 1.25rem);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .task-section h2 {
    margin: 0 0 clamp(0.75rem, 2vw, 1rem) 0;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1.5rem, 5vw, 1.75rem);
    font-weight: 400;
    line-height: 1.3;
    letter-spacing: 0;
  }

  .task-section p {
    margin: 0;
    color: #5A4A42;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1rem, 3vw, 1.0625rem);
    line-height: 1.6;
    font-weight: 400;
  }

  /* Completion Section */
  .completion-section {
    border-radius: clamp(1.5rem, 4vw, 1.75rem);
    padding: clamp(1.5rem, 4vw, 2rem);
    text-align: center;
    margin-bottom: 1.5rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    animation: celebrationPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes celebrationPop {
    0% {
      opacity: 0;
      transform: scale(0.8) translateY(20px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .celebration-icon {
    margin: 0 auto clamp(1rem, 2vw, 1.5rem);
    animation: rotate 2s ease-in-out infinite;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes rotate {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-15deg);
    }
    75% {
      transform: rotate(15deg);
    }
  }

  .completion-section h2 {
    margin: 0 0 clamp(0.75rem, 2vw, 1rem) 0;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1.75rem, 6vw, 2rem);
    font-weight: 400;
    letter-spacing: 0;
  }

  .completion-section p {
    margin: 0 0 clamp(1rem, 3vw, 1.5rem) 0;
    color: #5A4A42;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1rem, 3vw, 1.125rem);
    font-weight: 400;
  }

  .favorites-preview {
    background: white;
    border-radius: clamp(1rem, 3vw, 1.5rem);
    padding: clamp(1rem, 3vw, 1.5rem);
    margin-bottom: clamp(1rem, 3vw, 2rem);
  }

  .preview-label {
    margin: 0 0 clamp(0.75rem, 2vw, 1rem) 0;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(0.875rem, 2.5vw, 1rem);
    font-weight: 400;
    color: #5A4A42;
  }

  .favorites-mini {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(0.5rem, 2vw, 0.75rem);
    justify-content: center;
  }

  .mini-fav {
    padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1.25rem);
    border-radius: 50px;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(0.875rem, 2vw, 0.9375rem);
    font-weight: 400;
    border: 2px solid;
  }

  .back-button {
    padding: clamp(1rem, 3vw, 1.25rem) clamp(1.5rem, 4vw, 2.25rem);
    border: none;
    border-radius: clamp(0.75rem, 2vw, 1rem);
    color: white;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1rem, 2.5vw, 1.0625rem);
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(255, 133, 85, 0.25);
    letter-spacing: 0.02em;
    min-height: 3rem;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .back-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(255, 133, 85, 0.35);
  }

  .back-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 133, 85, 0.2);
  }

  @media (max-width: 480px) {
    .island-detail-container {
      padding: 0.75rem;
      padding-bottom: 7rem;
    }

    .title {
      font-size: 1.125rem;
    }

    .task-section h2 {
      font-size: 1.5rem;
    }

    .completion-section h2 {
      font-size: 1.625rem;
    }
  }

  @media (min-width: 768px) {
    .island-detail-container {
      padding: 2rem;
      padding-bottom: 5rem;
    }

    .task-section {
      padding: 2.5rem;
    }

    .completion-section {
      padding: 3rem 2rem;
    }
  }
</style>
