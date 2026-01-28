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
    bottom: 88px;
    right: 24px;
    z-index: 999;
    cursor: pointer;
    animation: gentle-bounce 3s ease-in-out infinite;
    background: none;
    border: none;
    padding: 0;
  }

  @keyframes gentle-bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  .avatar-icon {
    width: 64px;
    height: 64px;
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

  .avatar-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(1.1);
  }

  /* Sprechblase */
  .speech-bubble {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 12px;
    background: white;
    padding: 12px 16px;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(125, 90, 61, 0.15);
    font-family: 'Inria Sans', sans-serif;
    font-size: 14px;
    color: #7D5A3D;
    max-width: 220px;
    white-space: normal;
    animation: fadeInUp 0.3s ease;
    border: 2px solid #FFE8D6;
  }

  .speech-bubble::after {
    content: '';
    position: absolute;
    bottom: -8px;
    right: 16px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid white;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive */
  @media (max-width: 640px) {
    .character-avatar {
      bottom: 80px;
      right: 16px;
    }

    .avatar-icon {
      width: 56px;
      height: 56px;
    }

    .speech-bubble {
      max-width: 180px;
      font-size: 13px;
      padding: 10px 14px;
    }
  }
</style>
