import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';

let counter = 0;
const gridSize = [15, 20];
const lightsStatus = [...Array(gridSize[0])].map(() => (
  [...Array(gridSize[1])].map(() => {
    counter += 1;
    return counter;
  })
));

/* Types:
1. sweep
    type: 'sweep',
    speed: 10,
    dir: 1, // 1 or -1
    indexMult: 0,
    xFreq: 1,
    yFreq: 0,
    staggerX: 0.5,
    staggerY: 0,

2. revolve
    type: 'revolve',
    speed: 1,
    dir: 1, // 1 or -1
    indexMult: 0,
    xFreq: 0.0,
    yFreq: 0.0,
    xRevolve: 1.0,
    yRevolve: 0.0,


3. individually random - delayed blink/sweep
    type: 'random',
    wave: 'sine', // sine or square
    threshold: 0.95, // only for square
    speed: { min: 0.9, max: 1 },
    dir: 1, // 1 or -1

4. fade to brightness
    type: 'fadeto',
    to: 1,
    step: 0.01,

5. direct control - send bitmap/dmx type data
6. axis system functions
*/

const FieldOfSuns = ({ timer }) => (
  lightsStatus.map((_, i) => (
    lightsStatus[i].map((__, j) => (
      <Light
        key={lightsStatus[i][j]}
        timer={timer}
        id={{
          x: i,
          y: j,
          index: lightsStatus[i][j],
          rows: gridSize[1],
          cols: gridSize[0],
        }}
        ani={{
          type: 'sweep',
          speed: 10,
          dir: 1, // 1 or -1
          indexMult: 0,
          xFreq: 1,
          yFreq: 0,
          staggerX: 0,
          staggerY: 0,
        }}
      />
    ))
  ))
);
export default FieldOfSuns;


const Light = ({ timer, id, ani }) => {
  const brightness = useRef(0);
  const randVals = useRef({ speed: 0 });

  useEffect(() => {
    // console.log(id);

    if (ani.type === 'random') {
      randVals.current.speed = Math.random() * ani.speed.max + ani.speed.min;
    }
  }, []);

  useEffect(() => {
    switch (ani.type) {
      case 'random':
        randVals.current.speed = Math.random() * ani.speed.max + ani.speed.min;
        break;

      default:
        break;
    }
  }, [ani.type]);


  useEffect(() => {
    switch (ani.type) {
      case 'sweep':
        brightness.current = ((Math.sin(((ani.dir * timer + id.x * ani.staggerX + id.y * ani.staggerY) * ani.speed) + (id.index * ani.indexMult) + (id.x * ani.xFreq) + (id.y * ani.yFreq)) + 1) / 2);
        break;

      case 'revolve':
        brightness.current = ((Math.sin(((ani.dir + (timer * id.y * ani.yRevolve) + (timer * id.x * ani.xRevolve)) * ani.speed) + (id.index * ani.indexMult) + (id.x * ani.xFreq) + (id.y * ani.yFreq)) + 1) / 2);
        break;

      case 'random':
        if (ani.wave === 'sine') {
          brightness.current = ((Math.sin((ani.dir * timer * randVals.current.speed)) + 1) / 2);
        } else if (ani.wave === 'square') {
          brightness.current = ((Math.sin((ani.dir * timer * randVals.current.speed)) + 1) / 2) < ani.threshold ? 0 : 1;
        }
        break;

      case 'fadeto':
        if (brightness.current.toFixed(2) > ani.to.toFixed(2)) {
          brightness.current -= ani.step;
        } else if (brightness.current.toFixed(2) < ani.to.toFixed(2)) {
          brightness.current += ani.step;
        }
        break;

      default:
        break;
    }
  });

  if (id.index === 1) {
    // console.log((brightness.current));
    // console.log(timer);
  }


  return (
    <div
      style={{
        position: 'absolute',
        top: `${100 + (id.y * 50)}px`,
        left: `${100 + (id.x * 50)}px`,
        opacity: brightness.current,
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '15px',
        height: '15px',
      }}
    />
  );
};

Light.defaultProps = {
  ani: 'sweepUp',
};

/* eslint-disable react/forbid-prop-types */
Light.propTypes = {
  ani: PropTypes.object,
  id: PropTypes.object.isRequired,
};

// Linear interpolation a = lower bound, b = higher bound, t = scalar
const lerp = (a, b, t) => a + t * (b - a);
