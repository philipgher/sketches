import React, { useEffect, useState, useRef } from 'react';

const Matrix = ({ timer }) => {
  const matrixSettings = useRef({
    size: 15,
    spread: 15,
    elementAmt: 30,
  });

  const rotationMatrixLayer = useRef(0);
  const scaleMatrixLayer = useRef(1);


  useEffect(() => {
    scaleMatrixLayer.current = (Math.sin(timer) + 5) * 0.2;
    // rotationMatrixLayer.current = Math.sin(timer / 4) * 90;
  }, [timer]);

  return (
    <>
      <MatrixLayer
        matrixSettings={matrixSettings.current}
        rotation={0}
        scale={1}
      />
      <MatrixLayer
        matrixSettings={matrixSettings.current}
        rotation={rotationMatrixLayer.current}
        scale={scaleMatrixLayer.current}
      />
    </>
  );
};

export default Matrix;


const MatrixLayer = ({ matrixSettings, rotation, scale }) => (
  <div
    style={{
      position: 'absolute',
      top: '100px',
      left: '100px',
      transform: `scale(${scale}) rotate(${rotation}deg)`,
      transformOrigin: 'center center',
      height: `${matrixSettings.size * matrixSettings.elementAmt}px`,
      width: `${matrixSettings.size * matrixSettings.elementAmt}px`,
    }}
  >
    {[...Array(matrixSettings.elementAmt)].map((_, i) => (
      <>
        {[...Array(matrixSettings.elementAmt)].map((__, j) => (
          <div
            style={{
              position: 'absolute',
              top: `${j % 2 !== 0 ? (i * matrixSettings.spread) : (i * matrixSettings.spread + matrixSettings.size)}px`,
              left: `${i % 2 !== 0 ? (j * matrixSettings.spread) : (j * matrixSettings.spread + matrixSettings.size)}px`,
              backgroundColor: 'white',
              width: `${matrixSettings.size}px`,
              height: `${matrixSettings.size}px`,
              // borderRadius: '50%',
            }}
          />
        ))}
      </>
    ))}
  </div>
);
