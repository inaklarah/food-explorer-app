<script>
  // Daten
  import { islands } from "./lib/data/islands";

  // Komponenten
  import Onboarding from "./lib/components/Onboarding.svelte";
  import IslandView from "./lib/components/IslandView.svelte";
  import IslandDetail from "./lib/components/IslandDetail.svelte";
  import FavoritesList from "./lib/components/FavoritesList.svelte";

  // State
  let current = 0;
  let view = "onboarding"; 

  // Favorites-System mit localStorage
  let favorites = [];
  let weeklyTaskCount = 0;

  // Beim Start: Favorites aus localStorage laden
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('foodExplorerFavorites');
    const savedCount = localStorage.getItem('weeklyTaskCount');
    
    if (saved) {
      favorites = JSON.parse(saved);
    }
    if (savedCount) {
      weeklyTaskCount = parseInt(savedCount);
    }
  }

  // Favorit speichern
  function addFavorite(food, recipe, islandTitle) {
    const favorite = {
      id: Date.now(),
      food,
      recipe,
      islandTitle,
      timestamp: new Date().toLocaleDateString('de-DE')
    };
    
    favorites = [...favorites, favorite];
    weeklyTaskCount++;
    
    // In localStorage speichern
    if (typeof window !== 'undefined') {
      localStorage.setItem('foodExplorerFavorites', JSON.stringify(favorites));
      localStorage.setItem('weeklyTaskCount', weeklyTaskCount.toString());
    }
  }

  // Favorit löschen
  function removeFavorite(id) {
    favorites = favorites.filter(f => f.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('foodExplorerFavorites', JSON.stringify(favorites));
    }
  }

  // Navigation zwischen Inseln (Startscreen)
  function next() {
    if (current < islands.length - 1) {
      current += 1;
    }
  }

  function prev() {
    if (current > 0) {
      current -= 1;
    }
  }

  // App-Flows
  function finishOnboarding() {
    view = "start";
  }

  function openIsland() {
    view = "detail";
  }

  function backToOverview() {
    view = "start";
  }

  function openFavorites() {
    view = "favorites";
  }

  function closeFavorites() {
    view = "start";
  }
</script>

{#if view === "onboarding"}
  <Onboarding onComplete={finishOnboarding} />

{:else if view === "start"}
  <IslandView
    island={islands[current]}
    onPrev={prev}
    onNext={next}
    onOpen={openIsland}
    favoriteCount={favorites.length}
    onFavoritesClick={openFavorites}
  />

{:else if view === "detail"}
  <IslandDetail
    island={islands[current]}
    onBack={backToOverview}
    favorites={favorites}
    on:addfavorite={e => addFavorite(e.detail.food, '', e.detail.islandTitle)}
  />

{:else if view === "favorites"}
  <FavoritesList
    {favorites}
    {removeFavorite}
    onBack={closeFavorites}
  />
{/if}
