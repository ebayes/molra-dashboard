"use client"

import React, { useEffect, useRef } from 'react';
import { LumaSplatsThree } from "@lumaai/luma-web";
import { Color, Scene, PerspectiveCamera, WebGLRenderer, Vector3 } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function DemoHelloWorld() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new WebGLRenderer({ antialias: false });

    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }
    };

    updateSize();
    containerRef.current.appendChild(renderer.domElement);

    // Add OrbitControls after appending renderer to the container
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.background = new Color('white');

    let splats = new LumaSplatsThree({
      source: 'https://lumalabs.ai/capture/ca9ea966-ca24-4ec1-ab0f-af665cb546ff',
      enableThreeShaderIntegration: false,
      particleRevealEnabled: true,
    });

    scene.add(splats);

    splats.onInitialCameraTransform = transform => {
      transform.decompose(camera.position, camera.quaternion, new Vector3());
      controls.update(); // Update controls after setting initial camera position
    };

    camera.position.z = 2; // Set an initial camera position

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
      splats.dispose();
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
}