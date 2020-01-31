import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import * as dat from 'dat.gui';

const gui = new dat.GUI();

let counter = 0;
const gridSize = [20, 20];
const lightsStatus = [...Array(gridSize[0])].map(() => (
  [...Array(gridSize[1])].map(() => {
    counter += 1;
    return counter;
  })
));

/* Types:
1. sweep
    type: 'sweep', // speed, dir, indexMult, xFreq, yFreq, staggerX, staggerY
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
    speedRand: { min: 0.9, max: 1 },
    dir: 1, // 1 or -1

4. fade to brightness
    type: 'fadeto',
    to: 1,
    step: 0.01,

5. direct control - send bitmap/dmx type data
6. axis system functions
*/

const aniTypes = ['sweep', 'revolve', 'random', 'fadeto'];

const FieldOfSuns = ({ timer }) => {
  const [aniState] = useState({
    master: 100,
    type: 'sweep',
    speed: 1,
    dir: 1,
    indexMult: 0,
    xFreq: 0,
    yFreq: 0,
    staggerX: 0,
    staggerY: 0,
    xRevolve: 0,
    yRevolve: 0,
    colsOffset: 0,
    rowsOffset: 0,
    axisType: 'circular',
    wave: 'sine', // sine or square
    threshold: 0.95, // only for square
    speedRand: { min: 0.9, max: 1 },
    to: 1,
    step: 0.01,
    addToTimeline: () => {
      // add anistate to steve's timeline
    },
    broadcast: () => {
      // communicate current settings via serial
    },
  });

  const curSweepControls = useRef([]);

  useEffect(() => {
    gui.remember(aniState);
    gui.add(aniState, 'addToTimeline');
    gui.add(aniState, 'broadcast');

    gui.add(aniState, 'master', 0, 100).step(1);
    gui.add(aniState, 'type', aniTypes);
  }, []);

  useEffect(() => {
    if (curSweepControls.current.length > 0) {
      curSweepControls.current.forEach((control) => {
        gui.remove(control);
      });
      curSweepControls.current = [];
    }

    switch (aniState.type) {
      // Sweep
      case aniTypes[0]:
        curSweepControls.current = [
          gui.add(aniState, 'speed', 0, 20),
          gui.add(aniState, 'dir', { forwards: 1, backwards: -1 }),
          gui.add(aniState, 'indexMult', 0, 10).step(0.01),
          gui.add(aniState, 'xFreq', 0, 10).step(0.01),
          gui.add(aniState, 'yFreq', 0, 10).step(0.01),
          gui.add(aniState, 'staggerX', 0, 10).step(0.01),
          gui.add(aniState, 'staggerY', 0, 10).step(0.01),
        ];
        break;

        // Revolve
      case aniTypes[1]:
        curSweepControls.current = [
          gui.add(aniState, 'speed', 0, 20),
          gui.add(aniState, 'dir', { forwards: 1, backwards: -1 }),
          gui.add(aniState, 'axisType', ['circular', 'straight']),
          gui.add(aniState, 'indexMult', 0, 10).step(0.01),
          gui.add(aniState, 'xFreq', 0, 10).step(0.01),
          gui.add(aniState, 'yFreq', 0, 10).step(0.01),
          gui.add(aniState, 'colsOffset', -20, 20).step(1),
          gui.add(aniState, 'rowsOffset', -20, 20).step(1),
        ];
        break;

        // Random
      case aniTypes[2]:
        curSweepControls.current = [
          gui.add(aniState, 'wave', ['sine', 'square']),
          gui.add(aniState, 'threshold', 0, 1).step(0.01),
          gui.add(aniState.speedRand, 'min', 0, 20).step(0.1),
          gui.add(aniState.speedRand, 'max', 0, 20).step(0.1),
        ];
        break;

      case aniTypes[3]:
        curSweepControls.current = [
          gui.add(aniState, 'to', 0, 1).step(0.01),
          gui.add(aniState, 'step', 0, 0.5).step(0.001),
        ];

      default:
        break;
    }
  }, [aniState.type]);

  //   console.log(aniState);

  return (
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
            master: aniState.master,
            type: aniState.type,
            speed: aniState.speed,
            dir: aniState.dir, // 1 or -1
            indexMult: aniState.indexMult,
            xFreq: aniState.xFreq,
            yFreq: aniState.yFreq,
            staggerX: aniState.staggerX,
            staggerY: aniState.staggerY,
            xRevolve: aniState.xRevolve,
            yRevolve: aniState.yRevolve,
            colsOffset: aniState.colsOffset,
            rowsOffset: aniState.rowsOffset,
            axisType: aniState.axisType,
            wave: aniState.wave, // sine or square
            threshold: aniState.threshold, // only for square
            speedRand: aniState.speedRand,
            to: aniState.to,
            step: aniState.step,
          }}
        />
      ))
    ))
  );
};
export default FieldOfSuns;


const Light = ({ timer, id, ani }) => {
  const brightness = useRef(0);

  // locally stored state to not get new random value all the time
  const randVals = useRef({ speed: 0 });

  const xCenterOffset = useRef(Math.abs(((id.cols + ani.colsOffset) / 2) - id.x));
  const yCenterOffset = useRef(Math.abs(((id.rows + ani.rowsOffset) / 2) - id.y));

  useEffect(() => {
    // console.log(id);

    // To init the random value in case that is the first animation type
    if (ani.type === 'random') {
      randVals.current.speed = Math.random() * ani.speedRand.max + ani.speedRand.min;
    }
  }, []);

  // If the ani.type updates, sometimes specific actions are needed
  useEffect(() => {
    switch (ani.type) {
      case 'random':
        randVals.current.speed = Math.random() * ani.speedRand.max + ani.speedRand.min;
        break;

      default:
        break;
    }
  }, [ani.type]);

  // To see the effect of new random bounds without reinitialising the animation
  useEffect(() => {
    if (ani.type === 'random') {
      randVals.current.speed = Math.random() * ani.speedRand.max + ani.speedRand.min;
    }
  }, [ani.speedRand.min, ani.speedRand.max]);

  useEffect(() => {
    xCenterOffset.current = Math.abs(((id.cols + ani.colsOffset) / 2) - id.x);
  }, [ani.colsOffset]);

  useEffect(() => {
    yCenterOffset.current = Math.abs(((id.rows + ani.rowsOffset) / 2) - id.y);
  }, [ani.rowsOffset]);

  useEffect(() => {
    switch (ani.type) {
      case 'sweep':
        brightness.current = ((Math.sin(((ani.dir * timer + id.x * ani.staggerX + id.y * ani.staggerY) * ani.speed) + (id.index * ani.indexMult) + (id.x * ani.xFreq) + (id.y * ani.yFreq)) + 1) / 2);
        break;

      case 'revolve':
        if (ani.axisType === 'straight') {
          brightness.current = ((Math.sin(((ani.dir * timer) * ani.speed) + (id.index * ani.indexMult) + (xCenterOffset.current * ani.xFreq) + (yCenterOffset.current * ani.yFreq)) + 1) / 2);
        } else if (ani.axisType === 'circular') {
          brightness.current = ((Math.sin(((ani.dir * timer) * ani.speed) + (id.index * ani.indexMult) + ((xCenterOffset.current * yCenterOffset.current) * ani.xFreq) + ((yCenterOffset.current * xCenterOffset.current) * ani.yFreq)) + 1) / 2);
        }
        break;

      case 'random':
        if (ani.wave === 'sine') {
          brightness.current = ((Math.sin((ani.dir * timer * randVals.current.speed)) + 1) / 2);
        } else if (ani.wave === 'square') {
          brightness.current = ((Math.sin((ani.dir * timer * randVals.current.speed)) + 1) / 2) < ani.threshold ? 0 : 1;
        }
        break;

      case 'fadeto':
        if (brightness.current > ani.to && Math.abs(ani.to - brightness.current) > ani.step) {
          brightness.current -= ani.step;
        } else if (brightness.current < ani.to && Math.abs(ani.to - brightness.current) > ani.step) {
          brightness.current += ani.step;
        }
        break;

      default:
        break;
    }

    brightness.current = brightness.current / 100 * ani.master;
  });

  if (id.index === 1) {
    // console.log((brightness.current));
    // console.log(timer);
  }


  return (
    <div
      style={{
        position: 'absolute',
        top: `${50 + (id.y * 50)}px`,
        left: `${50 + (id.x * 50)}px`,
        opacity: brightness.current,
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '10px',
        height: '10px',
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
