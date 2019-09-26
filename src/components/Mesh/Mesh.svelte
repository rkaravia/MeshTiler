<script>
  import getMesh from "./mesh.js";
  import Renderer from "./renderer.js";
  import { mapTilerAttribution, meshZoom } from "../common/config.js";
  import getRandomPlace from "../common/places.js";
  import position from "../common/position.js";

  import { onMount } from "svelte";

  let container;
  let width = 640;
  let height = 480;

  let hasMesh = false;
  let isMeshLoading = false;

  $: renderer = new Renderer(container);

  $: renderer.updateSize(width, height);

  position.subscribe(newPosition => {
    hasMesh = false;
    if (newPosition) {
      isMeshLoading = true;
      getMesh(newPosition, meshZoom).then(mesh => {
        renderer.updateMesh(mesh);
        isMeshLoading = false;
        hasMesh = true;
      });
    }
  });

  function clear() {
    position.set(undefined);
    return false;
  }

  function randomLocation() {
    position.set(getRandomPlace());
  }
</script>

<style>
  .mesh {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .mesh__canvas {
    height: 100% !important;
  }

  .hidden {
    display: none;
  }

  .clear-button {
    position: absolute;
    top: 8px;
    right: 8px;
    display: block;
    width: 32px;
    height: 32px;
    border: 1px solid #aaa;
    border-radius: 100%;
    background-color: #fff;
    text-align: center;
  }

  .clear-button:hover {
    background-color: #ddd;
    text-decoration: none;
  }

  .attribution {
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.7);
    padding: 0 5px;
    font-size: 11px;
    line-height: 1.5;
  }
</style>

<div class="mesh" bind:clientWidth={width} bind:clientHeight={height}>
  <canvas bind:this={container} class="mesh__canvas" class:hidden={!hasMesh} />
  {#if isMeshLoading}
    Loading...
  {:else if hasMesh}
    <a href="javascript:void(0)" class="clear-button" on:click={clear}>
      <svg viewBox="0 0 32 32">
        <path
          d="M24 10L22 8L16 14L10 8L8 10L14 16L8 22L10 24L16 18L22 24L24 22L18
          16L24 10Z"
          fill="#000" />
      </svg>
    </a>
    <div class="attribution">
      Code: © Roman Karavia,
      <a href="https://github.com/rkaravia/MeshTiler" target="_blank">
        Open Source
      </a>
      | Data:
      {@html mapTilerAttribution}
    </div>
  {:else}
    <span>
      Click on the map to choose a location or
      <a href="javascript:void(0)" on:click={randomLocation}>
        go to a random place
      </a>
    </span>
  {/if}
</div>
