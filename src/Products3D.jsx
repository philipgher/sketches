import React, { useEffect, useRef, useState } from 'react';
import * as Vibrant from 'node-vibrant';
import * as BABYLON from 'babylonjs';
import { useGesture } from 'react-use-gesture';
import createLookupGradient from './utils/createLookupGradient';
import generateColorsGrid from './utils/generateColorsGrid';
import originalSwatches from './assets/swatches-ck';
import useInertia from './utils/useInertia';

const swatches = originalSwatches.map(swatch => ({
  swatch,
}));

const easeOut = new BABYLON.CubicEase();
easeOut.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

const Products3D = () => {
  const camera = useRef();

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

      let pointerState = {
        start: [0, 0],
        previous: [0, 0],
        last: [0, 0],
        movement: [0, 0],
        delta: [0, 0],
      };

      scene.onPointerObservable.add((pointerInfo) => {
        const { event } = pointerInfo;

        switch (pointerInfo.type) {
          case BABYLON.PointerEventTypes.POINTERDOWN:
            pointerState.start = [event.offsetX, event.offsetY];
            break;

          case BABYLON.PointerEventTypes.POINTERUP:
            pointerState.previous = pointerState.movement;
            break;

          case BABYLON.PointerEventTypes.POINTERMOVE:
            pointerState.movement = [pointerState.previous[0] - (pointerState.start[0] - event.offsetX), pointerState.previous[1] - (pointerState.start[1] - event.offsetY)];
            break;

          case BABYLON.PointerEventTypes.POINTERWHEEL:
            break;

          case BABYLON.PointerEventTypes.POINTERTAP:
            break;

          default:
            break;
        }

        camera.current.position.x = pointerState.movement[0] * (camera.current.position.z / 2500);
        camera.current.position.y = -pointerState.movement[1] * (camera.current.position.z / 2500);
      });

      const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
      light.intensity = 0.7;

      const planeMaterial = new BABYLON.StandardMaterial('planeMaterial', scene);
      planeMaterial.diffuseTexture = new BABYLON.Texture('/dist/img/1.png', scene);
      planeMaterial.opacityTexture = planeMaterial.diffuseTexture;
      planeMaterial.emissiveTexture = planeMaterial.diffuseTexture;
      planeMaterial.backFaceCulling = false;

      const faceUV = new Array(6);
      for (let i = 0; i < 6; i += 1) {
        faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
      }

      faceUV[1] = new BABYLON.Vector4(1, -1, 0, 0);

      const clickProduct = (event) => {
        const pickedProduct = event.meshUnderPointer.name;

        console.log(pickedProduct);
      };

      [...Array(10)].forEach((_, i) => {
        [...Array(10)].forEach((__, j) => {
          const box = BABYLON.MeshBuilder.CreateBox(`${i}-${j}`, {
            width: 0.5, height: 0.5, depth: 0.01, faceUV,
          }, scene);
          box.position.x = i;
          box.position.y = j;
          box.material = planeMaterial;

          box.actionManager = new BABYLON.ActionManager(scene);
          box.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, clickProduct),
          );
        });
      });

      return scene;
    };

    const scene = createScene();

    // scene.debugLayer.show();

    engine.runRenderLoop(() => {
      scene.render();
    });
  }, []);

  return (
    <canvas style={{ position: 'absolute', top: '0', left: '0' }} touch-action="none" id="renderCanvas" width="1080" height="1920" />
  );
};

export default Products3D;
