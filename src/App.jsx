import React, { useEffect, useState, useRef } from 'react';

// import SimplexNoise from 'simplex-noise';
import FreakyDots from './FreakyDots';
import Lines from './Lines';
import Matrix from './Matrix';
import MiniLines from './MiniLines';
import IrregularCircles from './IrregularCircles';
// import FieldOfSuns from './FieldOfSuns';
import ColorSorting from './ColorSorting';

// const simplex = new SimplexNoise();

// max callstack = 4172

// C x1 y1, x2 y2, x y    c dx1 dy1, dx2 dy2, dx dy
// S x2 y2, x y           s dx2 dy2, dx dy
// Q x1 y1, x y           q dx1 dy1, dx dy
// T x y                  t dx dy

const App = () => {
  const [timer, setTimer] = useState(0);
  const currentAnimationIndex = useRef(6);

  const handleKeyDown = (e) => {
    if (e.code === 'Digit1') {
      currentAnimationIndex.current = 1;
    } else if (e.code === 'Digit2') {
      currentAnimationIndex.current = 2;
    } else if (e.code === 'Digit3') {
      currentAnimationIndex.current = 3;
    } else if (e.code === 'Digit4') {
      currentAnimationIndex.current = 4;
    } else if (e.code === 'Digit5') {
      currentAnimationIndex.current = 5;
    } else if (e.code === 'KeyQ') {
    }
  };

  // useEffect(() => {
  //   setTimer(timer + 0.01);
  // }, [timer]);

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

    case 4:
      return <MiniLines timer={timer} />;

    case 5:
      return <IrregularCircles timer={timer} />;

    case 6:
      return <ColorSorting />;

    default:
      return null;
  }
};

export default App;
