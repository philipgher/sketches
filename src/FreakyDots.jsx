import React, { useEffect, useState, useRef } from 'react';

const FreakyDots = ({ timer }) => {
  // Freaky dots
  const freakyDotsAmt = useRef(2000);
  const freakyDotsPosX = useRef([...Array(freakyDotsAmt.current)].map(() => Math.random() * 1000));
  const freakyDotsPosY = useRef([...Array(freakyDotsAmt.current)].map(() => Math.random() * 1000));
  const freakyDotsCopyOffset = useRef([0, 0]);
  const freakyDotsCopyRotation = useRef(0);

  useEffect(() => {
    window.addEventListener('keyup', (e) => {
      console.log(e);
      if (e.code === 'ArrowLeft') {
        freakyDotsCopyOffset.current[0] -= 1;
      } else if (e.code === 'ArrowRight') {
        freakyDotsCopyOffset.current[0] += 1;
      } else if (e.code === 'ArrowUp') {
        freakyDotsCopyOffset.current[1] -= 1;
      } else if (e.code === 'ArrowDown') {
        freakyDotsCopyOffset.current[1] += 1;
      }
    });
  }, []);

  useEffect(() => {
    freakyDotsCopyRotation.current = Math.sin(timer) * 3;
  });

  return (
    <>
      <div>
        {[...Array(freakyDotsAmt.current)].map((_, index) => (
          <>
            <div
              style={{
                position: 'absolute',
                top: `${freakyDotsPosX.current[index]}px`,
                left: `${freakyDotsPosY.current[index]}px`,
                width: `${5}px`,
                height: `${5}px`,
                backgroundColor: 'white',
                borderRadius: '50%',
              }}
            />
          </>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          top: `${freakyDotsCopyOffset.current[1]}px`,
          left: `${freakyDotsCopyOffset.current[0]}px`,
          width: '1000px',
          height: '1000px',
          transform: `rotate(${freakyDotsCopyRotation.current}deg)`,
          transformOrigin: 'center center',
        }}
      >
        {[...Array(freakyDotsAmt.current)].map((_, index) => (
          <>
            <div
              style={{
                position: 'absolute',
                top: `${freakyDotsPosX.current[index]}px`,
                left: `${freakyDotsPosY.current[index]}px`,
                width: `${5}px`,
                height: `${5}px`,
                backgroundColor: 'white',
                borderRadius: '50%',
              }}
            />
          </>
        ))}
      </div>
    </>
  );
};

export default FreakyDots;
