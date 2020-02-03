const reshape = (array, n) => array.map((el, i) => {
  if (i % n === 0) {
    return array.slice(i, i + n);
  }
}).filter(returnedArray => returnedArray);

export default reshape;
