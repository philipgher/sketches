import React, { useRef, useEffect, useState } from 'react';
import Boids from 'boids';

const flock = Boids({
  boids: 100,
  speedLimit: 0.1,
  accelerationLimit: 1,
  separationDistance: 30,
  alignmentDistance: 0.2,
  choesionDistance: 0.5,
  separationForce: 2,
  alignmentForce: 2,
  choesionForce: 0.2,
  attractors: [],
});

const WindSimulation = () => {
  const canvasRef = useRef();
  const [ticker, rerender] = useState(0);

  useEffect(() => {
    console.log('tick', flock);

    const ctx = canvasRef.current.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = 'white';

    ctx.save();

    // ctx.translate(-canvasRef.current.width / 2, -canvasRef.current.height / 2);
    flock.tick();
    flock.boids.forEach((boid) => {
      ctx.fillRect(boid[0] + canvasRef.current.width / 2, boid[1] + canvasRef.current.height / 2, 5, 5);
    });
    ctx.restore();

    rerender(ticker + 0.01);
  });

  return (
    <canvas ref={canvasRef} width="800" height="800" />
  );
};

export default WindSimulation;

/*
<Particles
      width="100vw"
      height="100vh"
      params={{
        interactivity: {
          events: {
            onhover: {
              enable: true,
              mode: 'repulse',
            },
          },
          modes: {
            repulse: {
              distance: 50,
              duration: 100,
            },
          },
        },
        particles: {
          number: {
            value: 100,
            max: 100,
            density: {
              enable: true,
              value_area: 1,
            },
          },
          color: {
            value: '#FFFFFF',
          },
          size: {
            value: 5,
            random: false,
            anim: {
              enable: false,
              speed: 0.01,
              size_min: 0.5,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: 5,
            direction: 'top',
            out_mode: 'out',
            attract: {
              enable: false,
              rotateX: 0.1,
              rotateY: 1,
            },
          },
          line_linked: {
            enable: false,
          },
        },
      }}
    />
*/


/*
class Flock {
    constructor(size) {

    }
};

class Boid {
  constructor() {
    // take nearest neighbours direction
    // go in same direction

    // take nearest neighbours position
    // slightly repel this position
  }
}
*/
