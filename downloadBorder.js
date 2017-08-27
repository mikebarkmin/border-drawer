import fetch from 'node-fetch';
import fs from 'fs';
import readline from 'readline';
import sanitize from 'sanitize-filename';
import simplify from 'simplify-geojson';

const r = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const convert = json => {
  r.question('Name of the border: ', name => {
    r.close();
    const coordinates = json.geometries[0].coordinates[0];
    const borderJSON = {
      type: 'Feature',
      properties: {
        name,
        labels: []
      },
      geometry: {
        type: 'Polygon',
        coordinates
      }
    };
    const fileName = sanitize(name).toLowerCase();
    fs.writeFile(
      `src/borders/${fileName}.json`,
      JSON.stringify(borderJSON),
      'utf8',
      err => {
        console.log(err);
      }
    );
    fs.writeFile(
      `src/borders/simple-${fileName}.json`,
      JSON.stringify(simplify(borderJSON)),
      'utf8',
      err => {
        console.log(err);
      }
    );
  });
};

r.question('OSM id: ', osmid => {
  fetch(`http://polygons.openstreetmap.fr/get_geojson.py?id=${osmid}&params=0`)
    .then(res => res.json())
    .then(json => convert(json))
    .catch(() => console.log('wrong OSM id'));
});
