import React, { useEffect, useState, useRef } from 'react';

const TrianglePattern = ({ timer }) => {
  useEffect(() => {

  }, []);

  return (
    <>
      <svg
        height="2000"
        width="2000"
      >
        {[...Array(elementsAmt)].map((_, index) => (
          <>
            <path
              id="lineBC"
              d={`
                M 0 ${index * 25 + 210}
                q ${heightValHori} ${widthValHori} ${500} ${0}
                t 500 0
                t 500 0
                t 500 0
              `}
              // stroke={`hsl(${index * (100 / elementsAmt)}, 100%, 50%)`}
              stroke="white"
              strokeWidth="2"
              // opacity="0.3"
              fill="none"
            />
          </>
        ))}
        {[...Array(elementsAmt)].map((_, index) => (
          <>
            <path
              id="lineBC"
              d={`
                M 0 ${index * 25 + 460}
                q ${heightValHori} ${-widthValHori} ${500} ${0}
                t 500 0
                t 500 0
                t 500 0
              `}
              // stroke={`hsl(${index * (100 / elementsAmt)}, 100%, 50%)`}
              stroke="white"
              strokeWidth="2"
              // opacity="0.3"
              fill="none"
            />
          </>
        ))}
        {[...Array(5)].map((_, index) => (
          <>
            {[...Array(4)].map((__, innIndex) => (
              <>
                <path
                  id="lineBC"
                  d={`
                      M ${innIndex * 500 + 250} 200
                      q ${openDiaframga.current[innIndex] ? (500 - index * 20) : (widthVal[innIndex] * (index * 0.4))} ${heightVal} ${0} ${500}
                  `}
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  id="lineBC"
                  d={`
                    M ${innIndex * 500 + 250} 200
                    q ${openDiaframga.current[innIndex] ? (index * 20 - 500) : (widthVal[innIndex + 1] * (index * 0.4))} ${heightVal} ${0} ${500}
                  `}
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                />
              </>
            ))}
          </>
        ))}
      </svg>
    </>
  );
};

export default TrianglePattern;
