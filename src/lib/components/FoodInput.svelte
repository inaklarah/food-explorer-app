
<script>
    import { createEventDispatcher } from 'svelte';
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
    "🌟 Super Versuch!",
    "✨ Toll gemacht!",
    "🎉 Klasse Wahl!",
    "⭐ Du bist eine Entdeckerin!"
  ];

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
        placeholder="z.B. Apfel, Karotte..."
        disabled={loading}
        style="border-color: {island.color}"
      />
    </div>
    <div class="button-row">
      <button
        on:click={handleSubmit}
        disabled={!food.trim() || loading}
        style="background: {island.button}"
      >
        {loading ? "⏳" : "Absenden"}
      </button>
      {#if submitted}
        <button
          class="favorite-button"
          on:click={addToFavorites}
          disabled={!food.trim() || isFavorited}
          style="border: 2px solid {island.color}; color: {isFavorited ? '#aaa' : island.color}; background: white; margin-left: 8px;"
        >
          {isFavorited ? 'Schon als Favorit' : 'Zu Favoriten'}
        </button>
      {/if}
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
        <div class="praise-message">{praise}</div>
      {/if}
      <div class="recipe-box">
        <p>{info}</p>
      </div>
      <div class="action-buttons">
        <button 
          class="complete-button" 
          on:click={completeTask} 
          style="background: {island.button}"
        >
          ✓ Aufgabe fertig
        </button>
      </div>
    </div>

  {/if}
</div>

<style>
      .button-row {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        flex-wrap: wrap;
      }
    .favorite-button {
      flex: 1;
      min-width: 160px;
      padding: 14px;
      border-radius: 12px;
      font-family: "Inria Sans", system-ui, sans-serif;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .favorite-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  .food-input-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .input-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  label {
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .input-wrapper {
    display: flex;
    gap: 8px;
  }

  input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #ddd;
    border-radius: 12px;
    font-size: 16px;
    font-family: "Inria Sans", system-ui, sans-serif;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: currentColor;
  }

  input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  button {
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    color: white;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:not(:disabled):hover {
    opacity: 0.9;
    transform: scale(1.02);
  }

  button:not(:disabled):active {
    transform: scale(0.98);
  }

  .error {
    background: #FFE0E0;
    border: 2px solid #FF6B6B;
    border-radius: 12px;
    padding: 16px;
  }

  .error p {
    margin: 0;
    color: #C92A2A;
    font-family: "Inria Sans", system-ui, sans-serif;
  }


  .praise-message {
    text-align: center;
    font-size: 28px;
    margin-bottom: 16px;
    animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .recipe-box {
    background: #F8F9FA;
    border-radius: 12px;
    padding: 16px;
    border-left: 4px solid #5C7A2A;
    margin-bottom: 16px;
  }

  .recipe-box p {
    margin: 0;
    color: #555;
    font-family: "Inria Sans", system-ui, sans-serif;
    line-height: 1.6;
  }

  .action-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }



  .complete-button {
    flex: 1;
    min-width: 160px;
    padding: 14px;
    color: white;
    border: none;
    border-radius: 12px;
  }

  .complete-button:hover {
    opacity: 0.9;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes popIn {
    0% {
      transform: scale(0) rotate(-10deg);
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
</style>
