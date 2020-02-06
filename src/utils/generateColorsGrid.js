const generateColorsGrid = async (productsAmt, gradientCTX, size) => {
  const imageData = gradientCTX.getImageData(0, 0, 100, 100);

  const pixelSpacing = Math.floor(size / Math.sqrt(productsAmt));

  const colorsArray = [];
  let colorsArrayRow = [];
  let pixelCounter = 0;

  for (let i = 0; i < imageData.data.length; i += 1) {
    const x = (i / 4) % size;
    const y = Math.floor(i / 4 / size);

    if (x === 0 && i !== 0) {
      if (colorsArrayRow.length !== 0) {
        colorsArray.push(colorsArrayRow);
      }

      colorsArrayRow = [];
    }

    if (x % pixelSpacing === 0 && y % pixelSpacing === 0) {
      colorsArrayRow.push([
        imageData.data[i],
        imageData.data[i + 1],
        imageData.data[i + 2],
      ]);

      pixelCounter += 1;

      if (pixelCounter >= productsAmt) {
        colorsArray.push(colorsArrayRow);
        break;
      }
    }
  }

  return colorsArray;
};

export default generateColorsGrid;
