// Радиус Земли в метрах (сфероидическая модель)
const earthRadius = 6378137;

/**
 * Преобразует координаты Меркатора в географические координаты (долготу и широту)
 * @param x - координата x в проекции Меркатора (обычно в метрах)
 * @param z - координата z в проекции Меркатора (обычно в метрах)
 * @returns объект с долготой (lon) и широтой (lat) в градусах
 */
export const metricsToMercator = (
  x: number,
  z: number,
): { lon: number; lat: number } => {
  // Долгота (longitude) в радианах
  const longitudeRad = -x / earthRadius;

  // Широта (latitude) в радианах
  // Используем формулу обратного преобразования Меркатора
  // const latitudeRad = 2 * Math.atan(Math.exp(z / earthRadius)) - Math.PI / 2;
  const latitudeRad = 2 * (Math.atan(Math.exp(z / earthRadius)) - Math.PI / 4);

  // Преобразуем радианы в градусы
  const lon = (longitudeRad * 180) / Math.PI;
  const lat = (latitudeRad * 180) / Math.PI;

  return { lon, lat };
};

/**
 * Преобразует географические координаты (долготу и широту) в координаты Меркатора
 * @param longitude - долгота в градусах
 * @param latitude - широта в градусах
 * @returns объект с координатами x и z в проекции Меркатора (в метрах)
 */
export const mercatorToMetrics = (
  longitude: number,
  latitude: number,
): { x: number; z: number } => {
  // Преобразуем градусы в радианы
  const longitudeRad = (longitude * Math.PI) / 180;
  const latitudeRad = (latitude * Math.PI) / 180;

  // Координата x в проекции Меркатора
  const x = earthRadius * longitudeRad;

  // Координата z в проекции Меркатора
  // Используем формулу прямого преобразования Меркатора
  const z = earthRadius * Math.log(Math.tan(Math.PI / 4 + latitudeRad / 2));

  return { x, z };
};
