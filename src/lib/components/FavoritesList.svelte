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
    { value: "frühstück", label: "Frühstück" },
    { value: "mittag", label: "Mittagessen" },
    { value: "abendessen", label: "Abendessen" }
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

  // PDF-Download-Funktion
  function downloadRecipePDF() {
    if (!allRecipe) return;
    
    const selectedFoods = favorites
      .filter(f => selectedFavorites.has(f.id))
      .map(f => f.food);
    const mealTypeLabel = mealTypes.find(m => m.value === selectedMealType)?.label || "Mahlzeit";
    
    // Erstelle den PDF-Inhalt als Text
    const pdfContent = `
DEIN LIEBLINGS-REZEPT
Mahlzeit: ${mealTypeLabel}

Zutaten:
${selectedFoods.map(food => `- ${food}`).join('\n')}

Rezept:
${allRecipe.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}

Erstellt am: ${new Date().toLocaleDateString('de-DE')}
    `.trim();
    
    // Erstelle Blob und Download
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rezept-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Bilde Inseltitel auf Tiger-Bilder ab (wie in HomeOverview)
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
    <div class="header-content">
      <h1>Favoriten</h1>
      <p class="header-description">Hier findest du alle deine gespeicherten Lieblingsessen</p>
      {#if favorites.length > 0}
        <p class="header-instruction">Wähle Zutaten aus, um ein Rezept zu erstellen</p>
      {/if}
    </div>
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
              <span class="meal-label">{mealType.label}</span>
            </button>
          {/each}
        </div>
      </div>

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
                  <img src={getTigerImage(group.island.title)} alt={group.island.title} />
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
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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

    {#if favorites.length > 0 && allRecipe}
      <div class="recipe-section" in:fade={{delay: 300}}>
        {#if allRecipe}
          <div class="recipe-box" in:fade>
            <div class="recipe-header">
              <h2>Dein Lieblings-Rezept</h2>
              <button class="download-btn" on:click={downloadRecipePDF} title="Als Textdatei herunterladen">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download
              </button>
            </div>
            
            <div class="recipe-meta">
              <div class="meta-item">
                <span class="meta-label">Mahlzeit:</span>
                <span class="meta-value">{mealTypes.find(m => m.value === selectedMealType)?.label}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Zutaten:</span>
                <span class="meta-value">{selectedFavorites.size} ausgewählt</span>
              </div>
            </div>
            
            <div class="recipe-content formatted-recipe">
              {@html formatRecipe(allRecipe)}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Fixed Recipe Generator Button -->
  {#if favorites.length > 0}
    <button 
      class="recipe-generator-btn-fixed" 
      on:click={generateAllRecipe} 
      disabled={loadingAllRecipe || selectedFavorites.size === 0}
    >
      {#if loadingAllRecipe}
        Rezept wird erstellt...
      {:else}
        Kreiere ein Rezept
      {/if}
    </button>
  {/if}
</main>

<style>
  /* ===== MAIN CONTAINER ===== */
  .favorites-view {
    min-height: 100vh;
    background: linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
    display: flex;
    flex-direction: column;
    padding-bottom: var(--layout-padding-bottom);
  }

  /* ===== HEADER ===== */
  header {
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg) var(--spacing-md);
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
  }

  .header-content {
    text-align: left;
  }

  header h1 {
    margin: 0 0 var(--spacing-xs) 0;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1.5rem, 5vw, 2rem);
    font-weight: 700;
    color: var(--color-secondary);
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .header-description {
    margin: 0;
    font-size: clamp(0.875rem, 3vw, 1rem);
    color: var(--color-secondary-light);
    font-weight: 400;
    line-height: 1.5;
    max-width: 28rem;
  }

  .header-instruction {
    margin: 0;
    font-size: clamp(0.875rem, 3vw, 1rem);
    color: var(--color-secondary-light);
    font-weight: 400;
    line-height: 1.5;
    max-width: 28rem;
  }

  /* ===== CONTENT ===== */
  .content {
    flex: 1;
    padding: 0 var(--spacing-md) var(--spacing-lg);
    overflow-y: auto;
  }

  /* ===== EMPTY STATE ===== */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 25rem;
    text-align: center;
    padding: var(--spacing-xl);
  }

  .empty-icon {
    margin-bottom: var(--spacing-xl);
    animation: float 3s ease-in-out infinite;
    width: clamp(80px, 20vw, 120px);
    height: clamp(80px, 20vw, 120px);
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-1rem); }
  }

  .empty-state h2 {
    margin: 0 0 var(--spacing-md) 0;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1.5rem, 5vw, 1.75rem);
    font-weight: 500;
    color: var(--color-secondary);
  }

  .empty-state p {
    margin: 0;
    color: var(--color-secondary-light);
    font-size: clamp(0.95rem, 2.5vw, 1.0625rem);
    line-height: 1.6;
    font-weight: 500;
  }

  /* ===== INSTRUCTION ===== */
  .favorites-instruction {
    margin: 0 0 var(--spacing-lg) 0;
    text-align: left;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(0.9375rem, 2.5vw, 1rem);
    font-weight: 500;
    color: var(--color-secondary);
    padding: var(--spacing-md) 0;
  }

  /* ===== ISLANDS CONTAINER ===== */
  .islands-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }

  /* ===== ISLAND SECTION ===== */
  .island-section {
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--color-bg-card);
    box-shadow: var(--shadow-md);
  }

  /* ===== ISLAND HEADER ===== */
  .island-header {
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .island-header-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .island-icon {
    width: clamp(2.5rem, 8vw, 3rem);
    height: clamp(2.5rem, 8vw, 3rem);
    border-radius: 50%;
    border: 2px solid;
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

  .island-info {
    flex: 1;
    min-width: 0;
  }

  .island-info h2 {
    margin: 0;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1rem, 3vw, 1.125rem);
    font-weight: 700;
    letter-spacing: 0;
    line-height: 1.3;
    text-align: left;
  }

  .island-count {
    margin: var(--spacing-xs) 0 0 0;
    font-size: clamp(0.75rem, 2vw, 0.875rem);
    font-weight: 400;
    color: var(--color-secondary-light);
    text-align: left;
  }

  /* ===== FAVORITES LIST ===== */
  .favorites-list-inner {
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  /* ===== FAVORITE ITEM ===== */
  .favorite-item {
    background: var(--color-bg-card);
    padding: var(--spacing-md) var(--spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    border-bottom: 1px solid var(--color-border-light);
    transition: var(--transition-base);
    min-height: 4rem;
  }

  .favorite-item:last-child {
    border-bottom: none;
  }

  .favorite-item:hover {
    background: var(--color-primary-soft);
  }

  .favorite-item.selected {
    background: var(--color-primary-soft);
    border-left-width: 4px;
  }

  /* ===== CHECKBOX ===== */
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
    border-radius: var(--radius-sm);
    background: var(--color-bg-card);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-base);
    flex-shrink: 0;
  }

  .checkbox-custom svg {
    opacity: 0;
    transform: scale(0.5);
    transition: var(--transition-base);
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

  /* ===== ITEM ICON ===== */
  .item-icon {
    width: clamp(2.5rem, 6vw, 2.75rem);
    height: clamp(2.5rem, 6vw, 2.75rem);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* ===== ITEM CONTENT ===== */
  .item-content {
    flex: 1;
    min-width: 0;
    text-align: left;
  }

  .food-name {
    margin: 0 0 0.25rem 0;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(0.9375rem, 2.5vw, 1rem);
    font-weight: 700;
    color: var(--color-secondary);
    letter-spacing: 0;
    line-height: 1.4;
    word-wrap: break-word;
  }

  .timestamp {
    margin: 0;
    font-size: clamp(0.75rem, 2vw, 0.8125rem);
    color: var(--color-secondary-lighter);
    font-weight: 400;
  }

  /* ===== REMOVE BUTTON ===== */
  .remove-btn {
    border: none;
    background: transparent;
    color: #D86941;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0;
    box-shadow: none;
    min-height: auto;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    transition: var(--transition-base);
  }

  .remove-btn:hover {
    color: #B8472A;
    transform: scale(1.1);
  }

  .remove-btn:active {
    transform: scale(0.95);
  }

  /* ===== RECIPE SECTION ===== */
  .recipe-section {
    margin-top: var(--spacing-xl);
    max-width: 100%;
    width: 100%;
  }

  /* ===== MEAL TYPE SELECTOR ===== */
  .meal-type-selector {
    margin-bottom: var(--spacing-lg);
    text-align: left;
  }

  .meal-type-label {
    display: block;
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(0.9375rem, 2.5vw, 1rem);
    font-weight: 700;
    color: var(--color-secondary);
    margin-bottom: var(--spacing-md);
    text-align: left;
  }

  .meal-type-options {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }

  .meal-type-btn {
    flex: 1;
    min-width: clamp(100px, 25vw, 120px);
    padding: var(--spacing-md);
    border: 2px solid var(--color-border-medium);
    border-radius: var(--radius-full);
    background: var(--color-bg-card);
    color: var(--color-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    min-height: 3rem;
    box-shadow: none;
    transition: var(--transition-base);
  }

  .meal-type-btn:hover {
    background: var(--color-bg-primary);
    border-color: var(--color-border-dark);
  }

  .meal-type-btn.active {
    background: #FFF5E6;
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .meal-label {
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(0.875rem, 2.5vw, 1rem);
    font-weight: 700;
  }

  /* ===== RECIPE GENERATOR BUTTON ===== */
  .recipe-generator-btn {
    width: 100%;
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-full);
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1rem, 2.5vw, 1.125rem);
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.01em;
    min-height: 3.5rem;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    margin-top: var(--spacing-lg);
    box-shadow: var(--shadow-button);
    transition: var(--transition-base);
  }

  .recipe-generator-btn:hover:not(:disabled) {
    background: var(--color-primary-light);
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(255, 155, 113, 0.35);
  }

  .recipe-generator-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-base);
  }

  .recipe-generator-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ===== FIXED RECIPE GENERATOR BUTTON ===== */
  .recipe-generator-btn-fixed {
    position: fixed;
    bottom: clamp(5.5rem, 15vw + 1rem, 7rem);
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-full);
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1rem, 2.5vw, 1.125rem);
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.01em;
    min-height: 3.5rem;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    box-shadow: var(--shadow-button);
    transition: var(--transition-base);
    z-index: 100;
  }

  .recipe-generator-btn-fixed:hover:not(:disabled) {
    background: var(--color-primary-light);
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 6px 24px rgba(255, 155, 113, 0.35);
  }

  .recipe-generator-btn-fixed:active:not(:disabled) {
    transform: translateX(-50%) translateY(0);
    box-shadow: var(--shadow-base);
  }

  .recipe-generator-btn-fixed:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ===== RECIPE BOX ===== */
  .recipe-box {
    margin-top: var(--spacing-lg);
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    border: 2px solid var(--color-border-light);
  }

  .recipe-header {
    padding: var(--spacing-lg);
    background: var(--color-bg-card);
    border-bottom: 2px solid var(--color-border-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
  }

  .recipe-header h2 {
    margin: 0;
    color: var(--color-secondary);
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(1.125rem, 4vw, 1.375rem);
    font-weight: 700;
    letter-spacing: -0.01em;
    flex: 1;
  }

  .download-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-full);
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(0.8125rem, 2.5vw, 0.9375rem);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-base);
    box-shadow: var(--shadow-sm);
    min-height: auto;
    white-space: nowrap;
  }

  .download-btn:hover {
    background: var(--color-primary-light);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .download-btn:active {
    transform: translateY(0);
  }

  .download-btn svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .recipe-meta {
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--color-bg-primary);
    display: flex;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
    border-bottom: 1px solid var(--color-border-light);
  }

  .meta-item {
    display: flex;
    gap: var(--spacing-xs);
    align-items: center;
  }

  .meta-label {
    font-size: clamp(0.8125rem, 2vw, 0.875rem);
    color: var(--color-secondary-light);
    font-weight: 500;
  }

  .meta-value {
    font-size: clamp(0.8125rem, 2vw, 0.875rem);
    color: var(--color-secondary);
    font-weight: 700;
  }

  .recipe-content {
    padding: var(--spacing-xl) var(--spacing-lg);
    background: white;
  }

  .formatted-recipe :global(p) {
    font-size: clamp(0.9375rem, 2.5vw, 1rem);
    color: var(--color-secondary);
    margin: 0 0 var(--spacing-md) 0;
    line-height: 1.8;
    font-weight: 400;
  }

  .formatted-recipe :global(p:last-child) {
    margin-bottom: 0;
  }

  .formatted-recipe :global(ul) {
    margin: var(--spacing-md) 0;
    padding-left: var(--spacing-xl);
    list-style-type: disc;
  }

  .formatted-recipe :global(ol) {
    margin: var(--spacing-md) 0;
    padding-left: var(--spacing-xl);
    counter-reset: recipe-step;
  }

  .formatted-recipe :global(li) {
    margin-bottom: var(--spacing-md);
    font-size: clamp(0.9375rem, 2.5vw, 1rem);
    color: var(--color-secondary);
    line-height: 1.7;
    font-weight: 400;
    padding-left: var(--spacing-xs);
  }

  .formatted-recipe :global(li:last-child) {
    margin-bottom: 0;
  }

  .formatted-recipe :global(strong),
  .formatted-recipe :global(b) {
    font-weight: 700;
    color: var(--color-secondary);
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 480px) {
    .content {
      padding: var(--spacing-md);
    }
  }

  @media (min-width: 768px) {
    .favorites-view {
      max-width: 900px;
      margin: 0 auto;
      padding: var(--spacing-xl) var(--spacing-lg) var(--layout-padding-bottom);
    }

    header {
      padding: var(--spacing-xl) var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .content {
      padding: 0 var(--spacing-lg) var(--spacing-xl);
    }

    .recipe-section {
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
  }

  @media (min-width: 1024px) {
    .favorites-view {
      max-width: 1000px;
    }
  }
</style>
