const key = "MAPTILER_KEY";

export const mapUrl = `https://api.maptiler.com/maps/topo/{z}/{x}/{y}{r}.png?key=${key}`;
export const satelliteUrl = `https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=${key}`;
export const terrainUrl = `https://api.maptiler.com/tiles/terrain-rgb/{z}/{x}/{y}.png?key=${key}`;

export const mapTilerAttribution =
  '© <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>';
export const openStreetMapAttribution =
  '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>';

export const meshZoom = 11;
export const terrainSize = 512;
export const textureSize = 1024;

export const meshMaxError = 1;
