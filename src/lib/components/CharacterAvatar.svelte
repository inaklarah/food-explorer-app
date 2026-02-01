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
  <img src="/explorer/tiger.png" alt={characterName} class="avatar-img" />
  
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
    min-height: 3.5rem;
    box-shadow: none;
  }

  @keyframes gentle-bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.5rem);
    }
  }

  .avatar-img {
    width: 3.5rem;
    height: 3.5rem;
    object-fit: cover;
    border-radius: 50%;
    transition: all 0.3s ease;
    display: block;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .character-avatar:hover .avatar-img {
    transform: scale(1.1);
  }

  .character-avatar:active .avatar-img {
    transform: scale(0.95);
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Inria Sans', sans-serif;
    font-size: clamp(0.875rem, 2.5vw, 0.875rem);
    color: #7D5A3D;
    max-width: clamp(160px, 40vw, 220px);
    white-space: normal;
    animation: fadeInUp 0.3s ease;
    border: 2px solid #E5E5E5;
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

    .avatar-img {
      width: clamp(3rem, 10vw, 3.5rem);
      height: clamp(3rem, 10vw, 3.5rem);
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

    .avatar-img {
      width: clamp(4rem, 8vw, 4.5rem);
      height: clamp(4rem, 8vw, 4.5rem);
    }

    .speech-bubble {
      max-width: 220px;
      font-size: 0.875rem;
    }
  }
</style>
