<script lang="ts">
  const answers = [
    'It is certain.',
    'Without a doubt.',
    'Most likely.',
    'Yes.',
    'Signs point to yes.',
    'Ask again later.',
    'Better not tell you now.',
    'Reply hazy, try again.',
    "Don't count on it.",
    'My sources say no.',
    'Very doubtful.',
    'Ask again after a restart.',
  ];

  let answer = $state('Ask me anything.');
  let shaking = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  $effect(() => () => clearTimeout(timer));

  function shake() {
    if (shaking) return;
    shaking = true;
    timer = setTimeout(() => {
      answer = answers[Math.floor(Math.random() * answers.length)];
      shaking = false;
    }, 700);
  }
</script>

<div class="table">
  <button class="ball" class:shaking onclick={shake}>
    <span class="window" class:hidden={shaking}>
      <span class="answer">{answer}</span>
    </span>
  </button>
  <p>Think of a question, then click the ball.</p>
</div>

<style>
  .table {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    height: 100%;
    background: radial-gradient(circle at 50% 40%, #2c5e3f, #10291a);
    color: #cfe8d6;
    font:
      13px Georgia,
      serif;
    container-type: size;
  }

  .ball {
    display: grid;
    place-items: center;
    width: min(220px, 65cqmin);
    aspect-ratio: 1;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #666 0, #222 18%, #000 60%);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.6);
    cursor: pointer;
  }

  .shaking {
    animation: shake 0.7s;
  }

  @keyframes shake {
    20%,
    60% {
      transform: translate(-6px, 3px) rotate(-6deg);
    }
    40%,
    80% {
      transform: translate(6px, -3px) rotate(6deg);
    }
  }

  .window {
    position: relative;
    display: grid;
    place-items: center;
    width: 52%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle, #0d1b4a, #000 75%);
  }

  /* The triangle sits behind the text rather than clipping it, so long answers still fit. */
  .window::before {
    content: '';
    position: absolute;
    inset: 12% 8% 20%;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    background: #2440a8;
    transition: opacity 0.3s;
  }

  .answer {
    position: relative;
    width: 70%;
    margin-bottom: 22%;
    color: white;
    font:
      bold 10px/1.2 Georgia,
      serif;
    text-align: center;
    text-transform: uppercase;
    transition: opacity 0.3s;
  }

  .hidden::before,
  .hidden .answer {
    opacity: 0;
  }

  p {
    margin: 0;
  }
</style>
