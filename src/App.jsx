import React, { useEffect, useState, useRef } from 'react';

import SimplexNoise from 'simplex-noise';
import FreakyDots from './FreakyDots';
import Lines from './Lines';
import Matrix from './Matrix';

const simplex = new SimplexNoise();

// max callstack = 4172

// C x1 y1, x2 y2, x y    c dx1 dy1, dx2 dy2, dx dy
// S x2 y2, x y           s dx2 dy2, dx dy
// Q x1 y1, x y           q dx1 dy1, dx dy
// T x y                  t dx dy

const App = () => {
  const [timer, setTimer] = useState(0);
  const timerOffsetHori = useRef(0);
  const [elementsAmt] = useState(10);

  const currentAnimationIndex = useRef(3);

  const [widthVal, setWidthVal] = useState([250, 250, 250, 250, 250, 250, 250, 250]);
  const [heightVal, setHeightVal] = useState(250);

  const [widthValHori, setWidthValHori] = useState(0);
  const [heightValHori, setHeightValHori] = useState(250);

  const openDiaframga = useRef([false, false, false, false]);
  const spreadAmt = useRef(0);
  const offsetHoriLines = useRef(false);

  const handleKeyDown = (e) => {
    if (e.code === 'Digit1') {
      openDiaframga.current[0] = !openDiaframga.current[0];
    } else if (e.code === 'Digit2') {
      openDiaframga.current[1] = !openDiaframga.current[1];
    } else if (e.code === 'Digit3') {
      openDiaframga.current[2] = !openDiaframga.current[2];
    } else if (e.code === 'Digit4') {
      openDiaframga.current[3] = !openDiaframga.current[3];
    } else if (e.code === 'KeyQ') {
      offsetHoriLines.current = !offsetHoriLines.current;
    }
  };


  const handleTick = () => {
    switch (currentAnimationIndex.current) {
      // Pulse all
      case 0:
        setWidthVal([...Array(8)].map((_, index) => {
          if (index % 2) {
            return ((Math.sin(timer) + 1) * 125);
          }
          return -((Math.sin(timer) + 1) * 125);
        }));
        // setHeightVal((Math.sin(timer) + 1) * 250);

        // setHeightValHori((Math.sin(timer) + 1) * 250);
        // setWidthValHori(simplex.noise2D(timer, timer) * 300);

        if (offsetHoriLines.current) {
          timerOffsetHori.current += 0.01;

          setWidthValHori((Math.sin(timerOffsetHori.current)) * 100);
        }
        break;

      // Sweep left
      case 1:
        setWidthVal([...Array(8)].map((_, index) => {
          console.log();
          return -((Math.sin(timer)) * 250);
        }));
        break;

      // Freaky dots rotate x y
      case 2:
        break;

      default:
        break;
    }

    // if (personPresent.current && spreadAmt.current < 10) {
    //   spreadAmt.current += 0.5;
    // } else if (!personPresent.current && spreadAmt.current > 0) {
    //   spreadAmt.current -= 0.5;
    // }

    // requestAnimationFrame(handleTick);
  };

  useEffect(() => {
    requestAnimationFrame(handleTick);
    setTimer(timer + 0.01);
  }, [timer]);

  useEffect(() => {
    window.addEventListener('keyup', (e) => {
      handleKeyDown(e);
    });
  }, []);

  switch (currentAnimationIndex.current) {
    case 0:
    case 1:
      return <Lines timer={timer} />;

    case 2:
      return <FreakyDots timer={timer} />;

    case 3:
      return <Matrix timer={timer} />;

    default:
      return null;
  }
};

export default App;
