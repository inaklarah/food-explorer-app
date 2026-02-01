
<script>
    import { createEventDispatcher } from 'svelte';
    import { showPassiveComment, lastEatenFood, currentTask } from '../stores/characterStore.js';
    
    const dispatch = createEventDispatcher();

    // Favoriten-Status für aktuelles food prüfen
    let isFavorited = false;
    $: if (food && food.trim().length > 0) {
      let favs = [];
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('foodExplorerFavorites');
        if (saved) {
          favs = JSON.parse(saved);
        }
      }
      isFavorited = favs.some(f => f.food?.toLowerCase() === food.trim().toLowerCase() && f.islandTitle === island.title);
    } else {
      isFavorited = false;
    }

    function addToFavorites() {
      if (!food.trim() || isFavorited) return;
      dispatch('addfavorite', { food: food.trim(), islandTitle: island.title });
      isFavorited = true;
    }
  export let island;
  export let onTaskComplete;
  
  let food = "";
  let loading = false;
  let error = null;
  let praise = "";
  let info = "";
  let submitted = false;

  // Verschiedene Lob-Nachrichten
  const praiseMessages = [
    "Super Versuch!",
    "Toll gemacht!",
    "Klasse Wahl!",
    "Du bist eine Entdeckerin!"
  ];

  // Tiger-Kommentare basierend auf Essen
  const tigerComments = [
    "Mmmh, das klingt lecker! 🥕",
    "Toll! Du hast etwas Neues probiert! ⭐",
    "Wow, das mag ich auch! 😋",
    "Super Entdeckung! 🌟",
    "Das sieht spannend aus! 👀",
    "Yummy! Das ist gesund! 💪"
  ];

  const islandPlaceholders = {
    Proteininsel: "z.B. Hähnchen, Linsen...",
    Gemüseinsel: "z.B. Karotte, Brokkoli...",
    Getreideinsel: "z.B. Hafer, Vollkornbrot...",
    Getränkeinsel: "z.B. Wasser, ungesüßter Tee...",
    Milchprodukteinsel: "z.B. Joghurt, Käse...",
    Obstinsel: "z.B. Apfel, Banane..."
  };

  $: placeholderText = islandPlaceholders[island?.title] || "z.B. Apfel, Karotte...";

  async function handleSubmit() {
      if (!food.trim()) return;
      loading = true;
      error = null;
      submitted = false;
      info = "";
      try {
        // Lebensmittel-Info vom Backend holen
        const foodResponse = await fetch("http://localhost:3001/food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ food: food.trim() })
        });

        if (!foodResponse.ok) {
          throw new Error(`Food API error: ${foodResponse.status}`);
        }

        const foodData = await foodResponse.json();

        if (!foodData.found) {
          error = `"${food}" nicht gefunden. Versuche mit einem anderen Namen!`;
          loading = false;
          return;
        }

        // KI-Info generieren lassen
        const aiResponse = await fetch("http://localhost:3000/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Erkläre für Kinder in 1-2 Sätzen, was an ${food} besonders ist und warum es gut ist. Keine Rezepte, keine langen Listen.`
          })
        });

        if (!aiResponse.ok) {
          throw new Error(`AI API error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        info = aiData.text || "Das ist ein tolles Lebensmittel!";
        praise = praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
        submitted = true;

        // Tiger-Kommentar anzeigen
        const randomComment = tigerComments[Math.floor(Math.random() * tigerComments.length)];
        showPassiveComment(randomComment);

        // Speichere Essen im Store für Tiger-Context
        lastEatenFood.set(food.trim());
        currentTask.set(island.title);

      } catch (err) {
        console.error("Error:", err);
        error = `Fehler: ${err.message}. Ist der Server aktiv?`;
      } finally {
        loading = false;
      }
    }

  function handleKeypress(e) {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  }

  function completeTask() {
    if (onTaskComplete) {
      onTaskComplete();
    }
    resetForm();
  }

  function resetForm() {
    food = "";
    praise = "";
    info = "";
    submitted = false;
  }
</script>

<div class="food-input-container">
  <div class="input-section">
    <label for="food-input">Was hast du gegessen?</label>
    <div class="input-wrapper">
      <input
        id="food-input"
        type="text"
        bind:value={food}
        on:keypress={handleKeypress}
        placeholder={placeholderText}
        disabled={loading}
        style="--accent-color: {island.color};"
      />
      <button
        class="submit-btn"
        on:click={handleSubmit}
        disabled={!food.trim() || loading}
        style="background: {island.button};"
      >
        {loading ? "..." : "→"}
      </button>
    </div>
  </div>

  {#if error}
    <div class="error">
      <p>{error}</p>
    </div>
  {/if}

  {#if submitted}
    <div>
      {#if praise}
        <div class="praise-message" style="color: {island.color};">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <p>{praise}</p>
        </div>
      {/if}
      <div class="info-box" style="background: {island.bg}; border-color: {island.color};">
        <p>{info}</p>
      </div>
      <div class="action-buttons">
        <button
          class="favorite-button"
          on:click={addToFavorites}
          disabled={!food.trim() || isFavorited}
          style="border: 2px solid {island.color}; color: {island.color}; background: white;"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          {isFavorited ? 'Schon gespeichert' : 'Als Favorit speichern'}
        </button>
        <button 
          class="complete-button" 
          on:click={completeTask} 
          style="background: {island.button};"
        >
          Aufgabe fertig
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .food-input-container {
    display: flex;
    flex-direction: column;
    gap: clamp(1rem, 3vw, 1.5rem);
    padding: clamp(1rem, 3vw, 1.5rem);
  }

  .input-section {
    display: flex;
    flex-direction: column;
    gap: clamp(0.75rem, 2vw, 1rem);
  }

  label {
    font-family: "Inria Sans", sans-serif;
    font-size: clamp(1rem, 2.5vw, 1.125rem);
    font-weight: 500;
    color: var(--color-secondary);
  }

  .input-wrapper {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
  }

  input {
    flex: 1;
    min-width: 0;
    padding: var(--spacing-md) var(--spacing-lg);
    border: 2px solid var(--color-border-light);
    border-radius: var(--radius-full);
    font-size: clamp(0.9375rem, 2vw, 1rem);
    font-family: var(--font-family-body);
    font-weight: 500;
    transition: var(--transition-base);
    background: white;
    color: var(--color-secondary);
    min-height: clamp(2.75rem, 8vw, 3rem);
  }

  input:focus {
    outline: none;
    border-color: var(--accent-color, var(--color-primary));
    background: white;
  }

  input::placeholder {
    color: var(--color-secondary-lighter);
  }

  input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  .submit-btn {
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    min-width: clamp(2.75rem, 8vw, 3.25rem);
    min-height: clamp(2.75rem, 8vw, 3.25rem);
    border: none;
    color: white;
    font-family: var(--font-family-body);
    font-size: clamp(1.125rem, 3vw, 1.25rem);
    font-weight: 500;
    line-height: 1;
    cursor: pointer;
    transition: var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .submit-btn:not(:disabled):hover {
    transform: scale(1.1);
  }

  .submit-btn:not(:disabled):active {
    transform: scale(0.95);
  }

  .error {
    background: #FFE8E8;
    border: 3px solid #FF6B6B;
    border-radius: clamp(0.75rem, 2vw, 1rem);
    padding: clamp(1rem, 2vw, 1.25rem);
  }

  .error p {
    margin: 0;
    color: #C92A2A;
    font-family: "Inria Sans", sans-serif;
    font-weight: 500;
    font-size: clamp(0.9375rem, 2vw, 1rem);
  }

  .praise-message {
    text-align: center;
    margin-bottom: clamp(1rem, 2vw, 1.5rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(0.5rem, 1.5vw, 0.75rem);
    animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .praise-message svg {
    width: clamp(2.5rem, 8vw, 3rem);
    height: clamp(2.5rem, 8vw, 3rem);
    animation: rotate 0.6s ease-in-out;
  }

  .praise-message p {
    font-family: "Inria Sans", sans-serif;
    font-size: clamp(1.25rem, 4vw, 1.5rem);
    font-weight: 500;
    margin: 0;
  }

  .info-box {
    border-radius: clamp(0.75rem, 2vw, 1rem);
    padding: clamp(1rem, 2vw, 1.5rem);
    border: 2px solid;
    margin-bottom: clamp(1rem, 2vw, 1.5rem);
  }

  .info-box p {
    margin: 0;
    color: var(--color-secondary);
    font-family: "Inria Sans", sans-serif;
    font-size: clamp(1rem, 2.5vw, 1.0625rem);
    line-height: 1.7;
    font-weight: 500;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: clamp(0.75rem, 2vw, 1rem);
  }

  .action-buttons button {
    padding: clamp(1rem, 2vw, 1.25rem) clamp(1.5rem, 3vw, 1.75rem);
    border: none;
    border-radius: clamp(0.75rem, 2vw, 1rem);
    font-family: "Inria Sans", sans-serif;
    font-size: clamp(1rem, 2.5vw, 1.0625rem);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    letter-spacing: 0.02em;
    min-height: 3rem;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    box-shadow: none;
  }

  .action-buttons .favorite-button {
    border-width: 2px !important;
  }

  .complete-button {
    color: white;
  }

  .action-buttons button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-buttons button:not(:disabled):hover {
    transform: none;
    box-shadow: none;
  }

  .action-buttons button:not(:disabled):active {
    transform: none;
    box-shadow: none;
  }

  @keyframes popIn {
    0% {
      transform: scale(0) rotate(-15deg);
      opacity: 0;
    }
    70% {
      transform: scale(1.1) rotate(5deg);
    }
    100% {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg) scale(0);
    }
    50% {
      transform: rotate(180deg) scale(1.2);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }

  @media (max-width: 480px) {
    .food-input-container {
      padding: 0.75rem;
    }

    .action-buttons button {
      width: 100%;
    }
  }

  @media (min-width: 768px) {
    .action-buttons {
      flex-direction: row;
      gap: clamp(1rem, 2vw, 1.5rem);
    }

    button {
      flex: 1;
    }
  }
</style>
