import React, { useEffect, useRef, useState } from 'react';
import * as Vibrant from 'node-vibrant';
import swatches from './assets/swatches-th';

console.log(swatches);
const colorsForGradientMap = [
  {
    name: 'black',
    counter: 0,
    color: [0, 0, 0],
  },
  {
    name: 'white',
    counter: 0,
    color: [255, 255, 255],
  },
  {
    name: 'violet',
    counter: 0,
    color: [255, 0, 255],
  },
  {
    name: 'red',
    counter: 0,
    color: [255, 0, 0],
  },
  {
    name: 'yellow',
    counter: 0,
    color: [255, 255, 0],
  },
  {
    name: 'green',
    counter: 0,
    color: [0, 255, 0],
  },
  {
    name: 'cyan',
    counter: 0,
    color: [0, 255, 255],
  },
  {
    name: 'blue',
    counter: 0,
    color: [0, 0, 255],
  },
];

swatches.forEach((swatch) => {
  const distances = colorsForGradientMap.map(colorForGradientMap => ({
    distance: Vibrant.Util.rgbDiff(swatch, colorForGradientMap.color),
    name: colorForGradientMap.name,
  }));

  distances.sort((curColor, prevColor) => curColor.distance - prevColor.distance);

  colorsForGradientMap.find(colorForGradientMap => (
    colorForGradientMap.name === distances[0].name)).counter += 1;
});

console.log(colorsForGradientMap);


const CreateGradient = () => {
  const canvasRef = useRef();
  const [percentages] = useState({
    black: colorsForGradientMap[0].counter / (swatches.length / 100) / 100,
    white: colorsForGradientMap[1].counter / (swatches.length / 100) / 100,
    colors: [
      {
        val: 0.1,
        col: 'rgb(255, 0, 255)',
      },
      {
        val: 0.1,
        col: 'rgb(255, 0, 0)',
      },
      {
        val: 0.1,
        col: 'rgb(255, 255, 0)',
      },
      {
        val: 0.1,
        col: 'rgb(0, 255, 0)',
      },
      {
        val: 0.1,
        col: 'rgb(0, 255, 255)',
      },
      {
        val: 0.1,
        col: 'rgb(0, 0, 255)',
      },
    ],
  });

  const colorsPart = Object.values(percentages.colors).reduce((acc, color) => acc + color.val, 0);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');

    // ctx.createLinearGradient(x1, y1, x2, y2)
    const hueGradient = ctx.createLinearGradient(25, 0, 75, 100);

    Object.values(percentages.colors).reduce((acc, color) => {
      console.log(acc);

      hueGradient.addColorStop((color.val + acc) * (1 / colorsPart), color.col);
      return acc + color.val;
    }, 0);

    ctx.fillStyle = hueGradient;
    ctx.fillRect(0, 0, 100, 100);

    const blackWhite = ctx.createLinearGradient(0, 80, 100, 20);
    blackWhite.addColorStop(0.0, 'rgba(0, 0, 0, 1)');
    blackWhite.addColorStop(percentages.black, 'rgba(0, 0, 0, 0.75)');
    blackWhite.addColorStop(percentages.black + ((1 - (percentages.black + percentages.white)) / 2) - 0.01, 'rgba(0, 0, 0, 0)');
    blackWhite.addColorStop(1 - percentages.white - ((1 - (percentages.black + percentages.white)) / 2) + 0.01, 'rgba(255, 255, 255, 0)');
    blackWhite.addColorStop(1 - percentages.white, 'rgba(255, 255, 255, 0.75)');
    blackWhite.addColorStop(1, 'rgba(255, 255, 255, 1)');

    ctx.fillStyle = blackWhite;
    ctx.fillRect(0, 0, 100, 100);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} width="100" height="100" />
    </>
  );
};

export default CreateGradient;
