import React from 'react';
import DrawingPolygon from './DrawingPolygon';

const Drawing = props => {
  return (
    <svg
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      <DrawingPolygon {...props} />
    </svg>
  );
};

//{lines.map((line, index) => <DrawingLine key={index} line={line} />)}
export default Drawing;
