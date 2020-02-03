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


// use oldPhenotype and some random function to make a change to your phenotype
const mutationFunction = (oldPhenotype) => {
  console.log('mutationFunc', oldPhenotype);

  const randomSamples = sampleSize(oldPhenotype.swatches, 5);

  const newPhenotype = { swatches: oldPhenotype.swatches };

  for (let i = 0; i < randomSamples.length; i += 1) {
    newPhenotype.swatches.splice(
      newPhenotype.swatches.indexOf(randomSamples[i]),
      1,
    );

    newPhenotype.swatches.splice(
      Math.floor(Math.random() * oldPhenotype.swatches.length - 1),
      0,
      randomSamples[i],
    );
  }

  console.log('mutationFunc', 'result', newPhenotype);

  return newPhenotype;
};

// use phenoTypeA and B to create phenotype result 1 and 2
const crossoverFunction = (phenoTypeA, phenoTypeB) => {
  console.log('crossoverfunc', phenoTypeA, phenoTypeB);

  const matedPhenotypes = { swatches: uniqWith([...phenoTypeA.swatches, ...phenoTypeB.swatches], isEqual) };
  console.log('crossoverfunc', 'result', matedPhenotypes);

  return matedPhenotypes;
};

// use phenotype and possibly some other information to determine the fitness number.
// Higher is better, lower is worse.
const fitnessFunction = (phenotype) => {
  console.log('fitnessfunc', phenotype);

  if (!phenotype) {
    return 0;
  }

  const shapedPhenoType = reshape(phenotype.swatches, 25);

  const shapedPhenotypeDistances = shapedPhenoType.map((row, i) => (
    row.map((swatch, j) => (
      (i - 1 >= 0
        ? Vibrant.Util.rgbDiff(swatch.rgb, shapedPhenoType[i - 1][j].rgb) : 0) // top
      + (j + 1 < row.length
        ? Vibrant.Util.rgbDiff(swatch.rgb, shapedPhenoType[i][j + 1].rgb) : 0) // right
      + (i + 1 < shapedPhenoType.length && shapedPhenoType[i + 1][j] !== undefined
        ? Vibrant.Util.rgbDiff(swatch.rgb, shapedPhenoType[i + 1][j].rgb) : 0) // bottom
      + (j - 1 >= 0
        ? Vibrant.Util.rgbDiff(swatch.rgb, shapedPhenoType[i][j - 1].rgb) : 0) // left
      / 4 // to get average
    ))
  ));

  const fitnessVal = (shapedPhenotypeDistances.flat().reduce(
    (prevVal, curVal) => prevVal + curVal, 0,
  ) / swatches.length) * -1;

  console.log('fitnessfunc', 'result', fitnessVal);

  return fitnessVal;
};

const geneConfig = {
  mutationFunction,
  crossoverFunction,
  fitnessFunction,
  // doesABeatBFunction: yourCompetitionFunction,
  population: [{ swatches }],
  populationSize: 10, // defaults to 100
};

// const geneticalgorithm = GeneticAlgorithmConstructor(geneConfig);
const geneticalgorithm = new GeneticAlgorithm(geneConfig);

const ColorSorting = () => {
  const [swatchLayout, setSwatchLayout] = useState();

  const evolution = useRef(geneticalgorithm);

  // useInterval(() => {
  //   console.log('evolution', evolution.current);

  //   setSwatchLayout(reshape(evolution.current.best(), 25));
  //   evolution.current = evolution.current.evolve();
  // }, null);

  const handleClickButton = () => {
    console.log('evolution', evolution.current);
    evolution.current = evolution.current.evolve();

    const bestOfPopulation = evolution.current.best();
    console.log('bestofpopulation', bestOfPopulation);

    if (bestOfPopulation) {
      setSwatchLayout(reshape(bestOfPopulation.swatches, 25));
    }
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
                transition: 'all 100ms ease-in-out',
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
