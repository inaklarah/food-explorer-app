<script>
  import { fade, fly, scale } from "svelte/transition";
  import { characterName } from '../stores/characterStore.js';
  
  export let onComplete;
  
  let step = 1; // Step 1: Welcome, Step 2: Name Tiger
  let tigerName = '';

  /**
   * Startet die App nach Namensgebung
   */
  function finishOnboarding() {
    if (step === 1) {
      step = 2; // Zur Namensgebung
    } else if (step === 2) {
      // Speichere Tiger-Name
      if (tigerName.trim()) {
        characterName.set(tigerName.trim());
      } else {
        characterName.set('Tiger'); // Fallback
      }
      onComplete();
    }
  }

  /**
   * Name überspringen
   */
  function skipNaming() {
    characterName.set('Tiger');
    onComplete();
  }
</script>

<main class="onboarding">
  <!-- Deko-Kreise -->
  <div class="bubble bubble-1"></div>
  <div class="bubble bubble-2"></div>
  <div class="bubble bubble-3"></div>

  <!-- Inhalt -->
  <div class="content" in:fade={{ duration: 600 }}>
    {#if step === 1}
      <!-- Welcome Screen -->
      <section in:fly={{ y: 24, duration: 500 }}>
        <div class="icon" in:scale={{ duration: 600, delay: 200 }}>
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>

        <h1>Willkommen in deiner<br>Entdeckungswelt</h1>

        <p class="lead">
          Hier warten fünf spannende Inseln auf dich:<br>
          Fleisch und Eier, Gemüse und Getreide, Getränke,<br>
          Milchprodukte und frisches Obst.
        </p>

        <p class="sub">
          Probiere neue Sachen aus, entdecke leckere Rezepte<br>
          und sammle Sterne für deine Lieblingsspeisen.
        </p>
      </section>

      <button on:click={finishOnboarding}>
        Los geht's
      </button>
    {:else}
      <!-- Tiger Name Input -->
      <section in:fly={{ y: 24, duration: 500 }}>
        <div class="tiger-avatar" in:scale={{ duration: 600, delay: 200 }}>
          <img src="/explorer/tiger.png" alt="Explorer Tiger" />
        </div>

        <h1>Triff deinen<br>Entdecker-Freund!</h1>

        <p class="lead">
          Dieser freundliche Tiger wird dich<br>
          auf deiner Reise begleiten.
        </p>

        <p class="sub name-prompt">
          Wie möchtest du ihn nennen?
        </p>

        <input 
          type="text"
          bind:value={tigerName}
          placeholder="z.B. Leo, Tiger, Sammy..."
          maxlength="20"
          class="name-input"
        />
      </section>

      <div class="button-group">
        <button class="primary" on:click={finishOnboarding}>
          {tigerName.trim() ? 'Fertig' : 'Tiger heißt Tiger'}
        </button>
        
        {#if !tigerName.trim()}
          <button class="secondary" on:click={skipNaming}>
            Überspringen
          </button>
        {/if}
      </div>
    {/if}
  </div>
</main>

<style>
/* Grundlayout */
.onboarding {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF9F0 0%, #FFE8CC 50%, #FFD4A3 100%);
  position: relative;
  padding: clamp(1.5rem, 5vw, 3rem);
  overflow: hidden;
}

/* Deko-Kreise */
.bubble {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  animation: float 20s infinite ease-in-out;
}

.bubble-1 {
  width: clamp(120px, 30vw, 200px);
  height: clamp(120px, 30vw, 200px);
  background: #FF9B71;
  top: 10%;
  left: clamp(-30px, -5vw, -50px);
  animation-delay: 0s;
}

.bubble-2 {
  width: clamp(90px, 20vw, 150px);
  height: clamp(90px, 20vw, 150px);
  background: #FFB347;
  bottom: 15%;
  right: clamp(-20px, -3vw, -40px);
  animation-delay: 7s;
}

.bubble-3 {
  width: clamp(80px, 15vw, 120px);
  height: clamp(80px, 15vw, 120px);
  background: #FFA07A;
  top: 50%;
  right: 10%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.05);
  }
}

/* Inhaltsblock */
.content {
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - clamp(3rem, 10vw, 6rem));
  position: relative;
  z-index: 1;
}

/* Textbereich */
section {
  text-align: center;
  margin-top: clamp(2rem, 6vw, 3.75rem);
  flex: 1;
}

/* Icon */
.icon {
  width: clamp(100px, 25vw, 140px);
  height: clamp(100px, 25vw, 140px);
  background: linear-gradient(135deg, #FF9B71 0%, #FF8555 100%);
  border-radius: 50%;
  margin: 0 auto clamp(2rem, 4vw, 2.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 24px rgba(255, 133, 85, 0.3),
    0 0 0 12px rgba(255, 155, 113, 0.1);
}

/* Typografie */
h1 {
  font-family: 'Inria Sans', sans-serif;
  color: #7D5A3D;
  font-size: clamp(1.75rem, 6vw, 2.25rem);
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
  letter-spacing: 0.01em;
}

.lead {
  color: #7D5A3D;
  font-size: clamp(1rem, 3.5vw, 1.125rem);
  line-height: 1.7;
  margin-bottom: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 500;
}

.sub {
  color: #A08875;
  font-size: clamp(0.875rem, 3vw, 1rem);
  line-height: 1.7;
  font-weight: 500;
}

/* Button */
button {
  margin-top: auto;
  width: 100%;
  max-width: clamp(200px, 80vw, 280px);
  height: clamp(2.75rem, 8vw, 3.5rem);
  background: linear-gradient(135deg, #FF9B71 0%, #FFA07A 100%);
  color: #ffffff;
  border: none;
  border-radius: clamp(0.75rem, 2vw, 1rem);
  font-family: 'Inria Sans', sans-serif;
  font-size: clamp(1rem, 3vw, 1.125rem);
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255, 133, 85, 0.25);
  transition: all 0.2s ease;
  margin-left: auto;
  margin-right: auto;
  letter-spacing: 0.02em;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  min-height: 3rem;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(255, 133, 85, 0.35);
  background: linear-gradient(135deg, #FFA07A 0%, #FF9B71 100%);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(255, 133, 85, 0.2);
}

/* Tiger Avatar */
.tiger-avatar {
  width: clamp(100px, 25vw, 140px);
  height: clamp(100px, 25vw, 140px);
  border-radius: 50%;
  margin: 0 auto clamp(2rem, 4vw, 2.5rem);
  overflow: hidden;
  border: clamp(3px, 1vw, 5px) solid #FF9B71;
  box-shadow: 
    0 8px 24px rgba(255, 133, 85, 0.3),
    0 0 0 12px rgba(255, 155, 113, 0.1);
}

.tiger-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Name Input */
.name-prompt {
  font-weight: 600;
  color: #7D5A3D;
  font-size: clamp(1rem, 3vw, 1.0625rem);
  margin-bottom: clamp(1.25rem, 2vw, 1.5rem);
}

.name-input {
  width: 100%;
  max-width: clamp(200px, 80vw, 320px);
  padding: clamp(1rem, 2vw, 1.25rem) clamp(1rem, 2.5vw, 1.25rem);
  border: 3px solid #FF9B71;
  border-radius: clamp(0.75rem, 2vw, 1rem);
  font-family: 'Inria Sans', sans-serif;
  font-size: clamp(1rem, 3vw, 1.0625rem);
  text-align: center;
  background: white;
  color: #5A4A42;
  margin: 0 auto clamp(1.5rem, 3vw, 2rem);
  display: block;
  transition: all 0.2s ease;
  min-height: 3rem;
  touch-action: manipulation;
}

.name-input:focus {
  outline: none;
  border-color: #FF8555;
  box-shadow: 0 0 0 4px rgba(255, 155, 113, 0.15);
}

.name-input::placeholder {
  color: #C4B5A8;
}

/* Button Group */
.button-group {
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 2vw, 1rem);
  margin-top: auto;
  width: 100%;
  max-width: clamp(200px, 80vw, 280px);
  margin-left: auto;
  margin-right: auto;
}

button.secondary {
  background: transparent;
  color: #A08875;
  border: 2px solid #FFE8D6;
  box-shadow: none;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
}

button.secondary:hover {
  background: #FFE8D6;
  color: #7D5A3D;
  border-color: #FFE8D6;
  transform: none;
  box-shadow: none;
}

button.secondary:active {
  transform: translateY(-1px);
}

@media (min-width: 768px) {
  .onboarding {
    padding: clamp(2rem, 5vw, 3rem);
  }

  h1 {
    font-size: clamp(2rem, 7vw, 2.625rem);
  }
  
  .lead {
    font-size: clamp(1.125rem, 3vw, 1.25rem);
  }

  .content {
    min-height: calc(100vh - clamp(6rem, 10vw, 9rem));
  }

  section {
    margin-top: clamp(3rem, 8vw, 4rem);
  }
}

</style>
