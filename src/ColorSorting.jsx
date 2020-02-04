import React, { useState } from 'react';
import * as Vibrant from 'node-vibrant';
import originalSwatchesCK from './assets/swatches-ck';
import originalSwatchesTH from './assets/swatches-th';
import reshape from './utils/reshape';
import useInterval from './utils/useInterval';
import GeneticAlgorithm from './utils/GeneticAlgorithm';
import generateColorsGrid from './utils/generateColorsGrid';

const swatches = originalSwatchesTH.map((swatch, i) => ({ rgb: swatch, i }));
const gridWidth = Math.ceil(100 / Math.floor(100 / Math.sqrt(swatches.length)));
console.log(gridWidth);

const getFitnessForSwatch = (swatch, i, j) => (
  Vibrant.Util.rgbDiff(swatch.rgb, colorsArray[i][j])
);

// use oldPhenotype and some random function to make a change to your phenotype
const mutationFunction = (oldPhenotype) => {
  const shapedPhenoType = reshape(oldPhenotype.swatches, gridWidth);

  const shapedPhenotypeDistances = shapedPhenoType.map((row, i) => (
    row.map((swatch, j) => ({
      score: getFitnessForSwatch(swatch, i, j),
      i: swatch.i,
    }))
  )).flat().sort((cur, prev) => cur.score - prev.score);

  const worstElements = shapedPhenotypeDistances.slice(
    oldPhenotype.swatches.length - 50,
    oldPhenotype.swatches.length,
  );

  const newPhenotype = { swatches: [...oldPhenotype.swatches] };

  for (let i = 0; i < worstElements.length; i += 1) {
    newPhenotype.swatches.splice(
      newPhenotype.swatches.findIndex(swatch => swatch.i === worstElements[i].i),
      1,
    );

    newPhenotype.swatches.splice(
      Math.floor(Math.random() * oldPhenotype.swatches.length - 1),
      0,
      oldPhenotype.swatches.find(swatch => swatch.i === worstElements[i].i),
    );
  }

  return newPhenotype;
};

// use phenotype and possibly some other information to determine the fitness number.
// lower is better, higher is worse.
const fitnessFunction = (phenotype) => {
  const shapedPhenoType = reshape(phenotype.swatches, gridWidth);

  const shapedPhenotypeDistances = shapedPhenoType.map((row, i) => (
    row.map((swatch, j) => getFitnessForSwatch(swatch, i, j))
  ));

  const fitnessVal = (shapedPhenotypeDistances.flat().reduce(
    (prevVal, curVal) => prevVal + curVal, 0,
  ) / swatches.length);

  return fitnessVal;
};

let colorsArray;
let evolution;
(async () => {
  colorsArray = await generateColorsGrid(
    swatches.length,
  );

  console.log(colorsArray);

  evolution = new GeneticAlgorithm({
    mutationFunction,
    fitnessFunction,
    firstIndividual: { swatches: [...swatches] },
    populationSize: 50,
    logFittest: true,
  });
})();

const ColorSorting = () => {
  const [swatchLayout, setSwatchLayout] = useState();

  useInterval(() => {
    evolution.evolve();
    setSwatchLayout(reshape(evolution.best().swatches, gridWidth));
  }, 1);

  return (
    <>
      {swatchLayout ? (
        swatchLayout.map((swatchRow, i) => (
          swatchRow.map((swatch, j) => (
            <div
              key={`${swatch.rgb}-${swatch.i}`}
              style={{
                position: 'absolute',
                transform: `translate(${j * 40 + 10}px, ${i * 40 + 10}px)`,
                top: '0',
                left: '0',
                width: '35px',
                height: '35px',
                backgroundColor: `rgb(${swatch.rgb[0]}, ${swatch.rgb[1]}, ${swatch.rgb[2]})`,
                // transition: 'all 10ms ease-in-out',
              }}
            />
          ))
        ))
      ) : (<div />)}
      {/* {reshape(swatches, gridWidth).map((swatchRow, i) => (
        swatchRow.map((swatch, j) => (
          <div
            key={`${swatch.rgb}-${swatch.i}`}
            style={{
              position: 'absolute',
              transform: `translate(${j * 40 + 10}px, ${i * 40 + 10}px)`,
              top: '0px',
              left: '0px',
              width: '10px',
              height: '10px',
              backgroundColor: `rgba(${swatch.rgb[0]}, ${swatch.rgb[1]}, ${swatch.rgb[2]})`,
            }}
          />
        ))
      ))} */}
      {colorsArray && (
        colorsArray.map((swatchRow, i) => (
          swatchRow.map((swatch, j) => (
            <div
              key={`${swatch}`}
              style={{
                position: 'absolute',
                transform: `translate(${j * 40 + 35}px, ${i * 40 + 10}px)`,
                top: '0px',
                left: '0px',
                width: '10px',
                height: '10px',
                backgroundColor: `rgba(${swatch[0]}, ${swatch[1]}, ${swatch[2]})`,
              }}
            />
          ))
        ))
      )}
    </>
  );
};

export default ColorSorting;
