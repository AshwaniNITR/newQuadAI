"use client"
import { useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';

const ModelViewer = ({ modelPath }) => {
  const canvasRef = useRef(null);
  const [engine, setEngine] = useState(null);
  const [scene, setScene] = useState(null);

  useEffect(() => {
    const createScene = (engine) => {
      const scene = new BABYLON.Scene(engine);

      // Create camera
      const camera = new BABYLON.ArcRotateCamera(
        "camera1", 
        Math.PI / 2, Math.PI / 2, 
        10, 
        BABYLON.Vector3.Zero(), 
        scene
      );
      camera.attachControl(canvasRef.current, true);
      
      // Add lights
      new BABYLON.HemisphericLight("light1", BABYLON.Vector3.Up(), scene);
      new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0, -1, 1), scene);

      // Load STL model
      BABYLON.SceneLoader.ImportMesh(
        '', 
        '', 
        modelPath, 
        scene, 
        (meshes) => {
          meshes.forEach((mesh) => {
            mesh.position = BABYLON.Vector3.Zero();  // Position model
            mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1); // Scale the model
          });
        },
        null,
        (scene, error) => {
          console.error('Error loading model:', error);
        }
      );

      return scene;
    };

    if (canvasRef.current) {
      const engine = new BABYLON.Engine(canvasRef.current, true);
      setEngine(engine);

      const scene = createScene(engine);
      setScene(scene);

      engine.runRenderLoop(() => {
        scene.render();
      });

      // Resize the engine when window resizes
      window.addEventListener('resize', () => {
        engine.resize();
      });
    }

    return () => {
      if (engine) {
        engine.dispose();
      }
    };
  }, [modelPath]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '500px' }} />;
};

export default ModelViewer;