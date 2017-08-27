import React from 'react';

const DrawingPolygon = ({ points, fill, strokeWidth, stroke }) => {
  let polygonData = points.map(point => `${point.get(0)},${point.get(1)}`);
  polygonData = polygonData.join(' ');
  return (
    <polygon
      style={{
        fill,
        strokeWidth,
        stroke
      }}
      points={polygonData}
    />
  );
};

DrawingPolygon.defaultProps = {
  fill: 'none',
  strokeWidth: '4px',
  stroke: 'crimson'
};

export default DrawingPolygon;
