"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(1200);
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = (Math.random() - 0.5) * 18;
      arr[i + 1] = (Math.random() - 0.5) * 12;
      arr[i + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.07;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        size={0.045}
        sizeAttenuation
        depthWrite={false}
        color="#34d399"
      />
    </Points>
  );
}

export default function PublicProfileScene() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}

