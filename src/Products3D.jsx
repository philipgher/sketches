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

const easeInOut = new BABYLON.CubicEase();
easeInOut.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

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

      const pointerState = {
        tap: false,
        down: false,
        downSec: false,
        last: [0, 0],
        lastSec: [0, 0],
        delta: [0, 0],
        deltaSec: [0, 0],
      };

      scene.onPointerObservable.add((pointerInfo) => {
        const { event } = pointerInfo;

        console.log(event.isPrimary);


        switch (pointerInfo.type) {
          case BABYLON.PointerEventTypes.POINTERDOWN:
            if (event.isPrimary) {
              pointerState.down = true;
              pointerState.start = [event.offsetX, event.offsetY];
              pointerState.last = [event.offsetX, event.offsetY];
            } else {
              pointerState.downSec = true;
              pointerState.startSec = [event.offsetX, event.offsetY];
              pointerState.lastSec = [event.offsetX, event.offsetY];
            }
            break;

          case BABYLON.PointerEventTypes.POINTERUP:
            if (event.isPrimary) {
              pointerState.down = false;
            } else {
              pointerState.downSec = false;
            }

            if (pointerState.tap) {
              pointerState.tap = false;
              return;
            }

            if (event.isPrimary) {
              BABYLON.Animation.CreateAndStartAnimation(
                'velocity',
                camera.current,
                'position',
                60,
                45,
                camera.current.position,
                new BABYLON.Vector3(
                  camera.current.position.x + pointerState.delta[0] * (camera.current.position.z / -40),
                  camera.current.position.y - pointerState.delta[1] * (camera.current.position.z / -40),
                  camera.current.position.z,
                ),
                0,
                easeOut,
              );
            }
            break;

          case BABYLON.PointerEventTypes.POINTERMOVE:
            pointerState.tap = false;

            if (pointerState.down) {
              pointerState.delta = [pointerState.last[0] - event.offsetX, pointerState.last[1] - event.offsetY];
              pointerState.last = [event.offsetX, event.offsetY];
            }
            break;

          case BABYLON.PointerEventTypes.POINTERWHEEL:
            camera.current.position.z += event.deltaY * 0.01;

            break;

          case BABYLON.PointerEventTypes.POINTERTAP:
            console.log('tap');
            pointerState.tap = true;

            console.log(event);

            BABYLON.Animation.CreateAndStartAnimation(
              'clickBounce',
              camera.current,
              'position.z',
              60,
              45,
              camera.current.position.z,
              -3.5,
              0,
              easeInOut,
            );

            break;

          default:
            break;
        }

        if (pointerState.down && event.isPrimary) {
          camera.current.position.x -= pointerState.delta[0] * (camera.current.position.z / 2000);
          camera.current.position.y += pointerState.delta[1] * (camera.current.position.z / 2000);
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

      const clickProduct = (event) => {
        const pickedProduct = event.meshUnderPointer.name;

        const productPositionInGrid = pickedProduct.split('-');

        console.log(productPositionInGrid);
      };

      [...Array(11)].forEach((_, i) => {
        [...Array(11)].forEach((__, j) => {
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
    <>
      <canvas style={{ position: 'absolute', top: '0', left: '0' }} touch-action="none" id="renderCanvas" width="1080" height="1920" />
      {/* <div style={{
        position: 'absolute', top: '0', left: '0', width: '1080px', height: '1920px',
      }} /> */}
    </>
  );
};

export default Products3D;
