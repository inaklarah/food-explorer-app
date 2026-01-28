<script>
    import { fade, fly } from 'svelte/transition';
    import { islands } from '../data/islands.js';
    import { showPassiveComment } from '../stores/characterStore.js';
    
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

  // Favoriten nach Inseln gruppieren
  function groupByIsland(favorites) {
    const grouped = {};
    
    // Initialisiere alle Inseln
    islands.forEach(island => {
      grouped[island.title] = {
        island: island,
        favorites: []
      };
    });
    
    // Ordne Favoriten den Inseln zu
    favorites.forEach(fav => {
      if (grouped[fav.islandTitle]) {
        grouped[fav.islandTitle].favorites.push(fav);
      }
    });
    
    // Filtere leere Inseln und sortiere nach Anzahl
    return Object.values(grouped)
      .filter(group => group.favorites.length > 0)
      .sort((a, b) => b.favorites.length - a.favorites.length);
  }

  $: groupedFavorites = groupByIsland(favorites);

  // Ausgewählte Zutaten für Rezept-Generierung
  let selectedFavorites = new Set();

  // Toggle Auswahl
  function toggleSelection(favoriteId) {
    if (selectedFavorites.has(favoriteId)) {
      selectedFavorites.delete(favoriteId);
    } else {
      selectedFavorites.add(favoriteId);
    }
    selectedFavorites = selectedFavorites; // Trigger reactivity
  }

  // Alle auswählen/abwählen
  function toggleSelectAll() {
    if (selectedFavorites.size === favorites.length) {
      selectedFavorites.clear();
    } else {
      selectedFavorites = new Set(favorites.map(f => f.id));
    }
    selectedFavorites = selectedFavorites;
  }

  $: allSelected = selectedFavorites.size === favorites.length && favorites.length > 0;
  $: someSelected = selectedFavorites.size > 0 && selectedFavorites.size < favorites.length;

  // Rezept für ausgewählte Favoriten
  let loadingAllRecipe = false;
  let allRecipe = "";
  let selectedMealType = "mittag"; // frühstück, mittag, abendessen

  const mealTypes = [
    { value: "frühstück", label: "Frühstück", icon: "☀️" },
    { value: "mittag", label: "Mittagessen", icon: "🌤️" },
    { value: "abendessen", label: "Abendessen", icon: "🌙" }
  ];

  // Tiger-Kommentare für Rezepte
  const tigerRecipeComments = [
    "Wow! Das sieht richtig lecker aus! 🍽️",
    "Das würde ich auch gerne probieren! 😋",
    "Ein tolles Rezept! Du bist ein echter Koch! 👨‍🍳",
    "Mmmh, mir läuft das Wasser im Mund zusammen! 🐯",
    "Super Idee! Das wird bestimmt lecker! ⭐",
    "Ich bin stolz auf dich! So kreativ! 🎨"
  ];

  async function generateAllRecipe() {
    if (selectedFavorites.size === 0) return;
    loadingAllRecipe = true;
    allRecipe = "";
    
    // Nur ausgewählte Favoriten verwenden
    const selectedFoods = favorites
      .filter(f => selectedFavorites.has(f.id))
      .map(f => f.food);
    
    const zutaten = selectedFoods.join(', ');
    const mealTypeLabel = mealTypes.find(m => m.value === selectedMealType)?.label || "Mahlzeit";
    
    try {
      const response = await fetch('http://localhost:3000/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Erstelle ein einfaches, kinderfreundliches Rezept für ${mealTypeLabel}, das alle diese Zutaten verwendet: ${zutaten}. Das Rezept soll kurz, verständlich und motivierend sein. Keine langen Listen, maximal 5 Schritte. Berücksichtige, dass es für ${mealTypeLabel} geeignet sein soll.`
        })
      });
      if (!response.ok) throw new Error('Fehler beim Rezept-API-Aufruf');
      const data = await response.json();
      allRecipe = data.text || 'Kein Rezept gefunden.';
      
      // Tiger-Kommentar anzeigen
      const randomComment = tigerRecipeComments[Math.floor(Math.random() * tigerRecipeComments.length)];
      showPassiveComment(randomComment);
      
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
  <header>
    <button class="back-btn" on:click={onBack} aria-label="Zurück" style="color: #FF9B71">
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
    <span class="title" style="color: #FF9B71">Deine Lieblingsessen</span>
  </header>

  <!-- Content -->
  <div class="content">
    {#if favorites.length === 0}
      <div class="empty-state" in:fade>
        <div class="empty-icon">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#FF9B71" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h2>Noch keine Favoriten</h2>
        <p>Wenn dir etwas besonders gut schmeckt,<br>speichere es als Favorit!</p>
      </div>
    {:else}
      <!-- Nach Inseln gruppierte Favoriten -->
      <div class="islands-container">
        {#each groupedFavorites as group, index (group.island.title)}
          <div 
            class="island-section" 
            in:fly={{ y: 20, duration: 400, delay: index * 100 }}
          >
            <!-- Island Header -->
            <div class="island-header" style="background: {group.island.bg};">
              <div class="island-header-content">
                <div class="island-icon" style="border-color: {group.island.color};">
                  <img src={group.island.image} alt={group.island.title} />
                </div>
                <div class="island-info">
                  <h2 style="color: {group.island.color};">{group.island.title}</h2>
                  <p class="island-count">
                    {group.favorites.length} {group.favorites.length === 1 ? 'Favorit' : 'Favoriten'}
                  </p>
                </div>
              </div>
            </div>

            <!-- Favoriten-Liste -->
            <div class="favorites-list-inner">
              {#each group.favorites as favorite (favorite.id)}
                <div 
                  class="favorite-item" 
                  in:fade
                  style="border-left: 4px solid {group.island.color};"
                  class:selected={selectedFavorites.has(favorite.id)}
                >
                  <!-- Checkbox -->
                  <label class="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={selectedFavorites.has(favorite.id)}
                      on:change={() => toggleSelection(favorite.id)}
                    />
                    <span class="checkbox-custom" style="border-color: {group.island.color}; --check-color: {group.island.color};">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  </label>

                  <div class="item-icon" style="background: {group.island.bg};">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={group.island.color} stroke={group.island.color} stroke-width="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  
                  <div class="item-content">
                    <h3 class="food-name">{favorite.food}</h3>
                    <p class="timestamp">{favorite.timestamp}</p>
                  </div>

                  <button 
                    class="remove-btn" 
                    on:click={() => handleRemove(favorite.id)}
                    title="Aus Favoriten löschen"
                    aria-label="Entfernen"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if favorites.length > 0}
      <div class="recipe-section" in:fade={{delay: 300}}>
        <!-- Mahlzeit-Auswahl -->
        <div class="meal-type-selector">
          <span class="meal-type-label">Für welche Mahlzeit?</span>
          <div class="meal-type-options">
            {#each mealTypes as mealType}
              <button
                class="meal-type-btn"
                class:active={selectedMealType === mealType.value}
                on:click={() => selectedMealType = mealType.value}
              >
                <span class="meal-icon">{mealType.icon}</span>
                <span class="meal-label">{mealType.label}</span>
              </button>
            {/each}
          </div>
        </div>

        <!-- Rezept-Generator Button -->
        <button 
          class="recipe-generator-btn" 
          on:click={generateAllRecipe} 
          disabled={loadingAllRecipe || selectedFavorites.size === 0}
        >
          {#if loadingAllRecipe}
            <span class="spinner">⏳</span> Rezept wird erstellt...
          {:else if selectedFavorites.size === 0}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Wähle Zutaten für dein Rezept aus
          {:else}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Rezept aus {selectedFavorites.size} {selectedFavorites.size === 1 ? 'Zutat' : 'Zutaten'} erstellen
          {/if}
        </button>

        {#if allRecipe}
          <div class="recipe-box" in:fade>
            <div class="recipe-header">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <h2>Dein Lieblings-Rezept</h2>
            </div>
            <div class="recipe-content formatted-recipe">
              {@html formatRecipe(allRecipe)}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</main>

<style>
  /* Container */
  .favorites-view {
    min-height: 100vh;
    background: linear-gradient(180deg, #FFF9F0 0%, #FFF4E6 100%);
    display: flex;
    flex-direction: column;
    padding-bottom: clamp(6.25rem, 20vw, 8rem);
  }

  /* Header */
  header {
    display: flex;
    align-items: center;
    gap: clamp(0.75rem, 2vw, 1rem);
    margin-bottom: clamp(1.25rem, 3vw, 2rem);
    padding: clamp(1rem, 2vw, 1.5rem) clamp(1rem, 2vw, 1.5rem) 0;
  }

  .back-btn {
    width: clamp(2.75rem, 10vw, 3rem);
    height: clamp(2.75rem, 10vw, 3rem);
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
    color: #FF9B71;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .back-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  .back-btn:active {
    transform: scale(0.95);
  }

  .title {
    flex: 1;
    text-align: left;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1.125rem, 4vw, 1.375rem);
    font-weight: 700;
    letter-spacing: 0;
    min-width: 0;
  }

  /* Content */
  .content {
    flex: 1;
    padding: clamp(1rem, 3vw, 2rem);
    overflow-y: auto;
  }

  /* Empty State */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 25rem;
    text-align: center;
    padding: clamp(1rem, 2vw, 2rem);
  }

  .empty-icon {
    margin-bottom: clamp(1rem, 3vw, 2rem);
    animation: float 3s ease-in-out infinite;
    width: clamp(80px, 20vw, 120px);
    height: clamp(80px, 20vw, 120px);
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-1rem);
    }
  }

  .empty-state h2 {
    margin: 0 0 clamp(0.75rem, 2vw, 1rem) 0;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1.5rem, 5vw, 1.75rem);
    font-weight: 700;
    color: #7D5A3D;
  }

  .empty-state p {
    margin: 0;
    color: #A08875;
    font-size: clamp(0.95rem, 2.5vw, 1.0625rem);
    line-height: 1.6;
    font-weight: 500;
  }

  /* Islands Container */
  .islands-container {
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3vw, 2rem);
  }

  /* Island Section */
  .island-section {
    border-radius: clamp(1rem, 3vw, 1.25rem);
    overflow: hidden;
    background: white;
    box-shadow: 0 4px 16px rgba(125, 90, 61, 0.08);
  }

  /* Island Header */
  .island-header {
    padding: clamp(1rem, 2vw, 1.25rem);
    border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  }

  .island-header-content {
    display: flex;
    align-items: center;
    gap: clamp(0.75rem, 2vw, 1rem);
  }

  .island-icon {
    width: clamp(3rem, 10vw, 3.5rem);
    height: clamp(3rem, 10vw, 3.5rem);
    border-radius: 50%;
    border: 3px solid;
    overflow: hidden;
    flex-shrink: 0;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .island-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .island-info h2 {
    margin: 0;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1.125rem, 3vw, 1.375rem);
    font-weight: 700;
    letter-spacing: 0.01em;
    line-height: 1.3;
  }

  .island-count {
    margin: clamp(0.125rem, 0.5vw, 0.25rem) 0 0 0;
    font-size: clamp(0.8125rem, 2vw, 0.875rem);
    font-weight: 600;
    color: #A08875;
  }

  /* Favorites List (innerhalb der Inseln) */
  .favorites-list-inner {
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  /* Favorite Item (Listen-Darstellung) */
  .favorite-item {
    background: white;
    padding: clamp(0.75rem, 2vw, 1rem);
    display: flex;
    align-items: center;
    gap: clamp(0.75rem, 2vw, 1rem);
    border-bottom: 1px solid #FFE8D6;
    transition: all 0.2s ease;
    min-height: 3.5rem;
  }

  .favorite-item:last-child {
    border-bottom: none;
  }

  .favorite-item:hover {
    background: #FFFBF7;
  }

  .favorite-item.selected {
    background: #FFF9F0;
  }

  /* Checkbox */
  .checkbox-container {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .checkbox-container input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .checkbox-custom {
    width: clamp(1.25rem, 5vw, 1.5rem);
    height: clamp(1.25rem, 5vw, 1.5rem);
    border: 2.5px solid;
    border-radius: clamp(0.375rem, 1vw, 0.5rem);
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .checkbox-custom svg {
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.2s ease;
    width: 70%;
    height: 70%;
  }

  .checkbox-container input:checked + .checkbox-custom {
    background: var(--check-color, currentColor);
  }

  .checkbox-container input:checked + .checkbox-custom svg {
    opacity: 1;
    transform: scale(1);
  }

  .checkbox-container:hover .checkbox-custom {
    transform: scale(1.1);
  }

  .item-icon {
    width: clamp(2.5rem, 6vw, 2.75rem);
    height: clamp(2.5rem, 6vw, 2.75rem);
    border-radius: clamp(0.5rem, 1vw, 0.75rem);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .item-content {
    flex: 1;
    min-width: 0;
  }

  .food-name {
    margin: 0 0 clamp(0.125rem, 0.5vw, 0.25rem) 0;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(0.95rem, 2.5vw, 1.0625rem);
    font-weight: 700;
    color: #7D5A3D;
    letter-spacing: 0;
    line-height: 1.3;
    word-wrap: break-word;
  }

  .timestamp {
    margin: 0;
    font-size: clamp(0.75rem, 2vw, 0.8125rem);
    color: #C4B5A8;
    font-weight: 500;
  }

  .remove-btn {
    border: none;
    background: transparent;
    color: #D86941;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
    padding: clamp(0.25rem, 1vw, 0.5rem);
    min-width: 2.5rem;
    min-height: 2.5rem;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .remove-btn:hover {
    transform: scale(1.2);
    color: #B8472A;
  }

  .remove-btn:active {
    transform: scale(0.95);
  }

  /* Recipe Section */
  .recipe-section {
    margin-top: clamp(1.5rem, 3vw, 2rem);
    max-width: 100%;
    width: 100%;
  }

  /* Mahlzeit-Auswahl */
  .meal-type-selector {
    margin-bottom: clamp(1rem, 2vw, 1.5rem);
  }

  .meal-type-label {
    display: block;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(0.875rem, 2.5vw, 1rem);
    font-weight: 600;
    color: #7D5A3D;
    margin-bottom: clamp(0.5rem, 1.5vw, 0.75rem);
  }

  .meal-type-options {
    display: flex;
    gap: clamp(0.5rem, 1.5vw, 0.75rem);
    flex-wrap: wrap;
  }

  .meal-type-btn {
    flex: 1;
    min-width: clamp(100px, 25vw, 120px);
    padding: clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1rem);
    border: 2px solid #FFE8D6;
    border-radius: clamp(0.625rem, 1.5vw, 0.75rem);
    background: white;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(0.25rem, 1vw, 0.375rem);
    transition: all 0.2s ease;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    min-height: 2.75rem;
  }

  .meal-type-btn:hover {
    background: #FFF9F0;
    border-color: #FF9B71;
    transform: translateY(-2px);
  }

  .meal-type-btn.active {
    background: linear-gradient(135deg, #FF9B71 0%, #FFA07A 100%);
    border-color: #FF9B71;
    color: white;
  }

  .meal-icon {
    font-size: clamp(1.5rem, 4vw, 1.75rem);
    line-height: 1;
  }

  .meal-label {
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(0.8125rem, 2vw, 0.875rem);
    font-weight: 600;
  }

  .meal-type-btn.active .meal-label {
    color: white;
  }

  @media (max-width: 480px) {
    .meal-type-options {
      flex-direction: column;
    }

    .meal-type-btn {
      flex-direction: row;
      justify-content: center;
      min-width: 0;
    }
  }

  .recipe-generator-btn {
    width: 100%;
    padding: clamp(1rem, 2vw, 1.125rem) clamp(1.5rem, 3vw, 2rem);
    background: linear-gradient(135deg, #FF9B71 0%, #FFA07A 100%);
    color: white;
    border: none;
    border-radius: clamp(0.75rem, 2vw, 1rem);
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(0.95rem, 2.5vw, 1.0625rem);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(255, 133, 85, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(0.5rem, 1.5vw, 0.75rem);
    letter-spacing: 0.02em;
    min-height: 3rem;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .recipe-generator-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(255, 133, 85, 0.35);
    background: linear-gradient(135deg, #FFA07A 0%, #FF9B71 100%);
  }

  .recipe-generator-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 133, 85, 0.2);
  }

  .recipe-generator-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    display: inline-block;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .recipe-box {
    margin-top: clamp(1rem, 2vw, 1.5rem);
    background: white;
    border-radius: clamp(1.25rem, 3vw, 1.75rem);
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(139, 111, 71, 0.15);
  }

  .recipe-header {
    padding: clamp(1rem, 2vw, 1.5rem);
    background: linear-gradient(135deg, #FF9B71 0%, #FFB347 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(0.5rem, 1.5vw, 0.75rem);
  }

  .recipe-header h2 {
    margin: 0;
    color: white;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1.25rem, 4vw, 1.5rem);
    font-weight: 700;
    letter-spacing: 0;
  }

  .recipe-header svg {
    width: clamp(1.5rem, 5vw, 2rem);
    height: clamp(1.5rem, 5vw, 2rem);
    flex-shrink: 0;
  }

  .recipe-content {
    padding: clamp(1rem, 2vw, 1.75rem);
  }

  .formatted-recipe :global(p) {
    font-size: clamp(0.95rem, 2.5vw, 1.0625rem);
    color: #5A4A42;
    margin: clamp(0.75rem, 2vw, 1rem) 0;
    line-height: 1.7;
    font-weight: 500;
  }

  .formatted-recipe :global(ul) {
    margin: clamp(0.75rem, 2vw, 1rem) 0;
    padding-left: clamp(1rem, 3vw, 1.5rem);
  }

  .formatted-recipe :global(li) {
    margin-bottom: clamp(0.5rem, 1.5vw, 0.75rem);
    font-size: clamp(0.95rem, 2.5vw, 1.0625rem);
    color: #5A4A42;
    line-height: 1.6;
    font-weight: 500;
  }

  @media (max-width: 480px) {
    .content {
      padding: clamp(0.75rem, 2vw, 1rem);
    }

    header {
      padding: clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1rem) 0;
    }
  }

  @media (min-width: 768px) {
    .content {
      padding: clamp(1.5rem, 3vw, 2rem);
    }

    .recipe-section {
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
