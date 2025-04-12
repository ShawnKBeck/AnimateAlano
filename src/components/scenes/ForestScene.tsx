import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const ForestScene: React.FC = () => {
  const { scene } = useThree();
  const fogRef = useRef<THREE.Fog | null>(null);
  
  // Set up the foggy forest scene
  useEffect(() => {
    // Add fog to the scene
    fogRef.current = new THREE.Fog('#111111', 1, 15);
    scene.fog = fogRef.current;
    
    return () => {
      // Clean up
      scene.fog = null;
    };
  }, [scene]);
  
  // Create trees for the forest
  const createTrees = () => {
    const trees = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 20 - 10;
      const z = Math.random() * 20 - 10;
      trees.push(
        <Tree key={i} position={[x, 0, z]} scale={[0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5]} />
      );
    }
    return trees;
  };
  
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.1} />
      
      {/* Distant dim light */}
      <pointLight position={[0, 5, -10]} intensity={0.2} color="#3366ff" />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      
      {/* Trees */}
      {createTrees()}
      
      {/* Fog particles */}
      <Sparkles count={200} scale={[20, 5, 20]} size={5} speed={0.2} opacity={0.1} color="#ffffff" />
    </>
  );
};

// Simple tree component
const Tree: React.FC<{ position: [number, number, number], scale: [number, number, number] }> = ({ position, scale }) => {
  const treeRef = useRef<THREE.Group>(null);
  
  // Simple animation
  useFrame((state) => {
    if (treeRef.current) {
      treeRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.02;
    }
  });
  
  return (
    <group ref={treeRef} position={position} scale={scale}>
      {/* Tree trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      
      {/* Tree foliage */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial color="#1a2e1a" />
      </mesh>
    </group>
  );
};

export default ForestScene;
