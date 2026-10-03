<script lang="ts">
  import { type IconName, iconUrl } from '../art';

  interface Props {
    icon: IconName;
    label: string;
    x: number;
    y: number;
    selected: boolean;
    onselect: () => void;
    onopen: () => void;
  }

  let { icon, label, x, y, selected, onselect, onopen }: Props = $props();

  // A mouse selects with a click and opens with a double click; touch and pens open with one tap.
  let pointerType = '';
</script>

<button
  class="icon"
  class:selected
  style:left="{x}px"
  style:top="{y}px"
  onpointerdown={(event) => {
    pointerType = event.pointerType;
    onselect();
  }}
  onclick={() => {
    if (pointerType !== 'mouse') onopen();
  }}
  ondblclick={() => {
    if (pointerType === 'mouse') onopen();
  }}
>
  <span class="image"><img src={iconUrl(icon, 32)} alt="" draggable="false" /></span>
  <span class="label">{label}</span>
</button>

<style>
  /* Values from winXP's desktop icons. */
  .icon {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: 76px;
    padding: 0;
    border: none;
    background: none;
    color: white;
    font: inherit;
    user-select: none;
  }

  .image {
    width: 32px;
    height: 32px;
  }

  img {
    display: block;
    width: 32px;
    height: 32px;
  }

  .label {
    padding: 0 3px 2px;
    text-align: center;
    text-shadow: 1px 1px 1px black;
  }

  /* XP tints a selected icon blue: a blue drop shadow showing through the half-faded image. */
  .selected .image {
    filter: drop-shadow(0 0 blue);
  }

  .selected img {
    opacity: 0.5;
  }

  .selected .label {
    background: #0b61ff;
  }
</style>
