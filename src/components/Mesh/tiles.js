import StaticMap from "@rkaravia/static-map";

export function loadToCanvas(options) {
  const { lon, lat, zoom, tileSize, size, url } = options;
  const staticMap = new StaticMap([url], { size: tileSize });
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return new Promise((resolve) => {
    staticMap.getMap(canvas, lon, lat, zoom, () => {
      resolve(canvas);
    });
  });
}

export async function loadImageData(options) {
  const canvas = await loadToCanvas(options);
  const { size } = options;
  const context = canvas.getContext("2d");
  const { data } = context.getImageData(0, 0, size, size);
  return data;
}
