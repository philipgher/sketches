import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import * as Vibrant from 'node-vibrant';
import * as BABYLON from 'babylonjs';
import { useGesture } from 'react-use-gesture';
import { animated } from 'react-spring';
import createLookupGradient from './utils/createLookupGradient';
import generateColorsGrid from './utils/generateColorsGrid';
import originalSwatches from './assets/swatches-ck';
import useInertia from './utils/useInertia';

const swatches = originalSwatches.map(swatch => ({
  swatch,
}));

const easeOut = new BABYLON.CubicEase();
easeOut.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

const easeInOut = new BABYLON.CubicEase();
easeInOut.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

const Products3D = () => {
  const camera = useRef();

  const isPinching = useRef();
  const firstFinger = useRef();
  const isDragging = useRef();

  const clickProduct = useCallback((meshName) => {
    const productPositionInGrid = meshName.split('-');

    console.log(productPositionInGrid);

    BABYLON.Animation.CreateAndStartAnimation(
      'velocity',
      camera.current,
      'position',
      60,
      45,
      camera.current.position,
      new BABYLON.Vector3(
        Number(productPositionInGrid[0]),
        Number(productPositionInGrid[1]),
        -3,
      ),
      0,
      easeInOut,
    );

    // openProductDetail(productClicked, productClicked.colorID);
  }, []);

  useEffect(() => {
    (async () => {
      const hueGradientCTX = createLookupGradient(
        swatches.map(product => product.swatch),
        100,
      );

      const colorsArray = await generateColorsGrid(
        swatches.length,
        hueGradientCTX,
        100,
      );

      const grid = colorsArray.map((row, rowI) => row.map((color, colJ) => {
        const productDistances = [];

        for (let i = 0; i < swatches.length; i += 1) {
          if (swatches[i].wasAdded !== undefined) {
            productDistances.push(100 * 2);

            // this will prevent duplicate products being added
            // eslint-disable-next-line no-continue
            continue;
          }

          productDistances.push(
            Vibrant.Util.rgbDiff(
              swatches[i].swatch,
              color,
            ),
          );
        }

        const lowestValue = productDistances.reduce(
          (first, second) => (second < first ? second : first),
          productDistances[0],
        );

        const lowestValueIndex = productDistances.indexOf(
          lowestValue,
        );

        swatches[lowestValueIndex].wasAdded = true;

        swatches[lowestValueIndex].colorLookup = [
          rowI,
          colJ,
        ];

        swatches[lowestValueIndex].colorLookupRGB =	colorsArray[rowI][colJ];

        return swatches[lowestValueIndex];
      }));
    })();

    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

    const createScene = () => {
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3(255, 255, 255);

      camera.current = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 2, -10), scene);

      canvas.addEventListener('click', () => {
        // get which object is 'picked' - touched
        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
        console.log(pickResult);
        if (pickResult.pickedMesh) {
          clickProduct(pickResult.pickedMesh.name);
        }
      });

      const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
      light.intensity = 0.7;

      const planeMaterial = new BABYLON.StandardMaterial('planeMaterial', scene);
      planeMaterial.diffuseTexture = new BABYLON.Texture('/dist/img/1.png', scene);
      planeMaterial.opacityTexture = planeMaterial.diffuseTexture;
      planeMaterial.emissiveTexture = planeMaterial.diffuseTexture;
      planeMaterial.backFaceCulling = true;

      const faceUV = new Array(6);
      for (let i = 0; i < 6; i += 1) {
        faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
      }

      faceUV[1] = new BABYLON.Vector4(1, -1, 0, 0);

      [...Array(11)].forEach((_, i) => {
        [...Array(11)].forEach((__, j) => {
          const box = BABYLON.MeshBuilder.CreateBox(`${i}-${j}`, {
            width: 0.5, height: 0.5, depth: 0.01, faceUV,
          }, scene);
          box.position.x = i;
          box.position.y = j;
          box.material = planeMaterial;
        });
      });

      return scene;
    };

    const scene = createScene();

    engine.runRenderLoop(() => {
      scene.render();
    });
  }, []);

  const bind = useGesture(
    {
      onDrag: ({
        tap, down, delta: [dx, dy], vxvy: [vx, vy], last,
      }) => {
        if (isPinching.current || tap) {
          return;
        }

        isDragging.current = !last;

        if (down) {
          camera.current.position.x += dx * (camera.current.position.z * 0.0005);
          camera.current.position.y -= dy * (camera.current.position.z * 0.0005);
        } else {
          BABYLON.Animation.CreateAndStartAnimation(
            'velocity',
            camera.current,
            'position',
            60,
            45,
            camera.current.position,
            new BABYLON.Vector3(
              camera.current.position.x + vx * (camera.current.position.z * 0.05),
              camera.current.position.y - vy * (camera.current.position.z * 0.05),
              camera.current.position.z,
            ),
            0,
            easeOut,
          );
        }
      },
      onPinch: ({
        delta: [dd], vdva: [vd], first, last,
      }) => {
        if (first) {
          isPinching.current = true;
          firstFinger.current = false;
        }

        if (last && !isDragging.current) {
          isPinching.current = false;
          firstFinger.current = true;

          // onPinch last is true in 2 cycles (I guess for both fingers)
          if (firstFinger.current) {
            BABYLON.Animation.CreateAndStartAnimation(
              'velocityZoom',
              camera.current,
              'position.z',
              60,
              45,
              camera.current.position.z,
              camera.current.position.z - vd * 2,
              0,
              easeOut,
            );
          }
        } else {
          camera.current.position.z += dd * (camera.current.position.z * -0.00125);
        }
      },
      onWheel: ({ delta: [, dy] }) => {
        console.log('wheel');
        camera.current.position.z += dy * 0.01;
      },
    },
    {
      drag: {
        filterTaps: true,
      },
    },
  );

  return (
    <div
      {...bind()}
      style={{
        position: 'absolute', top: '0', left: '0', width: '1080px', height: '1920px',
      }}
    >
      <canvas touch-action="none" id="renderCanvas" width="1080" height="1920" />
    </div>
  );
};

export default Products3D;
