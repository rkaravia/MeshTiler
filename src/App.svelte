<script>
  import Map from "./components/Map/Map.svelte";
  import Mesh from "./components/Mesh/Mesh.svelte";
</script>

<style>
  .container {
    margin: 0 auto;
    max-width: 800px;
    height: 100%;
  }

  .row {
    height: 50%;
    padding: 4px;
  }
</style>

<div class="container">
  <div class="row">
    <Map />
  </div>
  <div class="row">
    <Mesh />
  </div>
</div>
