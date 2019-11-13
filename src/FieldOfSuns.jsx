import React, { useEffect, useMemo, useRef } from 'react';

const gridSize = [2, 5];
const lightsStatus = [...Array(gridSize[0])].map(() => (
  [...Array(gridSize[1])].map(() => (0.5))
));

const setLights = (type = 'sweep') => {
  switch (type) {
    case 'sweep':
      // lightsStatus.map((_, index) => )
      break;

    default:
      break;
  }
};

const FieldOfSuns = () => {
  useEffect(() => {
    setLights();
  }, []);

  console.log(lightsStatus);

  return (
    [...Array(lightsStatus.length)].map((_, i) => (
      [...Array(lightsStatus[i].length)].map((__, j) => (
        <Light id={{ x: i, y: j }} />
      ))
    ))
  );
};

export default FieldOfSuns;


const Light = ({ id }) => {
  console.log();

  return (
    <div
      style={{
        position: 'absolute',
        top: `${100 + (id.x * 50)}px`,
        left: `${100 + (id.y * 50)}px`,
        opacity: `${lightsStatus[id.x][id.y]}`,
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '15px',
        height: '15px',
      }}
    />
  );
};
