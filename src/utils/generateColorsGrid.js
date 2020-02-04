import asyncImgLoad from './asyncImgLoad';

const generateColorsGrid = async (productsAmt) => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');

  const img = await asyncImgLoad('dist/radial-9.png');

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const pixelSpacing = Math.floor(canvas.width / Math.sqrt(productsAmt));

  const colorsArray = [];
  let colorsArrayRow = [];
  let pixelCounter = 0;

  for (let i = 0; i < imageData.data.length; i += 1) {
    const x = (i / 4) % canvas.width;
    const y = Math.floor(i / 4 / canvas.width);

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
