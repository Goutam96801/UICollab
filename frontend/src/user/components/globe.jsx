import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Globe from "react-globe.gl";
import { useThree } from "@react-three/fiber";
import * as THREE from 'three';

export function GlobeDemo() {
  const [rise, setRise] = useState(false);
  const globeRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    setTimeout(() => setRise(true), 6000);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = false; // Disable default zoom
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
    }
  }, []);

  const handleWheel = useCallback((event) => {
    event.preventDefault();
    if (containerRef.current) {
      containerRef.current.scrollTop += event.deltaY;
    }
  }, []);

  const handleTouchMove = useCallback((event) => {
    if (event.touches.length === 2) {
      // Enable pinch-to-zoom when two fingers are on the screen
      if (globeRef.current) {
        const controls = globeRef.current.controls();
        controls.enableZoom = true;
      }
    } else {
      // Disable zoom for other touch interactions
      if (globeRef.current) {
        const controls = globeRef.current.controls();
        controls.enableZoom = false;
      }
    }
  }, []);

  // Gen random paths
  const N_PATHS = 10;
  const MAX_POINTS_PER_LINE = 10000;
  const MAX_STEP_DEG = 1;
  const MAX_STEP_ALT = 0.015;
  const gData = useMemo(
    () =>
      [...Array(N_PATHS).keys()].map(() => {
        let lat = (Math.random() - 0.5) * 90;
        let lng = (Math.random() - 0.5) * 360;
        let alt = 0;

        return [
          [lat, lng, alt],
          ...[
            ...Array(Math.round(Math.random() * MAX_POINTS_PER_LINE)).keys(),
          ].map(() => {
            lat += (Math.random() * 2 - 1) * MAX_STEP_DEG;
            lng += (Math.random() * 2 - 1) * MAX_STEP_DEG;
            alt += (Math.random() * 2 - 1) * MAX_STEP_ALT;
            alt = Math.max(0, alt);

            return [lat, lng, alt];
          }),
        ];
      }),
    []
  );

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-y-hidden flex items-center justify-center"
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => {
        if (globeRef.current) {
          const controls = globeRef.current.controls();
          controls.enableZoom = false;
        }
      }}
    >
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        pathsData={gData}
        pathColor={() => ["rgba(0,0,255,0.6)", "rgba(255,0,0,0.6)"]}
        pathDashLength={0.01}
        backgroundColor="rgba(0,0,0,0)"
        pathDashGap={0.004}
        pathDashAnimateTime={100000}
        pathPointAlt={rise ? (pnt) => pnt[2] : undefined}
        pathTransitionDuration={rise ? 4000 : undefined}
      />
    </div>
  );
}
