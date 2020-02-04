const asyncImgLoad = url => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;

  img.onload = () => {
    resolve(img);
  };

  img.onerror = reject;
});

export default asyncImgLoad;
