import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import type { Group } from "three";

const ROBOT_GLB_URL = "/animated_robot_sdc.glb";

interface Robot3DModelProps {
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
}

export function Robot3DModel({
  position: [x, y, z],
  scale = 0.2,
  rotationY,
}: Robot3DModelProps) {
  const groupRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(ROBOT_GLB_URL);
  const sceneRef = useRef(scene);
  const { actions } = useAnimations(animations, sceneRef);

  useEffect(() => {
    const action = actions["Scene"] ?? Object.values(actions)[0];
    if (action) action.reset().fadeIn(0.5).play();
    return () => {
      action?.fadeOut(0.5);
    };
  }, [actions]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(x, y, z);
  });

  return (
    <group
      ref={groupRef}
      position={[x, y, z]}
      scale={scale}
      rotation={[0, rotationY ?? 0, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(ROBOT_GLB_URL);
