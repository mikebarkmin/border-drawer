import {
  calcSimilarity,
  calcArea,
  getBiggestPolygon,
  xyToLngLat,
  lngLatToXy
} from './helper';
import * as Turf from '@turf/turf';

import de from '../borders/de.json';

test('xyToLngLat', () => {
  const dimensions = {
    width: 800,
    height: 800
  };
  const point = [0, 0];
  expect(xyToLngLat(dimensions, point, de)).toMatchSnapshot();
});

test('getBiggestPolygon', () => {
  const points = [[0, 0], [800, 0], [800, 800], [0, 800], [0, 0]];
  const dimensions = {
    width: 800,
    height: 800
  };
  const coordinates = points.map(point => xyToLngLat(dimensions, point, de));

  const userPolygon = Turf.polygon([coordinates], {});
  const biggestPolygon = getBiggestPolygon(userPolygon);
  expect(biggestPolygon).toMatchSnapshot();
});

test('calcArea', () => {
  const points = [[0, 0], [800, 0], [800, 800], [0, 800], [0, 0]];
  const dimensions = {
    width: 800,
    height: 800
  };
  const coordinates = points.map(point => xyToLngLat(dimensions, point, de));

  const userPolygon = Turf.polygon([coordinates], {});
  const biggestPolygon = getBiggestPolygon(userPolygon);
  const area = calcArea(biggestPolygon, de);
  expect(area).toMatchSnapshot();
  const area2 = calcArea(de, biggestPolygon);
  expect(area2).toBe(0);
});

test('calcSimilarity', () => {
  let points = [[0, 0], [800, 0], [800, 800], [0, 800], [0, 0]];
  const dimensions = {
    width: 800,
    height: 800
  };
  let similarity = calcSimilarity(points, de, dimensions);
  expect(similarity).toMatchSnapshot();

  points = de.geometry.coordinates[0].map(coordinate =>
    lngLatToXy(dimensions, coordinate, de)
  );
  similarity = calcSimilarity(points, de, dimensions);
  expect(similarity).toBe(100);
});

test('lngLatToXy', () => {
  const lngLat = [5.988658074577813, 47.30248769793916];
  const dimensions = {
    width: 800,
    height: 800
  };
  const xy = lngLatToXy(dimensions, lngLat, de);
  expect(xy).toMatchSnapshot();
});
