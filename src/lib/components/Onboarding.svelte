<script>
  import { fade, fly, scale } from "svelte/transition";
  export let onComplete;
</script>

<main class="onboarding">
  <!-- Deko-Bubbles -->
  <div class="bubble bubble-1"></div>
  <div class="bubble bubble-2"></div>

  <!-- Inhalt -->
  <div class="content" in:fade={{ duration: 600 }}>
    <section in:fly={{ y: 24 }}>
      <div class="icon" in:scale>
        <!-- Platzhalter für dein echtes Icon -->
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>

      <h1>Willkommen auf<br>deiner Reise</h1>

      <p class="lead">
        Entdecke fünf bunte Inseln: Fleisch & Ei, Gemüse & Getreide, Getränke, Milchprodukte und Obst.<br>
        Jede Insel lädt dich ein, neue Lebensmittel und spannende Aufgaben zu erleben.
      </p>

      <p class="sub">
        Kein Druck. Keine Urteile.<br>
        Nur spielerische Neugier und viele leckere Entdeckungen warten auf dich!
      </p>
    </section>

    <button on:click={onComplete}>
      Reise beginnen
    </button>
  </div>
</main>

<style>
/* Grundlayout */
.onboarding {
  min-height: 100vh;
  background: linear-gradient(#fde3c8, #f4d4b8);
  position: relative;
  padding: 48px 32px;
}

/* Inhaltsblock */
.content {
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 96px);
}

/* Textbereich */
section {
  text-align: center;
  margin-top: 48px;
}

/* Icon */
.icon {
  width: 128px;
  height: 128px;
  background: #dc8e53;
  border-radius: 50%;
  margin: 0 auto 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Typografie */
h1 {
  color: #954c15;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
}

.lead {
  color: #954c15;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.sub {
  color: #954c15;
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.8;
}

/* Button */
button {
  margin-top: auto;

  width: 100%;
  max-width: 320px;
  height: 56px;

  background: #954c15;
  color: #ffffff;

  border: none;
  border-radius: 28px;

  font-family: "Inria Sans", system-ui, sans-serif;
  font-size: 18px;
  font-weight: 700;

  cursor: pointer;
}

</style>
