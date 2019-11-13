import React, { useEffect, useState, useRef } from 'react';

const FreakyDots = ({ timer }) => {
  // Freaky dots
  const freakyDotsAmt = useRef(3000);
  const freakyDotsSize = useRef(800);
  const freakyDotsPosX = useRef([...Array(freakyDotsAmt.current)].map(() => Math.random() * freakyDotsSize.current));
  const freakyDotsPosY = useRef([...Array(freakyDotsAmt.current)].map(() => Math.random() * freakyDotsSize.current));
  const freakyDotsCopyOffset = useRef([0, 0]);
  const freakyDotsCopyRotation = useRef(0);
  const freakyDotsCopyScale = useRef(1);

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
    freakyDotsCopyRotation.current = Math.sin(timer) * 2;
    freakyDotsCopyScale.current = (Math.sin(timer) + 20) * 0.05;
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
          width: `${freakyDotsSize.current}px`,
          height: `${freakyDotsSize.current}px`,
          transform: `scale(${freakyDotsCopyScale.current}) rotate(${freakyDotsCopyRotation.current}deg)`,
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
                backgroundColor: 'yellow',
              }}
            />
          </>
        ))}
      </div>
    </>
  );
};

export default FreakyDots;
