<script>
    // Hilfsfunktion für schöne Formatierung (Absätze, Listen)
    function formatRecipe(text) {
      if (!text) return '';
      // Zeilenumbrüche zu Absätzen
      let html = text
        .replace(/\n\n+/g, '</p><p>')
        .replace(/\n/g, '<br>');
      // Listenpunkte
      html = html.replace(/(^|<br>)[\d]+\. /g, '<li>').replace(/(<li>.*?)(<br>|$)/g, '$1</li>');
      if (html.includes('<li>')) {
        html = html.replace(/(<li>)/, '<ul>$1').replace(/(<\/li>)(?!.*<li>)/, '$1</ul>');
      }
      // In einen Absatz packen, falls keine Listen
      if (!html.includes('<ul>')) html = `<p>${html}</p>`;
      return html;
    }
  // Rezept für alle Favoriten
  let loadingAllRecipe = false;
  let allRecipe = "";

  async function generateAllRecipe() {
    if (!favorites.length) return;
    loadingAllRecipe = true;
    allRecipe = "";
    const zutaten = favorites.map(f => f.food).join(', ');
    try {
      const response = await fetch('http://localhost:3000/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Erstelle ein einfaches, kinderfreundliches Rezept, das alle diese Zutaten verwendet: ${zutaten}. Das Rezept soll kurz, verständlich und motivierend sein. Keine langen Listen, maximal 5 Schritte.`
        })
      });
      if (!response.ok) throw new Error('Fehler beim Rezept-API-Aufruf');
      const data = await response.json();
      allRecipe = data.text || 'Kein Rezept gefunden.';
    } catch (err) {
      allRecipe = 'Fehler beim Generieren des Rezepts.';
    } finally {
      loadingAllRecipe = false;
    }
  }
  export let favorites = [];
  export let removeFavorite;
  export let onBack;

  function handleRemove(id) {
    removeFavorite(id);
  }
</script>

<main class="favorites-view">
  <!-- Header -->
  <header class="header">
    <button class="back-btn" on:click={onBack} aria-label="Zurück">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <h1>Deine Favoriten ❤️</h1>
  </header>

  <!-- Content -->
  <div class="content">
    {#if favorites.length === 0}
      <div class="empty-state">
        <div class="empty-icon">🍽️</div>
        <h2>Noch keine Favoriten</h2>
        <p>Wenn dir etwas schmeckt, speichere es mit dem ❤️-Button!</p>
      </div>
    {:else}
      <div class="favorites-list">
        <div class="favorites-header">
          <p class="count">Du magst {favorites.length} Lebensmittel/Rezepte:</p>
        </div>

        {#each favorites as favorite (favorite.id)}
          <div class="favorite-card">
            <div class="favorite-content">
              <div class="favorite-food">
                <h3>{favorite.food}</h3>
                <p class="island-tag">{favorite.islandTitle}</p>
              </div>
              

              <p class="timestamp">{favorite.timestamp}</p>
            </div>

            <button 
              class="remove-btn" 
              on:click={() => handleRemove(favorite.id)}
              title="Aus Favoriten löschen"
            >
              ✕
            </button>
          </div>
        {/each}
      </div>
    {/if}
    {#if favorites.length > 0}
      <div class="all-recipe-section">
        <button class="all-recipe-btn" on:click={generateAllRecipe} disabled={loadingAllRecipe}>
          {loadingAllRecipe ? 'Rezept wird generiert...' : 'Rezept aus allen Favoriten generieren'}
        </button>
        {#if allRecipe}
          <div class="favorite-recipe formatted-recipe">
            <h2>🍽️ Rezept für alle Favoriten</h2>
            <div class="recipe-text">
              {@html formatRecipe(allRecipe)}
            </div>
          </div>
        {/if}
        <!-- Hilfsfunktion für schöne Formatierung (Absätze, Listen) ist jetzt im <script>-Block -->
      </div>
    {/if}
  </div>
</main>

<style>
      .formatted-recipe {
        background: linear-gradient(135deg, #FFF0F6 0%, #E0F7FA 100%);
        border: 2px solid #FFB3C3;
        border-radius: 16px;
        padding: 24px;
        margin-top: 24px;
        box-shadow: 0 2px 8px rgba(255,107,157,0.07);
        max-width: 600px;
      }
      .formatted-recipe h2 {
        font-size: 22px;
        color: #FF6B9D;
        margin-bottom: 16px;
        text-align: center;
      }
      .formatted-recipe ul {
        margin: 12px 0 12px 24px;
        padding: 0;
        font-size: 16px;
      }
      .formatted-recipe p {
        font-size: 16px;
        color: #333;
        margin: 8px 0;
        line-height: 1.7;
      }
      .formatted-recipe li {
        margin-bottom: 8px;
        font-size: 16px;
        color: #5C7A2A;
      }
    .recipe-btn {
      margin-top: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      border: 2px solid #FFB3C3;
      background: #FFF5F8;
      color: #FF6B9D;
      font-family: "Inria Sans", system-ui, sans-serif;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .recipe-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  .favorites-view {
    min-height: 100vh;
    background: linear-gradient(135deg, #FFF5E6 0%, #FFE8E0 100%);
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .back-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: none;
    background: #f5f5f5;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    transition: all 0.2s;
  }

  .back-btn:hover {
    background: #e8e8e8;
    transform: translateX(-2px);
  }

  .header h1 {
    margin: 0;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #333;
  }

  .content {
    flex: 1;
    padding: 20px 24px;
    overflow-y: auto;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
  }

  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  .empty-state h2 {
    margin: 0 0 8px 0;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 20px;
    color: #333;
  }

  .empty-state p {
    margin: 0;
    color: #999;
    font-family: "Inria Sans", system-ui, sans-serif;
    max-width: 300px;
  }

  .favorites-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 600px;
    margin: 0 auto;
  }

  .favorites-header {
    padding: 12px 0;
    border-bottom: 2px solid #ddd;
  }

  .count {
    margin: 0;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-weight: 600;
    color: #333;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .favorite-card {
    background: white;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.2s;
  }

  .favorite-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .favorite-content {
    flex: 1;
  }

  .favorite-food h3 {
    margin: 0 0 4px 0;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #333;
  }

  .island-tag {
    margin: 0 0 12px 0;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .favorite-recipe {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 12px;
    margin: 12px 0;
  }

  .favorite-recipe p {
    margin: 0;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 13px;
    color: #555;
    line-height: 1.5;
  }

  .favorite-recipe p strong {
    display: block;
    color: #333;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .recipe-text {
    font-size: 12px;
  }

  .timestamp {
    margin: 8px 0 0 0;
    font-family: "Inria Sans", system-ui, sans-serif;
    font-size: 12px;
    color: #ccc;
  }

  .remove-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 2px solid #FFB3C3;
    background: white;
    color: #FF6B9D;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .remove-btn:hover {
    background: #FFE5ED;
    border-color: #FF1E7E;
    color: #FF1E7E;
  }

  .remove-btn:active {
    transform: scale(0.95);
  }

  @media (max-width: 600px) {
    .header {
      padding: 16px;
    }

    .content {
      padding: 16px;
    }

    .header h1 {
      font-size: 20px;
    }
  }
</style>
