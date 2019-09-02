import React, { useEffect, useState, useRef } from 'react';
import SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise();

// max callstack = 4172

const App = () => {
  const timer = useRef(0);
  const [elementsAmt] = useState(60);
  const [widthVal, setWidthVal] = useState([]);
  const [heightVal, setHeightVal] = useState([]);
  const [middleVal, setMiddleVal] = useState([]);

  const handleTick = () => {
    timer.current += 0.001;

    // setWidthVal((Math.cos(timer.current) + 1) * 200);
    // setHeightVal((Math.sin(timer.current) + 1) * 200);

    const tempHeightArray = [];
    const tempWidthArray = [];
    const tempMiddleArray = [];

    for (let i = 0; i < elementsAmt; i += 1) {
      tempHeightArray.push((simplex.noise2D(timer.current + i / 100, timer.current) + 1) * 500);
      tempWidthArray.push((simplex.noise2D(timer.current - i / 10, timer.current)) * 100);
      // tempMiddleArray.push((simplex.noise2D(timer.current - i, timer.current) + 1) + 1000);
    }
    setHeightVal(tempHeightArray);
    setWidthVal(tempWidthArray);
    setMiddleVal(tempMiddleArray);

    requestAnimationFrame(handleTick);
  };

  useEffect(() => {
    requestAnimationFrame(handleTick);
  }, []);

  // C x1 y1, x2 y2, x y    c dx1 dy1, dx2 dy2, dx dy
  // S x2 y2, x y           s dx2 dy2, dx dy
  // Q x1 y1, x y           q dx1 dy1, dx dy
  // T x y                  t dx dy

  return (
    <>
      <svg
        height="2000"
        width="3000"
      >
        {[...Array(elementsAmt)].map((_, index) => (
          <path
            key={index}
            id="lineBC"
            d={`
              M 0 ${index * 20 + 100}
              q ${heightVal[index]} ${widthVal[index]} ${1000} 0
              // q ${heightVal[index]} ${widthVal[index]} ${middleVal[index]} 0
              // t ${2000 - middleVal[index]} 0
            `}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        ))}
      </svg>
    </>
  );
};

export default App;
