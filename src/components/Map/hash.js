import getRandomPlace from "../common/places.js";
import position from "../common/position.js";

let lastPosition;
position.subscribe(newPosition => {
  if (newPosition !== null) {
    const hash = formatHash(newPosition);
    window.location.replace(hash);
  }
  lastPosition = newPosition;
});

if (!update(window.location.hash)) {
  position.set(getRandomPlace());
}

window.addEventListener("hashchange", () => {
  const { hash } = window.location;
  if (formatHash(lastPosition) !== hash) {
    update(hash);
  }
});

function update(hash) {
  const positionFromHash = parseHash(hash);
  if (positionFromHash) {
    position.set(positionFromHash);
    return true;
  }
  position.set(undefined);
  return false;
}

function formatHash(position) {
  if (position) {
    const { lon, lat } = position;
    const precision = 5;
    return `#${+lon.toFixed(precision)}/${+lat.toFixed(precision)}`;
  }
  return "#";
}

function parseHash(hash) {
  if (hash.indexOf("#") === 0) {
    const args = hash.substr(1).split("/");
    if (args.length === 2) {
      const lon = parseFloat(args[0]);
      const lat = parseFloat(args[1]);
      if (!isNaN(lon) && !isNaN(lat)) {
        return {
          lon,
          lat
        };
      }
    }
  }
  return false;
}
