import * as Turf from '@turf/turf';
import { geoMercator } from 'd3-geo';

export const calcSimilarity = (points, realGeoJson, dimensions) => {
  const coordinates = points.map(point =>
    xyToLngLat(dimensions, point, realGeoJson)
  );
  const userPolygon = Turf.polygon([coordinates], {});
  const biggestPolygon = getBiggestPolygon(userPolygon);
  const diffArea = Math.round(
    calcArea(realGeoJson, biggestPolygon) +
      calcArea(biggestPolygon, realGeoJson)
  );
  const realArea = Turf.area(realGeoJson);
  const similarity = Math.round((1 - diffArea / realArea) * 100);
  return similarity > 0 ? similarity : 0;
};

export const getBiggestPolygon = userPolygon => {
  const unkinkedPolygons = Turf.unkinkPolygon(userPolygon);

  if (unkinkedPolygons.features.length === 1) {
    return userPolygon;
  }

  // if there are line intersections we divide the intersections
  // into separate polygons and return the one with the biggest area
  const sortedPolygons = unkinkedPolygons.features
    .map(function(feat) {
      return JSON.parse(JSON.stringify(feat));
    })
    .map(function(feat, i) {
      feat.properties.area = Turf.area(feat);
      return feat;
    })
    .sort(function(a, b) {
      return b.properties.area - a.properties.area;
    });

  return sortedPolygons[0];
};

export const calcArea = (geoJson1, geoJson2) => {
  const diff = Turf.difference(geoJson1, geoJson2);

  if (diff === undefined) {
    return 0;
  }

  return Turf.area(diff);
};

const PADDING = 0.05;
const projection = geoMercator();

export const xyToLngLat = (dimensions, point, geoJson) => {
  const paddingTop = dimensions.width * PADDING;
  return projection
    .fitExtent(
      [[0, paddingTop], [dimensions.width, dimensions.height - paddingTop]],
      geoJson
    )
    .invert(point);
};

export const lngLatToXy = (dimensions, lngLat, geoJson) => {
  const paddingTop = dimensions.width * PADDING;
  const projectLngLat = projection.fitExtent(
    [[0, paddingTop], [dimensions.width, dimensions.height - paddingTop]],
    geoJson
  );
  return projectLngLat(lngLat);
};

export const pickRandomProperty = obj => {
  let result;
  let count = 0;
  for (let prop in obj) if (Math.random() < 1 / ++count) result = prop;
  return result;
};
