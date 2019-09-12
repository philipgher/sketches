import React, { useEffect, useState, useRef } from 'react';

const MiniLines = ({ timer }) => {
  const rotation = useRef(0);

  useEffect(() => {
    rotation.current = Math.sin(timer) * 30;
  });

  return (
    <>
      {[...Array(50)].map((_, i) => (
        <>
          {[...Array(50)].map((_, j) => (
            <div
              style={{
                backgroundColor: 'white',
                position: 'absolute',
                top: `${i * 10 + 50}px`,
                left: `${j * 10 + 50}px`,
                height: '1px',
                width: '20px',
                transform: `rotate(${rotation.current * Math.sin(timer - (i * 0.1) + (j * 0.1)) * 10}deg)`,
                transformOrigin: 'center center',
              }}
            />
          ))}
        </>
      ))}
    </>
  );
};

export default MiniLines;
