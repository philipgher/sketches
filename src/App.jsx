import React, { useEffect, useState, useRef } from 'react';
import SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise();

// max callstack = 4172

const App = () => {
  const timer = useRef(0);
  const [elementsAmt] = useState(50);
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
      tempMiddleArray.push((simplex.noise2D(timer.current - i, timer.current) + 1) * 500 + 100);
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
          <>
            <path
              key={index}
              id="lineBC"
              d={`
              M 0 ${index * 5 + 500}
              q ${heightVal[index] * 1.1} ${widthVal[index] * 1.1} ${middleVal[index] * 1.1} ${index > elementsAmt / 2 ? index * 20 : -index * 30}
              // q ${heightVal[index]} ${widthVal[index]} ${middleVal[index]} 0
              // t ${middleVal[index]} 0
            `}
              // stroke={`hsl(${index * (250 / elementsAmt)}, 100%, 50%)`}
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </>
        ))}
      </svg>
    </>
  );
};

export default App;
