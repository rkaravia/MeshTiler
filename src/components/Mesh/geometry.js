import Martini from "./Martini.js";
import { loadImageData } from "./tiles.js";
import { terrainUrl, terrainSize, meshMaxError } from "../common/config.js";

import { BufferAttribute, BufferGeometry } from "three";

const gridSize = terrainSize + 1;

const terrainTileSize = 512;

export default async function getGeometry(position, zoom) {
  const data = await imageData(position, zoom);
  const terrain = terrainData(data);
  return geometryData(terrain, position, zoom);
}

function imageData({ lon, lat }, zoom) {
  return loadImageData({
    lon,
    lat,
    zoom: zoom + Math.log2(256 / terrainTileSize),
    tileSize: terrainTileSize,
    size: terrainSize,
    url: terrainUrl
  });
}

// Adapted from https://github.com/mapbox/martini/blob/1ca5ca075a169231feb3357c513de774425ff1de/test/util.js
// ISC License, Copyright (c) 2019, Mapbox
function terrainData(data) {
  const terrain = new Float32Array(gridSize * gridSize);

  // decode terrain values
  for (let y = 0; y < terrainSize; y++) {
    for (let x = 0; x < terrainSize; x++) {
      const k = (y * terrainSize + x) * 4;
      const r = data[k + 0];
      const g = data[k + 1];
      const b = data[k + 2];
      terrain[y * gridSize + x] =
        (r * 256 * 256 + g * 256.0 + b) / 10.0 - 10000.0;
    }
  }

  // backfill right and bottom borders
  for (let x = 0; x < gridSize - 1; x++) {
    terrain[gridSize * (gridSize - 1) + x] =
      terrain[gridSize * (gridSize - 2) + x];
  }
  for (let y = 0; y < gridSize; y++) {
    terrain[gridSize * y + gridSize - 1] = terrain[gridSize * y + gridSize - 2];
  }

  return terrain;
}

// Adapted from https://observablehq.com/@mourner/martin-real-time-rtin-terrain-mesh
function geometryData(terrain, { lat }, zoom) {
  const martini = new Martini(gridSize);
  const tile = martini.createTile(terrain);
  const { vertices, triangles } = tile.getMesh(meshMaxError);
  const noVertices = vertices.length / 2;

  let minTerrain = Infinity;
  for (let i = 0; i < terrain.length; i++) {
    minTerrain = Math.min(terrain[i], minTerrain);
  }

  const earthRadius = 6378137;
  const meters = earthRadius * 2 * Math.PI * Math.cos((lat * Math.PI) / 180);
  const pixels = Math.pow(2, zoom) * 256;
  const metersPerPixel = meters / pixels;

  const positions = new Float32Array(noVertices * 3);
  const uvs = new Float32Array(noVertices * 2);

  for (let i = 0; i < noVertices; i++) {
    const x = vertices[2 * i];
    const y = vertices[2 * i + 1];

    positions[3 * i + 0] = x / terrainSize - 0.5;
    positions[3 * i + 1] = 0.5 - y / terrainSize;
    positions[3 * i + 2] =
      (terrain[y * gridSize + x] - minTerrain) / metersPerPixel / terrainSize;

    uvs[2 * i + 0] = x / terrainSize;
    uvs[2 * i + 1] = 1 - y / terrainSize;
  }

  const geometry = new BufferGeometry();

  geometry.addAttribute("position", new BufferAttribute(positions, 3));
  geometry.addAttribute("uv", new BufferAttribute(uvs, 2));
  geometry.setIndex(new BufferAttribute(triangles, 1));
  geometry.computeVertexNormals();

  return geometry;
}
