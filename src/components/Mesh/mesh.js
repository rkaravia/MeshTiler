import getGeometry from "./geometry.js";
import getTexture from "./texture.js";

export default async function getMesh(position, zoom) {
  const [geometry, texture] = await Promise.all([
    getGeometry(position, zoom),
    getTexture(position, zoom),
  ]);
  return { geometry, texture };
}
