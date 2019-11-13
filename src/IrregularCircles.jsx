import React, { useEffect, useState, useRef } from 'react';
import SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise();
const width = 800;
let noise1 = 0;
const noise2 = 0;
const noise3 = 0;

const IrregularCircles = ({ timer }) => {
  useEffect(() => {
    noise1 = simplex.noise2D(timer / 500, timer / 500);
    noise1 = simplex.noise2D(timer / 500, timer / 1200);
    noise1 = simplex.noise2D(timer / 300, timer / 300);
  });

  // Q x1 y1, x y - q dx1 dy1, dx dy

  return (
    <svg
      height="800"
      width="800"
      transform={`translate3d(${Math.sin(timer / 100) * 100})`}
    >
      {[...Array(1)].map((_, index) => (
        <>
          <path
            id="lineBC"
            d={`
                M ${noise1 * 300 + width / 4} ${noise2 * 300 + width / 4}
                q ${width / 4 * (1 + noise1)} ${noise1 * 200} ${(noise3 + 1) * 300} ${0}
              `}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </>
      ))}
    </svg>
  );
};

export default IrregularCircles;

/* 13 nov 2019 8:34
return (
    <svg
      height="800"
      width="800"
      transform={`translate3d(${Math.sin(timer / 100) * 100})`}
    >
      {[...Array(1)].map((_, index) => (
        <>
          <path
            id="lineBC"
            d={`
                M ${width / 4} ${width / 4}
                q ${width / 4} ${(simplex.noise2D(timer / 300 + index, timer / 100) - 1) * 200} ${width / 2} ${0}
                q ${(simplex.noise2D(timer / 300 + index, timer / 100) + 1) * 200} ${width / 4} ${0} ${width / 2}
                q ${-width / 4} ${(simplex.noise2D(timer / 300 + index, timer / 100) + 1) * 200} ${-width / 2} ${0}
                q ${(simplex.noise2D(timer / 300 + index, timer / 100) - 1) * 200} ${-width / 4} ${0} ${-width / 2}
              `}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </>
      ))}
    </svg>
  );
*/


/* 2019-10-25 at 08.21.52
    <svg
      height="800"
      width="800"
    >
      {[...Array(3)].map((_, index) => (
        <>
          <path
            id="lineBC"
            d={`
                M 0 ${(simplex.noise2D(timer / 500 + index, timer / 500) + 1) * 100 + index * 25}
                q ${width / 2} ${(simplex.noise2D(timer / 300 + index, timer / 100) + 1) * 150 + width} ${width} ${0}
              `}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </>
      ))}
    </svg>
*/


/*
<svg
      height="800"
      width="800"
    >
      {[...Array(5)].map((_, index) => (
        <>
          <path
            id="lineBC"
            d={`
                M 0 ${25 + 0}
                q ${width / 2} ${(simplex.noise2D(timer / 100 + index, timer / 50) + 1) * 250 + width} ${width} ${0}
              `}
              // stroke={`hsl(${index * (100 / elementsAmt)}, 100%, 50%)`}
            stroke="white"
            strokeWidth="2"
              // opacity="0.3"
            fill="none"
          />
        </>
      ))}
    </svg>
*/

/* 2019-10-24 at 18.03.14
[...Array(12)].map((_, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          top: '100px',
          left: '100px',
          transform: `translate3d(
                ${Math.cos((timer / 2) * index / 25) * 100 + 300}px,
                ${Math.sin((timer / 2) * index / 50) * 200 + 300}px
            , 0)`,
          width: '20px',
          height: '20px',
          backgroundColor: 'white',
          borderRadius: '50%',
        }}
      />
    ))
*/
