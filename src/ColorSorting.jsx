/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState, useRef, useEffect } from 'react';
import skmeans from 'skmeans';
import colorDiff from 'color-diff';
import reshape from './utils/reshape';
import createLookupGradient from './utils/createLookupGradient';

import originalSwatchesCK from './assets/swatches-ck';
import originalSwatchesTH from './assets/swatches-th';

const activeSwatches = originalSwatchesCK;

// const gridSize = 3;
// const amtClusters = gridSize * gridSize * gridSize; // 2*2*2 = 8, 3*3*3 = 27
// const spacing = 255 / (gridSize + 1);
// const initCentroids = [...Array(gridSize)].map((_, x) => [...Array(gridSize)].map((__, y) => [...Array(gridSize)].map((___, z) => [x * spacing + spacing, y * spacing + spacing, z * spacing + spacing]))).flat().flat();
// console.log(initCentroids);

// const clusters = skmeans(activeSwatches, amtClusters, initCentroids, 100, (x1, x2) => colorDiff.diff(
//   colorDiff.rgb_to_lab({ R: x1[0], G: x1[1], B: x1[2] }),
//   colorDiff.rgb_to_lab({ R: x2[0], G: x2[1], B: x2[2] }),
// ));

const doClustering = (amtCentroids = 14) => {
  // 2 nested pythagoras theorem equations to get distance from 0,0,0 to 255,255,255
  const spacing = Math.floor(Math.sqrt(Math.pow(255, 2) + Math.pow(Math.sqrt(Math.pow(255, 2) + Math.pow(255, 2)), 2)) / amtCentroids);

  const initialise = [...Array(amtCentroids)].map((_, i) => {
    const newPoint = i * spacing;

    return [newPoint, newPoint, newPoint];
  });

  const clusters = skmeans(activeSwatches, amtCentroids, [...initialise], 100, (x1, x2) => colorDiff.diff(
    colorDiff.rgb_to_lab({ R: x1[0], G: x1[1], B: x1[2] }),
    colorDiff.rgb_to_lab({ R: x2[0], G: x2[1], B: x2[2] }),
  ));

  return clusters;
};

const getSimilarClusters = (clusters, threshold) => {
  const groupedCentroids = [];

  for (let i = 0; i < clusters.centroids.length; i += 1) {
    for (let j = 0; j < clusters.centroids.length; j += 1) {
      if (i === j) {
        continue;
      }

      const dist = colorDiff.diff(
        colorDiff.rgb_to_lab({ R: clusters.centroids[i][0], G: clusters.centroids[i][1], B: clusters.centroids[i][2] }),
        colorDiff.rgb_to_lab({ R: clusters.centroids[j][0], G: clusters.centroids[j][1], B: clusters.centroids[j][2] }),
      );

      if (dist < threshold) {
        groupedCentroids.push({ a: i, b: j, dist });
      }
    }
  }

  return groupedCentroids;
};


// const swatches = originalSwatchesTH.map((swatch, i) => ({ rgb: swatch, i }));
// const gridWidth = Math.ceil(100 / Math.floor(100 / Math.sqrt(swatches.length)));
// const swatchLayout = reshape(originalSwatchesTH, 25);

// let setSpring;

const ColorSorting = () => {
  const canvasRef = useRef();

  const [filteredColors, setFilteredColors] = useState([]);
  const [clusters, setClusters] = useState();
  const [similarClusters, setSimilarClusters] = useState();

  useEffect(() => {
    createLookupGradient(originalSwatchesTH, 100, canvasRef.current);

    const tempClusters = doClustering(13);
    console.log(tempClusters);

    setClusters(tempClusters);
  }, []);

  useEffect(() => {
    if (!clusters && !similarClusters) {
      return;
    }

    const tempSimilarClusters = getSimilarClusters(clusters, 10);
    console.log(tempSimilarClusters);

    setSimilarClusters(tempSimilarClusters);
  }, [clusters]);

  const handleClickSwatch = (i) => {
    const matchedColors = activeSwatches.map((swatch, j) => ({
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
          top: '800px',
          left: '10px',
          width: '100px',
          height: '100px',
          marginBottom: '100px',
        }}
        ref={canvasRef}
      />
      <div>
        {reshape(activeSwatches, 50).map((swatchRow, i) => (
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
        {clusters && (
          clusters.centroids.map((cluster, i) => (
            <div
              key={i}
              onClick={() => handleClickSwatch(i)}
              style={{
                position: 'absolute',
                top: '930px',
                left: `${i * 40 + 10}px`,
                width: '35px',
                height: '45px',
                backgroundColor: `rgb(${cluster[0]}, ${cluster[1]}, ${cluster[2]})`,
                marginBottom: '20px',
                color: 'white',
                fontSize: '10px',
                textAlign: 'center',
              }}
            >
              <div style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>{i}</div>
            </div>
          ))
        )}
      </div>
      <div>
        {reshape(filteredColors, 20).map((resultRow, i) => (
          resultRow.map((result, j) => (
            <div
              key={`${i}-${j}`}
              style={{
                border: '0.5px solid white',
                position: 'absolute',
                top: `${(i * 40 + 10) + 980}px`,
                left: `${j * 40 + 10}px`,
                width: '35px',
                height: '35px',
                backgroundColor: `rgb(${activeSwatches[result.index][0]}, ${activeSwatches[result.index][1]}, ${activeSwatches[result.index][2]})`,
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
