/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState, useRef, useEffect } from 'react';
import skmeans from 'skmeans';
import colorDiff from 'color-diff';
import reshape from './utils/reshape';
import createLookupGradient from './utils/createLookupGradient';

import originalSwatchesCK from './assets/swatches-ck';
import originalSwatchesTH from './assets/swatches-th';

const gridSize = 3;
const amtClusters = gridSize * gridSize * gridSize; // 2*2*2 = 8, 3*3*3 = 27
const spacing = 255 / (gridSize + 1);
const initCentroids = [...Array(gridSize)].map((_, x) => [...Array(gridSize)].map((__, y) => [...Array(gridSize)].map((___, z) => [x * spacing + spacing, y * spacing + spacing, z * spacing + spacing]))).flat().flat();
console.log(initCentroids);

const clusters = skmeans(originalSwatchesTH, amtClusters, initCentroids, 100, (x1, x2) => colorDiff.diff(
  colorDiff.rgb_to_lab({ R: x1[0], G: x1[1], B: x1[2] }),
  colorDiff.rgb_to_lab({ R: x2[0], G: x2[1], B: x2[2] }),
));

console.log(originalSwatchesTH);
console.log(clusters);

// const swatches = originalSwatchesTH.map((swatch, i) => ({ rgb: swatch, i }));
// const gridWidth = Math.ceil(100 / Math.floor(100 / Math.sqrt(swatches.length)));
// const swatchLayout = reshape(originalSwatchesTH, 25);

// let setSpring;

const ColorSorting = () => {
  const canvasRef = useRef();

  const [filteredColors, setFilteredColors] = useState([]);

  useEffect(() => {
    createLookupGradient(originalSwatchesTH, 100, canvasRef.current);
  }, []);

  const handleClickSwatch = (i) => {
    const matchedColors = originalSwatchesTH.map((swatch, j) => ({
      result: clusters.test(swatch, (x1, x2) => colorDiff.diff(
        colorDiff.rgb_to_lab({ R: x1[0], G: x1[1], B: x1[2] }),
        colorDiff.rgb_to_lab({ R: x2[0], G: x2[1], B: x2[2] }),
      )),
      index: j,
    })).filter(result => result.result.idx === i);

    console.log(matchedColors);
    setFilteredColors(matchedColors);
  };

  return (
    <>
      <canvas
        style={{
          position: 'absolute',
          top: '1000px',
          left: '10px',
          width: '100px',
          height: '100px',
          marginBottom: '100px',
        }}
        ref={canvasRef}
      />
      <div>
        {reshape(originalSwatchesTH, 50).map((swatchRow, i) => (
          swatchRow.map((swatch, j) => (
            <div
              key={`${i}-${j}`}
              style={{
                position: 'absolute',
                transform: `translate(${j * 40 + 10}px, ${i * 40 + 10}px)`,
                top: '0',
                left: '0',
                width: '35px',
                height: '35px',
                backgroundColor: `rgb(${swatch[0]}, ${swatch[1]}, ${swatch[2]})`,
              }}
            />
          ))
        ))}
      </div>
      <div>
        {clusters.centroids.map((cluster, i) => (
          <div
            key={i}
            onClick={() => handleClickSwatch(i)}
            style={{
              position: 'absolute',
              top: '870px',
              left: `${i * 40 + 10}px`,
              width: '35px',
              height: '35px',
              backgroundColor: `rgb(${cluster[0]}, ${cluster[1]}, ${cluster[2]})`,
              marginBottom: '20px',
            }}
          />
        ))}
      </div>
      <div>
        {reshape(filteredColors, 20).map((resultRow, i) => (
          resultRow.map((result, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => handleClickSwatch(i)}
              style={{
                border: '0.5px solid white',
                position: 'absolute',
                top: `${(i * 40 + 10) + 920}px`,
                left: `${j * 40 + 10}px`,
                width: '35px',
                height: '35px',
                backgroundColor: `rgb(${originalSwatchesTH[result.index][0]}, ${originalSwatchesTH[result.index][1]}, ${originalSwatchesTH[result.index][2]})`,
                marginBottom: '20px',
              }}
            />
          ))
        ))}
      </div>
    </>
  );
};

export default ColorSorting;
