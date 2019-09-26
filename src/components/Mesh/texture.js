import { loadToCanvas } from "./tiles.js";
import { satelliteUrl, terrainSize, textureSize } from "../common/config.js";

import { CanvasTexture } from "three";

export default async function getTexture(position, zoom) {
  const { lon, lat } = position;
  const canvas = await loadToCanvas({
    lon,
    lat,
    zoom: zoom + Math.log2(textureSize / terrainSize),
    size: textureSize,
    url: satelliteUrl
  });
  return new CanvasTexture(canvas);
}
