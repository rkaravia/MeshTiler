import StaticMap from "@rkaravia/static-map";
import { project, unproject } from "swissgrid";
import { terrainSize } from "../common/config";

// Available resolutions
// Source: https://api3.geo.admin.ch/services/sdiservices.html#wmts
const RESOLUTIONS = [
  4000,
  3750,
  3500,
  3250,
  3000,
  2750,
  2500,
  2250,
  2000,
  1750,
  1500,
  1250,
  1000,
  750,
  650,
  500,
  250,
  100,
  50,
  20,
  10,
  5,
  2.5,
  2,
  1.5,
  1,
  0.5,
  0.25,
  0.1,
];

function lonLatToPixelWmts({ lon, lat, zoom }) {
  const left = 2420000;
  const top = 1350000;
  const [E, N] = project([lon, lat]);
  return [E - left, top - N].map((coord) => {
    return Math.round(coord / RESOLUTIONS[zoom]);
  });
}

function lonLatToPixelSwissAlti3D({ lon, lat, zoom }) {
  return project([lon, lat]).map((coord) => {
    return Math.round(coord / RESOLUTIONS[zoom]);
  });
}

export function loadToCanvas({ lon, lat, zoom, tileSize, size, url }) {
  const staticMap = new StaticMap([url], {
    size: tileSize,
    lonLatToPixel: lonLatToPixelWmts,
  });
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return new Promise((resolve) => {
    staticMap.getMap(canvas, lon, lat, zoom, () => {
      resolve(canvas);
    });
  });
}

export function loadSwissAlti3D({ lon, lat, zoom, tileSize, size, url }) {
  const staticMap = new StaticMap("{x}|{y}", {
    size: tileSize,
    lonLatToPixel: lonLatToPixelSwissAlti3D,
    tileLoader: async (url, callback) => {
      // console.log({ url });
      const [E, N] = url.split("|").map((coord) => coord * 1000);
      // console.log({ E, N });
      const lonLat = unproject([E + 500, N + 500]);
      const bbox = [...lonLat, ...lonLat].join();
      // console.log({ bbox });
      const stacApiUrl = `https://data.geo.admin.ch/api/stac/v0.9/collections/ch.swisstopo.swissalti3d/items?bbox=${bbox}`;
      const items = await fetch(stacApiUrl).then((response) => response.json());

      const asset = Object.values(items.features[0].assets).find(
        (asset) => asset.type.includes("tiff") && asset["eo:gsd"] === 2
      );

      // const id = items.features[0].id; //swissalti3d_2019_2684-1160
      // const tileUrl = `https://data.geo.admin.ch/ch.swisstopo.swissalti3d/${id}/${id}_2_2056_5728.tif`;

      const blob = await fetch(asset.href).then((response) => response.blob());
      const pyramid = await GeoTIFF.fromBlob(blob);
      const image = await pyramid.getImage(0);
      const data = await image.readRasters();
      https: callback(data);
    },
  });

  const gridSize = terrainSize + 1;
  const terrain = new Float32Array(gridSize * gridSize);

  const canvas = {
    width: size,
    height: size,
    getContext() {
      return {
        drawImage(image, xOffset, yOffset, width, height) {
          const data = image[0];
          const xFrom = Math.max(0, xOffset);
          const xTo = Math.min(xOffset + width, terrainSize);
          const yFrom = Math.max(0, yOffset);
          const yTo = Math.min(yOffset + height, terrainSize);
          for (let y = yFrom; y < yTo; y += 1) {
            for (let x = xFrom; x < xTo; x += 1) {
              const xSrc = x - xOffset;
              const ySrc = tileSize - 1 - (y - yOffset);
              const xDst = x;
              const yDst = terrainSize - 1 - y;
              terrain[yDst * gridSize + xDst] = data[ySrc * tileSize + xSrc];
            }
          }
        },
      };
    },
  };
  return new Promise((resolve) => {
    staticMap.getMap(canvas, lon, lat, zoom, () => {
      resolve(terrain);
    });
  });
}
