import * as Vibrant from 'node-vibrant';

const colorsForGradientMap = [
  {
    color: [0, 0, 0],
    counter: 0,
    name: 'black',
  },
  {
    color: [255, 255, 255],
    counter: 0,
    name: 'white',
  },
  {
    color: [255, 0, 255],
    counter: 0,
    name: 'violet',
  },
  {
    color: [255, 0, 0],
    counter: 0,
    name: 'red',
  },
  {
    color: [255, 255, 0],
    counter: 0,
    name: 'yellow',
  },
  {
    color: [0, 255, 0],
    counter: 0,
    name: 'green',
  },
  {
    color: [0, 255, 255],
    counter: 0,
    name: 'cyan',
  },
  {
    color: [0, 0, 255],
    counter: 0,
    name: 'blue',
  },
];

const createLookupGradient = (swatches, size) => {
  swatches.forEach((swatch) => {
    const distances = colorsForGradientMap.map(colorForGradientMap => ({
      distance: Vibrant.Util.rgbDiff(swatch, colorForGradientMap.color),
      name: colorForGradientMap.name,
    }));

    distances.sort(
      (curColor, prevColor) => curColor.distance - prevColor.distance,
    );

    colorsForGradientMap.find(
      colorForGradientMap => colorForGradientMap.name === distances[0].name,
    ).counter += 1;
  });

  const percentages = {
    black:
			colorsForGradientMap[0].counter / (swatches.length / size) / size,
    colors: [
      {
        col: `rgb(
					${colorsForGradientMap[2].color[0]},
					${colorsForGradientMap[2].color[1]},
					${colorsForGradientMap[2].color[2]}
				)`,
        val:
					colorsForGradientMap[2].counter
					/ (swatches.length / size)
					/ size,
      },
      {
        col: `rgb(
					${colorsForGradientMap[3].color[0]},
					${colorsForGradientMap[3].color[1]},
					${colorsForGradientMap[3].color[2]}
				)`,
        val:
					colorsForGradientMap[3].counter
					/ (swatches.length / size)
					/ size,
      },
      {
        col: `rgb(
					${colorsForGradientMap[4].color[0]},
					${colorsForGradientMap[4].color[1]},
					${colorsForGradientMap[4].color[2]}
				)`,
        val:
					colorsForGradientMap[4].counter
					/ (swatches.length / size)
					/ size,
      },
      {
        col: `rgb(
					${colorsForGradientMap[5].color[0]},
					${colorsForGradientMap[5].color[1]},
					${colorsForGradientMap[5].color[2]}
				)`,
        val:
					colorsForGradientMap[5].counter
					/ (swatches.length / size)
					/ size,
      },
      {
        col: `rgb(
					${colorsForGradientMap[6].color[0]},
					${colorsForGradientMap[6].color[1]},
					${colorsForGradientMap[6].color[2]}
				)`,
        val:
					colorsForGradientMap[6].counter
					/ (swatches.length / size)
					/ size,
      },
      {
        col: `rgb(
					${colorsForGradientMap[7].color[0]},
					${colorsForGradientMap[7].color[1]},
					${colorsForGradientMap[7].color[2]}
				)`,
        val:
					colorsForGradientMap[7].counter
					/ (swatches.length / size)
					/ size,
      },
    ],
    white:
			colorsForGradientMap[1].counter / (swatches.length / size) / size,
  };

  const colorsPart = Object.values(percentages.colors).reduce(
    (acc, color) => acc + color.val,
    0,
  );

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  const hueGradient = ctx.createLinearGradient(25, 0, 75, size);

  Object.values(percentages.colors).reduce((acc, color) => {
    hueGradient.addColorStop(
      (color.val + acc) * (1 / colorsPart),
      color.col,
    );

    return acc + color.val;
  }, 0);

  ctx.fillStyle = hueGradient;
  ctx.fillRect(0, 0, size, size);

  const blackWhite = ctx.createLinearGradient(0, 80, size, 20);
  blackWhite.addColorStop(0.0, 'rgba(0, 0, 0, 1)');
  blackWhite.addColorStop(percentages.black, 'rgba(0, 0, 0, 0.75)');

  blackWhite.addColorStop(
    percentages.black
			+ (1 - (percentages.black + percentages.white)) / 2
			- 0.01,
    'rgba(0, 0, 0, 0)',
  );

  blackWhite.addColorStop(
    1
			- percentages.white
			- (1 - (percentages.black + percentages.white)) / 2
			+ 0.01,
    'rgba(255, 255, 255, 0)',
  );

  blackWhite.addColorStop(1 - percentages.white, 'rgba(255, 255, 255, 0.75)');

  blackWhite.addColorStop(1, 'rgba(255, 255, 255, 1)');

  ctx.fillStyle = blackWhite;
  ctx.fillRect(0, 0, size, size);

  return ctx;
};

export default createLookupGradient;
