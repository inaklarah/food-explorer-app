<script>
  import { characterName, currentTask, lastEatenFood, isChatOpen } from '../stores/characterStore.js';
  import { fade, fly } from 'svelte/transition';
  
  let userMessage = '';
  let messages = [];
  let isLoading = false;
  let chatContainer;

  // System-Prompt für Tiger-Persönlichkeit
  const SYSTEM_PROMPT = `Du bist ein freundlicher, neugieriger Explorer-Tiger namens ${$characterName || 'Tiger'}. 

DEINE PERSÖNLICHKEIT:
- Du bist abenteuerlustig, motivierend und kindgerecht (für 5-9 Jahre)
- Du lobst Kinder für ihre Entdeckungen, ohne zu übertreiben
- Du stellst neugierige Fragen über Essen
- Du bist nie bewertend oder negativ
- Du verwendest einfache, klare Sprache
- Du bleibst beim Thema Essen und Entdeckungen

DEIN STIL:
- Kurze, freundliche Sätze (max. 2-3 Sätze pro Antwort)
- Nutze gelegentlich passende Emojis (🥕🍎🌟)
- Sei ermutigend: "Cool!", "Wow!", "Das klingt lecker!"
- Stelle Fragen: "Magst du das?", "Welche Farbe hat es?"

KONTEXT:
${$currentTask ? `- Aktuelle Aufgabe: ${$currentTask}` : ''}
${$lastEatenFood ? `- Zuletzt entdeckt: ${$lastEatenFood}` : ''}

Antworte NUR als ${$characterName || 'Tiger'} in 1-3 kurzen Sätzen.`;

  /**
   * Schließt das Chat-Fenster
   */
  function closeChat() {
    isChatOpen.set(false);
  }

  /**
   * Sendet Nachricht an KI und erhält Antwort
   */
  async function sendMessage() {
    if (!userMessage.trim() || isLoading) return;

    const message = userMessage.trim();
    userMessage = '';

    // User-Nachricht hinzufügen
    messages = [...messages, { role: 'user', content: message }];
    isLoading = true;

    // Scroll nach unten
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 50);

    try {
      // KI-Anfrage mit System + User Prompt
      const fullPrompt = `${SYSTEM_PROMPT}

Kind: ${message}

${$characterName || 'Tiger'}:`;

      const response = await fetch('http://localhost:3000/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      });

      if (!response.ok) throw new Error('KI nicht erreichbar');

      const data = await response.json();
      const aiResponse = data.text.trim();

      // Tiger-Antwort hinzufügen
      messages = [...messages, { role: 'assistant', content: aiResponse }];

    } catch (error) {
      console.error('Chat Error:', error);
      messages = [...messages, { 
        role: 'assistant', 
        content: 'Ups! Ich bin gerade nicht da. Versuch es gleich nochmal! 🐯' 
      }];
    } finally {
      isLoading = false;
      
      // Scroll nach unten
      setTimeout(() => {
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 50);
    }
  }

  /**
   * Enter-Taste zum Senden
   */
  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
</script>

<!-- 
  CharacterChat Komponente
  Modal-Chat mit dem Tiger
  Nutzt Ollama-API für KI-Antworten
-->

{#if $isChatOpen}
  <!-- Overlay -->
  <div 
    class="chat-overlay" 
    on:click={closeChat}
    on:keydown={(e) => e.key === 'Escape' && closeChat()}
    role="button"
    tabindex="0"
    aria-label="Chat schließen"
    transition:fade={{ duration: 200 }}
  ></div>

  <!-- Chat Modal -->
  <div 
    class="chat-modal" 
    transition:fly={{ y: 100, duration: 300 }}
  >
    <!-- Header mit Tiger-Info -->
    <div class="chat-header">
      <div class="header-content">
        <img src="/explorer/tiger.png" alt={$characterName} class="header-avatar" />
        <div class="header-text">
          <h2>{$characterName || 'Explorer Tiger'}</h2>
          <p>Dein Entdecker-Begleiter</p>
        </div>
      </div>
      <button 
        class="close-button" 
        on:click={closeChat}
        aria-label="Chat schließen"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 6L6 18M6 6l12 12" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages" bind:this={chatContainer}>
      {#if messages.length === 0}
        <div class="welcome-message">
          <p>Hallo! 👋</p>
          <p>Ich bin {$characterName || 'Tiger'}, dein Explorer-Freund!</p>
          <p>Erzähl mir, was du entdeckt hast! 🥕🍎</p>
        </div>
      {/if}

      {#each messages as message}
        <div class="message {message.role}">
          {#if message.role === 'assistant'}
            <img src="/explorer/tiger.png" alt={$characterName} class="message-avatar" />
          {/if}
          <div class="message-bubble">
            <p>{message.content}</p>
          </div>
        </div>
      {/each}

      {#if isLoading}
        <div class="message assistant">
          <img src="/explorer/tiger.png" alt={$characterName} class="message-avatar" />
          <div class="message-bubble loading">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Input Area -->
    <div class="chat-input-area">
      <input
        type="text"
        bind:value={userMessage}
        on:keydown={handleKeydown}
        placeholder="Schreib was du entdeckt hast..."
        disabled={isLoading}
        class="chat-input"
      />
      <button 
        class="send-button"
        on:click={sendMessage}
        disabled={!userMessage.trim() || isLoading}
        aria-label="Nachricht senden"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  </div>
{/if}

<style>
  /* Overlay (dunkler Hintergrund) */
  .chat-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  /* Chat Modal */
  .chat-modal {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 70vh;
    background: #FFF9F0;
    border-radius: 24px 24px 0 0;
    box-shadow: 0 -4px 32px rgba(125, 90, 61, 0.2);
    z-index: 1001;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Header */
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: clamp(1rem, 3vw, 1.5rem);
    border-bottom: 2px solid #FFE8D6;
    background: linear-gradient(135deg, #FFF9F0 0%, #FFE8D6 100%);
    border-radius: 24px 24px 0 0;
    gap: 0.75rem;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: clamp(0.75rem, 2vw, 1rem);
    min-width: 0;
  }

  .header-avatar {
    width: clamp(2.75rem, 8vw, 3.125rem);
    height: clamp(2.75rem, 8vw, 3.125rem);
    min-width: clamp(2.75rem, 8vw, 3.125rem);
    border-radius: 50%;
    border: 3px solid #FF9B71;
    object-fit: cover;
  }

  .header-text h2 {
    margin: 0;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1rem, 3vw, 1.25rem);
    font-weight: 500;
    color: #7D5A3D;
    line-height: 1.2;
  }

  .header-text p {
    margin: 0;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(0.75rem, 2vw, 0.8125rem);
    color: #A08875;
    font-weight: 500;
  }

  .close-button {
    border: none;
    background: transparent;
    color: #7D5A3D;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    padding: clamp(0.5rem, 1.5vw, 0.75rem);
    min-width: 2.5rem;
    min-height: 2.5rem;
    flex-shrink: 0;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .close-button:hover {
    transform: scale(1.2);
    color: #5A4A42;
  }

  /* Messages Container */
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: clamp(1rem, 3vw, 1.5rem);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Welcome Message */
  .welcome-message {
    text-align: center;
    padding: clamp(1.5rem, 4vw, 2rem);
  }

  .welcome-message p {
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(1rem, 2.5vw, 1.0625rem);
    color: #7D5A3D;
    margin: clamp(0.5rem, 1vw, 0.75rem) 0;
    font-weight: 500;
  }

  /* Message */
  .message {
    display: flex;
    gap: clamp(0.5rem, 2vw, 0.75rem);
    align-items: flex-start;
  }

  .message.user {
    flex-direction: row-reverse;
  }

  .message-avatar {
    width: clamp(2rem, 5vw, 2.25rem);
    height: clamp(2rem, 5vw, 2.25rem);
    min-width: clamp(2rem, 5vw, 2.25rem);
    border-radius: 50%;
    border: 2px solid #FF9B71;
    flex-shrink: 0;
    object-fit: cover;
  }

  .message-bubble {
    max-width: 75%;
    padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.25rem);
    border-radius: clamp(1rem, 2vw, 1.125rem);
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(0.9375rem, 2vw, 0.9375rem);
    line-height: 1.5;
  }

  .message.assistant .message-bubble {
    background: white;
    color: #5A4A42;
    border: 2px solid #FFE8D6;
    border-radius: clamp(1rem, 2vw, 1.125rem) clamp(1rem, 2vw, 1.125rem) clamp(1rem, 2vw, 1.125rem) 0.25rem;
  }

  .message.user .message-bubble {
    background: linear-gradient(135deg, #FF9B71 0%, #FFA07A 100%);
    color: white;
    border-radius: clamp(1rem, 2vw, 1.125rem) clamp(1rem, 2vw, 1.125rem) 0.25rem clamp(1rem, 2vw, 1.125rem);
  }

  .message-bubble p {
    margin: 0;
    font-weight: 400;
    word-break: break-word;
  }

  /* Loading Indicator */
  .typing-indicator {
    display: flex;
    gap: clamp(0.25rem, 1vw, 0.5rem);
    padding: clamp(0.25rem, 1vw, 0.5rem) 0;
  }

  .typing-indicator span {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: #A08875;
    animation: typing 1.4s infinite;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.5;
    }
    30% {
      transform: translateY(-0.5rem);
      opacity: 1;
    }
  }

  /* Input Area */
  .chat-input-area {
    display: flex;
    gap: clamp(0.75rem, 2vw, 1rem);
    padding: clamp(1rem, 2vw, 1.5rem);
    border-top: 2px solid #FFE8D6;
    background: #FFF9F0;
    flex-wrap: wrap;
  }

  .chat-input {
    flex: 1;
    min-width: 0;
    padding: clamp(0.875rem, 2vw, 1rem) clamp(1rem, 2vw, 1.125rem);
    border: 3px solid #FFE8D6;
    border-radius: clamp(0.75rem, 2vw, 1rem);
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(0.9375rem, 2vw, 0.9375rem);
    background: white;
    color: #5A4A42;
    transition: all 0.2s ease;
  }

  .chat-input:focus {
    outline: none;
    border-color: #FF9B71;
    box-shadow: 0 0 0 3px rgba(255, 155, 113, 0.1);
  }

  .chat-input::placeholder {
    color: #C4B5A8;
  }

  .send-button {
    padding: clamp(0.875rem, 2vw, 1rem) clamp(1.25rem, 3vw, 1.75rem);
    border-radius: clamp(0.75rem, 2vw, 1rem);
    border: none;
    background: linear-gradient(180deg, #FF9B71 0%, #FF9B71dd 100%);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Fredoka', sans-serif;
    font-size: clamp(0.875rem, 2vw, 1rem);
    font-weight: 400;
    gap: 0.5rem;
    transition: all 0.2s ease;
    box-shadow: 0 6px 0 #FFA07A99;
    flex-shrink: 0;
    letter-spacing: 0.02em;
    min-height: 2.75rem;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .send-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(255, 133, 85, 0.35);
  }

  .send-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 133, 85, 0.2);
  }

  .send-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Mobile: Chat as full screen modal */
  @media (max-width: 767px) {
    .chat-modal {
      max-height: 100vh;
      border-radius: 0;
    }

    .chat-header {
      border-radius: 0;
    }

    .chat-input-area {
      flex-direction: row;
      width: 100%;
    }
  }

  /* Desktop: Chat als Widget rechts */
  @media (min-width: 768px) {
    .chat-modal {
      bottom: clamp(1rem, 3vw, 1.5rem);
      right: clamp(1rem, 3vw, 1.5rem);
      left: auto;
      top: auto;
      transform: none;
      max-width: min(400px, 90vw);
      width: 100%;
      max-height: min(600px, 80vh);
      border-radius: 1.5rem;
    }

    .chat-header {
      border-radius: 1.5rem 1.5rem 0 0;
    }

    .chat-messages {
      padding: 1.5rem;
    }

    .chat-input-area {
      padding: clamp(1rem, 2vw, 1.5rem);
    }
  }
</style>
