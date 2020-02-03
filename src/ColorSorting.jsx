import React, { useEffect, useState, useRef } from 'react';
import * as Vibrant from 'node-vibrant';
import GeneticAlgorithmConstructor from 'geneticalgorithm';
import { sampleSize, uniqWith, isEqual } from 'lodash';
import originalSwatches from './assets/swatches';
import reshape from './utils/reshape';
import useInterval from './utils/useInterval';
import GeneticAlgorithm from './utils/GeneticAlgorithm';

const swatches = originalSwatches.map((swatch, i) => ({ rgb: swatch, i }));
console.log('swatches', swatches);

const getFitnessForSwatch = (shapedPhenoType, swatch, i, j, row) => (
  (i - 1 >= 0
    ? Vibrant.Util.rgbDiff(swatch.rgb, shapedPhenoType[i - 1][j].rgb) : 0) // top
    + (j + 1 < row.length
      ? Vibrant.Util.rgbDiff(swatch.rgb, shapedPhenoType[i][j + 1].rgb) : 0) // right
    + (i + 1 < shapedPhenoType.length && shapedPhenoType[i + 1][j] !== undefined
      ? Vibrant.Util.rgbDiff(swatch.rgb, shapedPhenoType[i + 1][j].rgb) : 0) // bottom
    + (j - 1 >= 0
      ? Vibrant.Util.rgbDiff(swatch.rgb, shapedPhenoType[i][j - 1].rgb) : 0) // left
    / 4 // to get average
);

// use oldPhenotype and some random function to make a change to your phenotype
const mutationFunction = (oldPhenotype) => {
  // const randomSamples = sampleSize(oldPhenotype.swatches, 10);

  const shapedPhenoType = reshape(oldPhenotype.swatches, 25);

  const shapedPhenotypeDistances = shapedPhenoType.map((row, i) => (
    row.map((swatch, j) => ({
      score: getFitnessForSwatch(shapedPhenoType, swatch, i, j, row),
      i: swatch.i,
    }))
  )).flat().sort((cur, prev) => cur.score - prev.score);

  console.log('shapedPhenotypeDistances', shapedPhenotypeDistances);

  const worstElements = shapedPhenotypeDistances.slice(oldPhenotype.swatches.length - 20, oldPhenotype.swatches.length);
  console.log(worstElements);


  // const newPhenotype = { swatches: [...oldPhenotype.swatches] };
  // for (let i = 0; i < randomSamples.length; i += 1) {
  //   newPhenotype.swatches.splice(
  //     newPhenotype.swatches.indexOf(randomSamples[i]),
  //     1,
  //   );
  //   newPhenotype.swatches.splice(
  //     Math.floor(Math.random() * oldPhenotype.swatches.length - 1),
  //     0,
  //     randomSamples[i],
  //   );
  // }

  return newPhenotype;
};

// use phenotype and possibly some other information to determine the fitness number.
// lower is better, higher is worse.
const fitnessFunction = (phenotype) => {
  const shapedPhenoType = reshape(phenotype.swatches, 25);

  const shapedPhenotypeDistances = shapedPhenoType.map((row, i) => (
    row.map((swatch, j) => getFitnessForSwatch(shapedPhenoType, swatch, i, j, row))
  ));

  const fitnessVal = (shapedPhenotypeDistances.flat().reduce(
    (prevVal, curVal) => prevVal + curVal, 0,
  ) / swatches.length);

  return fitnessVal;
};

const evolution = new GeneticAlgorithm({
  mutationFunction,
  fitnessFunction,
  firstIndividual: { swatches: [...swatches] },
  populationSize: 50,
});

const ColorSorting = () => {
  const [swatchLayout, setSwatchLayout] = useState();

  useInterval(() => {
    evolution.evolve();
    setSwatchLayout(reshape(evolution.best().swatches, 25));
  }, 50);

  const handleClickButton = () => {
    evolution.evolve();
    setSwatchLayout(reshape(evolution.best().swatches, 25));
  };

  return (
    <>
      {swatchLayout ? (
        swatchLayout.map((swatchRow, i) => (
          swatchRow.map((swatch, j) => (
            <div
              key={`${swatch.rgb}-${swatch.i}`}
              style={{
                position: 'absolute',
                transform: `translate(${j * 40}px, ${i * 40 + 35}px)`,
                top: '0',
                left: '0',
                width: '35px',
                height: '35px',
                backgroundColor: `rgba(${swatch.rgb[0]}, ${swatch.rgb[1]}, ${swatch.rgb[2]})`,
                // transition: 'all 100ms ease-in-out',
              }}
            />
          ))
        ))
      ) : (<div />)}
      {reshape(swatches, 25).map((swatchRow, i) => (
        swatchRow.map((swatch, j) => (
          <div
            key={`${swatch.rgb}-${swatch.i}`}
            style={{
              position: 'absolute',
              top: `${i * 40 + 35}px`,
              left: `${j * 40}px`,
              width: '10px',
              height: '10px',
              backgroundColor: `rgba(${swatch.rgb[0]}, ${swatch.rgb[1]}, ${swatch.rgb[2]})`,
            }}
          />
        ))
      ))}
      <button onClick={handleClickButton} style={{ zIndex: 100 }}>
        Next evolution
      </button>
    </>
  );
};

export default ColorSorting;
