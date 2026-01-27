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
  
  function completeTask() {
    completedTasks = [...completedTasks, currentTask.id];
    
    // Speichere die erledigten Aufgaben
    if (typeof window !== 'undefined') {
      localStorage.setItem(`island_${island.title}_completed`, JSON.stringify(completedTasks));
    }
  }
</script>

<header>
  <button class="back" on:click={onBack} aria-label="Zurück" style="color: {island.color}">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="29"
      height="29"
      viewBox="0 0 29 29"
      fill="none"
    >
      <path
        d="M24.1666 14.5L4.83331 14.5
           M4.83331 14.5L12.0833 7.25
           M4.83331 14.5L12.0833 21.75"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="mix-blend-mode: plus-darker"
      />
    </svg>
  </button>
  <span class="title" style="color: {island.color}">{island.title}</span>
</header>

<!-- Progress -->
<div class="progress-bar">
  <div class="progress-fill" style="width: {(completedTasks.length / island.tasks.length) * 100}%; background: {island.color}"></div>
</div>
<p class="progress-text">{completedTasks.length} / {island.tasks.length} Aufgaben auf dieser Insel</p>

  {#if isComplete}
    <section class="completion-section" style="border-color: {island.color}">
      <h2 style="color: {island.color}">🎉 Insel-Aufgaben fertig!</h2>
      <p>Großartig, dass du alle Aufgaben auf dieser Insel gemeistert hast!</p>
      
      {#if favorites.length > 0}
        <div class="favorites-preview">
          <p class="preview-label">Du hast {favorites.length} Favoriten gesammelt:</p>
          <div class="favorites-mini">
            {#each favorites.slice(-3) as fav}
              <span class="mini-fav">{fav.food}</span>
            {/each}
          </div>
        </div>
      {/if}

      <button class="back-button" on:click={onBack} style="background: {island.button}">
        ← Zurück zur Übersicht
      </button>
    </section>
  {:else}
    <!-- Task Section -->
    <section class="task-section" style="border-color: {island.color}">
      <div class="task-number">Aufgabe {currentTaskIndex + 1} von {island.tasks.length}</div>
      <h2 style="color: {island.color}">{currentTask.title}</h2>
      <p>{currentTask.description}</p>
    </section>

    <!-- Food Input Component -->
    <FoodInput 
      {island} 
      onTaskComplete={completeTask}
      on:addfavorite={e => dispatch('addfavorite', e.detail)}
    />
  {/if}


<style>

  /* Pfeil-Button */
  .back {
    width: 29px;
    height: 29px;
    padding: 0;

    background: none;
    border: none;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    transform: translateY(6px);
    margin: 0;
    transition: opacity 0.2s;
  }

  .back:hover {
    opacity: 0.7;
  }

  /* Titel */
  .title {
    flex: 1;
    text-align: left;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  /* Week Badge */

  /* Progress Bar */
  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 10px;
    margin-bottom: 8px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.3s ease;
    border-radius: 10px;
  }

  .progress-text {
    text-align: center;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 12px;
    color: #666;
    margin-bottom: 24px;
  }

  /* Task Section */
  .task-section {
    background: white;
    border-left: 4px solid;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
  }

  .task-number {
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 12px;
    color: #999;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .task-section h2 {
    margin: 0 0 8px 0;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 24px;
    font-weight: 700;
  }

  .task-section p {
    margin: 0;
    color: #666;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }

  /* Completion Section */
  .completion-section {
    background: white;
    border-left: 4px solid;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    margin-bottom: 24px;
    animation: slideIn 0.4s ease-out;
  }

  .completion-section h2 {
    margin: 0 0 16px 0;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 28px;
    font-weight: 700;
  }

  .completion-section p {
    margin: 0 0 24px 0;
    color: #666;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 16px;
  }

  .favorites-preview {
    background: #FFF5E6;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 24px;
  }

  .preview-label {
    margin: 0 0 12px 0;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .favorites-mini {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .mini-fav {
    background: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #FF6B9D;
    border: 1px solid #FFD4E5;
  }

  .back-button {
    padding: 12px 32px;
    border: none;
    border-radius: 12px;
    color: white;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .back-button:hover {
    opacity: 0.9;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 600px) {
    .title {
      font-size: 16px;
    }

  }
</style>
