import React, { useEffect, useMemo, useRef } from 'react';

import SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise();

const linesAmt = 30;

const MiniLines = ({ timer }) => {
  const rotation = useRef(0);
  const noise = useRef(0);

  useEffect(() => {
    // rotation.current = Math.pow(timer, 0.5) * 45;
    // rotation.current = Math.sin(timer / 10) * 20;
    // rotation.current = 20;

    rotation.current = simplex.noise2D(timer / 5, timer / 5) * 10;
  });

  return (
    <>
      <SetLines
        timer={timer}
        rotation={rotation.current}
        noise={noise.current}
        position={{ top: 130, left: 130 }}
      />
    </>
  );
};

export default MiniLines;


const SetLines = ({ timer, rotation, position }) => useMemo(() => (
  <>
    {[...Array(linesAmt)].map((_, i) => (
      <>
        {[...Array(linesAmt)].map((__, j) => (
          <div
            style={{
              backgroundColor: 'white',
              position: 'absolute',
              top: `${i * 20 + position.top}px`,
              left: `${j * 20 + position.left}px`,
              height: '1px',
              width: `${30}px`,
              transform: `rotate(${rotation * ((linesAmt / 2))}deg)`,
              // transform: `rotate(${rotation * ((i + 1) / 10) * ((j + 1) / 10)}deg)`,
              // transform: `rotate(${simplex.noise2D(timer + (i + j) * 40, timer / 10 - (i + j)) * 40}deg)`,
              transformOrigin: 'center center',
            }}
          />
        ))}
      </>
    ))}
  </>
));
