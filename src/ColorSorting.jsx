import React, { useState } from 'react';
import * as Vibrant from 'node-vibrant';
import originalSwatchesCK from './assets/swatches-ck';
import originalSwatchesTH from './assets/swatches-th';
import reshape from './utils/reshape';
import useInterval from './utils/useInterval';
// import CreateGradient from './utils/CreateGradient';

const swatches = originalSwatchesTH.map((swatch, i) => ({ rgb: swatch, i }));
const gridWidth = Math.ceil(100 / Math.floor(100 / Math.sqrt(swatches.length)));

const ColorSorting = () => {
  const [swatchLayout, setSwatchLayout] = useState();

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
