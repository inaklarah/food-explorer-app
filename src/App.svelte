<script>
  // Daten
  import { islands } from "./lib/data/islands";

  // Komponenten
  import Onboarding from "./lib/components/Onboarding.svelte";
  import IslandView from "./lib/components/IslandView.svelte";
  import IslandDetail from "./lib/components/IslandDetail.svelte";
  import FavoritesList from "./lib/components/FavoritesList.svelte";
  import HomeOverview from "./lib/components/HomeOverview.svelte";
  import MenuBar from "./lib/components/MenuBar.svelte";
  import CharacterAvatar from "./lib/components/CharacterAvatar.svelte";
  import CharacterChat from "./lib/components/CharacterChat.svelte";

  // Store
  import { characterName } from "./lib/stores/characterStore.js";

  // State
  let current = 0;
  let view = "onboarding"; 
  let resetToken = 0;

  // Prüfe ob Onboarding bereits durchlaufen
  if (typeof window !== 'undefined') {
    const savedName = localStorage.getItem('characterName');
    if (savedName && savedName !== '""') {
      view = "home"; // Überspringe Onboarding
    }
  }

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
    view = "home";
  }

  function openIsland() {
    view = "detail";
  }

  function backToOverview() {
    view = "islands";
  }

  function openFavorites() {
    view = "favorites";
  }

  function closeFavorites() {
    view = "home";
  }

  // Fortschritt komplett zurücksetzen (alle Insel-Aufgaben)
  function resetProgress() {
    if (typeof window === 'undefined') return;

    const confirmed = window.confirm(
      'Möchtest du den Fortschritt wirklich zurücksetzen?\nAlle Aufgaben werden wieder auf Anfang gesetzt.'
    );

    if (!confirmed) return;

    // Alle Insel-Fortschritte aus localStorage entfernen
    for (const island of islands) {
      localStorage.removeItem(`island_${island.title}_completed`);
    }

    // Erste Insel wieder als Startpunkt setzen
    current = 0;

    // Token erhöhen, damit abhängige Komponenten neu berechnen
    resetToken += 1;
  }
  
  // Navigation über MenuBar
  function handleNavigation(event) {
    const targetView = event.detail.view;
    
    if (targetView === 'home') {
      view = 'home';
    } else if (targetView === 'islands') {
      view = 'islands';
    } else if (targetView === 'favorites') {
      view = 'favorites';
    }
  }
  
  // Chat öffnen
  function handleOpenChat() {
    characterName.update(name => name); // trigger reactivity
    const { isChatOpen } = require('./lib/stores/characterStore.js');
    isChatOpen.set(true);
  }
  
  // Insel auswählen von Home-Übersicht
  function selectIsland(event) {
    current = event.detail.index;
    view = 'islands';
  }
  
  // Aktuellen MenuBar View bestimmen
  $: menuBarView = view === 'onboarding' ? null : 
                   (view === 'detail' ? 'islands' : 
                   (view === 'start' ? 'islands' : view));
</script>

{#if view === "onboarding"}
  <Onboarding onComplete={finishOnboarding} />

{:else if view === "home"}
  <HomeOverview 
    {islands}
    {favorites}
    {resetToken}
    onResetProgress={resetProgress}
    on:selectisland={selectIsland}
  />
  <MenuBar 
    currentView={menuBarView}
    on:navigate={handleNavigation}
    on:openchat={handleOpenChat}
  />
  <CharacterAvatar characterName={$characterName} />
  <CharacterChat />

{:else if view === "islands"}
  <IslandView
    island={islands[current]}
    onPrev={prev}
    onNext={next}
    onOpen={openIsland}
  />
  <MenuBar 
    currentView={menuBarView}
    on:navigate={handleNavigation}
    on:openchat={handleOpenChat}
  />
  <CharacterAvatar characterName={$characterName} />
  <CharacterChat />

{:else if view === "detail"}
  <IslandDetail
    island={islands[current]}
    onBack={backToOverview}
    favorites={favorites}
    on:addfavorite={e => addFavorite(e.detail.food, '', e.detail.islandTitle)}
  />
  <MenuBar 
    currentView={menuBarView}
    on:navigate={handleNavigation}
    on:openchat={handleOpenChat}
  />
  <CharacterAvatar characterName={$characterName} />
  <CharacterChat />

{:else if view === "favorites"}
  <FavoritesList
    {favorites}
    {removeFavorite}
    onBack={closeFavorites}
  />
  <MenuBar 
    currentView={menuBarView}
    on:navigate={handleNavigation}
    on:openchat={handleOpenChat}
  />
  <CharacterAvatar characterName={$characterName} />
  <CharacterChat />
{/if}
