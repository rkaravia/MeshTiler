const places = [
  { lon: 7.65227, lat: 46.64616 },
  { lon: 9.34352, lat: 47.2493 },
  { lon: 9.86867, lat: 46.49621 },
  { lon: 6.86517, lat: 45.83267 },
  { lon: 8.55889, lat: 46.58153 },
  { lon: 8.57913, lat: 47.12772 },
  { lon: 25.39693, lat: 36.40327 },
  { lon: 138.73078, lat: 35.36278 },
];

export default function getRandomPlace() {
  const index = Math.floor(Math.random() * places.length);
  return places[index];
}
