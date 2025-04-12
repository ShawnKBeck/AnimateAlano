import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const HorizonScene: React.FC = () => {
  const { scene } = useThree();
  const fogRef = useRef<THREE.Fog | null>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  
  // Set up the foggy scene with light on the horizon
  useEffect(() => {
    // Add fog to the scene - slightly lighter than the forest scene
    fogRef.current = new THREE.Fog('#1a1a1a', 1, 20);
    scene.fog = fogRef.current;
    
    return () => {
      // Clean up
      scene.fog = null;
    };
  }, [scene]);
  
  // Animate the light intensity
  useFrame((state) => {
    if (lightRef.current) {
      // Pulsate the light slightly
      const t = state.clock.getElapsedTime();
      lightRef.current.intensity = 1 + Math.sin(t * 0.5) * 0.3;
      
      // Animate light position slightly
      lightRef.current.position.y = 5 + Math.sin(t * 0.2) * 0.5;
    }
    
    // Gradually reduce fog density
    if (fogRef.current) {
      fogRef.current.far = 20 + Math.sin(state.clock.getElapsedTime() * 0.2) * 5;
    }
  });
  
  // Create trees for the forest, but more sparse than the first scene
  const createTrees = () => {
    const trees = [];
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 30 - 15;
      const z = Math.random() * 30 - 15;
      // Keep trees away from the light path
      if (Math.abs(x) > 3 || z < 0) {
        trees.push(
          <Tree key={i} position={[x, 0, z]} scale={[0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5]} />
        );
      }
    }
    return trees;
  };
  
  return (
    <>
      {/* Ambient light - slightly brighter than forest scene */}
      <ambientLight intensity={0.2} />
      
      {/* The light of hope on the horizon */}
      <directionalLight
        ref={lightRef}
        position={[0, 5, -15]}
        intensity={1.5}
        color="#ffeebb"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Light beam particles */}
      <Sparkles 
        count={100} 
        scale={[4, 8, 15]} 
        position={[0, 4, -10]} 
        size={6} 
        speed={0.3} 
        opacity={0.4} 
        color="#ffffcc" 
      />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Trees */}
      {createTrees()}
      
      {/* Fog particles - less dense than forest scene */}
      <Sparkles count={150} scale={[30, 5, 30]} size={4} speed={0.2} opacity={0.08} color="#ffffff" />
      
      {/* Birds in the distance */}
      <group position={[0, 8, -20]}>
        <Bird position={[2, 0, 0]} />
        <Bird position={[-3, 1, 2]} />
        <Bird position={[4, -1, -1]} />
      </group>
    </>
  );
};

// Simple tree component (same as in ForestScene)
interface TreeProps {
  position: [number, number, number];
  scale: [number, number, number];
}

const Tree: React.FC<TreeProps> = ({ position, scale }) => {
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
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      
      {/* Tree foliage - slightly greener than forest scene */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial color="#1e3a1e" />
      </mesh>
    </group>
  );
};

// Simple bird component
interface BirdProps {
  position: [number, number, number];
}

const Bird: React.FC<BirdProps> = ({ position }) => {
  const birdRef = useRef<THREE.Group>(null);
  const wingSpeed = 0.2 + Math.random() * 0.3;
  const flySpeed = 0.05 + Math.random() * 0.05;
  
  useFrame((state) => {
    if (birdRef.current) {
      // Wing flapping animation
      const t = state.clock.getElapsedTime();
      birdRef.current.position.y = position[1] + Math.sin(t * flySpeed) * 0.5;
      birdRef.current.position.x = position[0] + Math.sin(t * flySpeed * 0.5) * 1;
      
      // Get children (wings)
      if (birdRef.current.children.length >= 2) {
        const leftWing = birdRef.current.children[0];
        const rightWing = birdRef.current.children[1];
        
        leftWing.rotation.z = Math.sin(t * wingSpeed) * 0.3;
        rightWing.rotation.z = -Math.sin(t * wingSpeed) * 0.3;
      }
    }
  });
  
  return (
    <group ref={birdRef} position={position} scale={[0.2, 0.2, 0.2]}>
      {/* Bird body */}
      <mesh>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* Wings */}
      <mesh position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="#333333" side={2} />
      </mesh>
      
      <mesh position={[1, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="#333333" side={2} />
      </mesh>
    </group>
  );
};

export default HorizonScene;
