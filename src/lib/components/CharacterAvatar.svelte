<script>
  import { isChatOpen, passiveComment } from '../stores/characterStore.js';
  
  export let characterName = 'Tiger';
  
  /**
   * Öffnet den Chat mit dem Tiger
   */
  function openChat() {
    isChatOpen.set(true);
  }
</script>

<button 
  class="character-avatar" 
  on:click={openChat}
  aria-label="Chat mit {characterName} öffnen"
>
  <!-- Tiger Icon -->
  <div class="avatar-icon">
    <img src="/explorer/tiger.png" alt={characterName} />
  </div>
  
  <!-- Passive Sprechblase -->
  {#if $passiveComment}
    <div class="speech-bubble">
      {$passiveComment}
    </div>
  {/if}
</button>

<style>
  .character-avatar {
    position: fixed;
    bottom: clamp(5.5rem, 15vw + 1rem, 7rem);
    right: clamp(1rem, 3vw, 1.5rem);
    z-index: 999;
    cursor: pointer;
    animation: gentle-bounce 3s ease-in-out infinite;
    background: none;
    border: none;
    padding: 0;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  @keyframes gentle-bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.5rem);
    }
  }

  .avatar-icon {
    width: clamp(3.5rem, 12vw, 4rem);
    height: clamp(3.5rem, 12vw, 4rem);
    min-width: 3.5rem;
    min-height: 3.5rem;
    background: linear-gradient(135deg, #FF9B71, #FFA07A);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(255, 155, 113, 0.4);
    transition: all 0.3s ease;
    border: 3px solid white;
  }

  .avatar-icon:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 24px rgba(255, 155, 113, 0.6);
  }

  .avatar-icon:active {
    transform: scale(0.95);
  }

  .avatar-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(1.1);
    border-radius: 50%;
  }

  /* Sprechblase */
  .speech-bubble {
    position: absolute;
    bottom: 110%;
    right: 0;
    margin-bottom: clamp(0.75rem, 2vw, 1rem);
    background: white;
    padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1rem);
    border-radius: clamp(0.75rem, 2vw, 1rem);
    box-shadow: 0 4px 16px rgba(125, 90, 61, 0.15);
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(0.875rem, 2.5vw, 0.875rem);
    color: #7D5A3D;
    max-width: clamp(160px, 40vw, 220px);
    white-space: normal;
    animation: fadeInUp 0.3s ease;
    border: 2px solid #FFE8D6;
    word-wrap: break-word;
    line-height: 1.4;
  }

  .speech-bubble::after {
    content: '';
    position: absolute;
    bottom: clamp(-0.5rem, -1vw, -0.625rem);
    right: clamp(1rem, 3vw, 1.5rem);
    width: 0;
    height: 0;
    border-left: clamp(0.5rem, 1.5vw, 0.625rem) solid transparent;
    border-right: clamp(0.5rem, 1.5vw, 0.625rem) solid transparent;
    border-top: clamp(0.5rem, 1.5vw, 0.625rem) solid white;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive */
  @media (max-width: 480px) {
    .character-avatar {
      bottom: clamp(5rem, 12vw, 5.5rem);
      right: clamp(0.75rem, 2vw, 1rem);
    }

    .avatar-icon {
      width: clamp(3rem, 10vw, 3.5rem);
      height: clamp(3rem, 10vw, 3.5rem);
      min-width: 3rem;
      min-height: 3rem;
    }

    .speech-bubble {
      max-width: clamp(140px, 35vw, 180px);
      font-size: 0.8125rem;
    }
  }

  @media (min-width: 768px) {
    .character-avatar {
      bottom: clamp(6rem, 8vw, 7rem);
      right: clamp(1.5rem, 3vw, 2rem);
    }

    .avatar-icon {
      width: clamp(4rem, 8vw, 4.5rem);
      height: clamp(4rem, 8vw, 4.5rem);
    }

    .speech-bubble {
      max-width: 220px;
      font-size: 0.875rem;
    }
  }
</style>
