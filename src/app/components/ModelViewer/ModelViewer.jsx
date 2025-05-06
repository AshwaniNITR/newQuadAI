"use client"
import { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';

const ModelViewer = ({ modelBlob }) => {
    console.log("Model Blob:", modelBlob); // Debugging line to check the blob
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!modelBlob || !canvasRef.current) return;

        const engine = new BABYLON.Engine(canvasRef.current, true);
        const scene = new BABYLON.Scene(engine);

        // Camera setup
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            -Math.PI / 2,
            Math.PI / 2,
            10,
            BABYLON.Vector3.Zero(),
            scene
        );
        camera.attachControl(canvasRef.current, true);
        camera.lowerRadiusLimit = 2;
        camera.upperRadiusLimit = 20;

        // Lighting
        new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0, -1, 1), scene);

        // Create blob URL for the STL
        const blobUrl = URL.createObjectURL(modelBlob);

        // Load STL model
        BABYLON.SceneLoader.ImportMesh(
            "",
            "",
            blobUrl,
            scene,
            (meshes) => {
                // Center and scale the model
                const boundingBox = meshes[0].getBoundingInfo().boundingBox;
                const center = boundingBox.center;
                const size = boundingBox.extendSize.scale(2);
                
                meshes.forEach(mesh => {
                    mesh.position = center.negate();
                    const scale = 5 / Math.max(size.x, size.y, size.z);
                    mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
                });
            },
            null,
            (_, message) => {
                console.error("Error loading model:", message);
            },
            ".stl"
        );

        // Handle resizing
        const resizeObserver = new ResizeObserver(() => engine.resize());
        resizeObserver.observe(canvasRef.current);

        engine.runRenderLoop(() => scene.render());

        return () => {
            URL.revokeObjectURL(blobUrl);
            resizeObserver.disconnect();
            scene.dispose();
            engine.dispose();
        };
    }, [modelBlob]);

    return (
        <canvas 
            ref={canvasRef} 
            style={{ 
                width: '100%', 
                height: '500px',
                outline: 'none'
            }} 
        />
    );
};

export default ModelViewer;