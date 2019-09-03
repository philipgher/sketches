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

  const personPresent = useRef(false);
  const spreadAmt = useRef(0);

  const handleKeyDown = (e) => {
    if (e.code === 'KeyS') {
      personPresent.current = !personPresent.current;
    }
  };

  const handleTick = () => {
    timer.current += 0.001;

    // setWidthVal((Math.cos(timer.current) + 1) * 200);
    // setHeightVal((Math.sin(timer.current) + 1) * 200);

    const tempHeightArray = [];
    const tempWidthArray = [];
    // const tempMiddleArray = [];

    for (let i = 0; i < elementsAmt; i += 1) {
      tempHeightArray.push((simplex.noise2D(timer.current + i / 100, timer.current) + 1) * 500);
      tempWidthArray.push((simplex.noise2D(timer.current - i / 10, timer.current)) * 100);
      // tempMiddleArray.push((simplex.noise2D(timer.current - i, timer.current) + 1) * 500 + 100);
    }
    setHeightVal(tempHeightArray);
    setWidthVal(tempWidthArray);
    // setMiddleVal(tempMiddleArray);

    if (personPresent.current && spreadAmt.current < 20) {
      spreadAmt.current += 0.5;
    } else if (!personPresent.current && spreadAmt.current > 0) {
      spreadAmt.current -= 0.5;
    }

    requestAnimationFrame(handleTick);
  };

  useEffect(() => {
    window.addEventListener('keyup', (e) => {
      handleKeyDown(e);
    });

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
              M 0 ${index * 5 + 600}
              q ${heightVal[index]} ${index > elementsAmt / 2 ? index * spreadAmt.current : (index - elementsAmt) * spreadAmt.current} ${1500} ${widthVal[index]}
              // q ${heightVal[index]} ${widthVal[index]} ${1000} ${index > elementsAmt / 2 ? index * spreadAmt.current : (index - elementsAmt) * spreadAmt.current}
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
