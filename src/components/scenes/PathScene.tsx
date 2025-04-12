import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const PathScene: React.FC = () => {
  const { scene } = useThree();
  const fogRef = useRef<THREE.Fog | null>(null);
  const clubhouseRef = useRef<THREE.Group>(null);
  
  // Set up the scene with a path to the clubhouse
  useEffect(() => {
    // Add lighter fog to the scene
    fogRef.current = new THREE.Fog('#2a2a2a', 1, 30);
    scene.fog = fogRef.current;
    
    return () => {
      // Clean up
      scene.fog = null;
    };
  }, [scene]);
  
  // Animate the clubhouse light
  useFrame((state) => {
    if (clubhouseRef.current) {
      // Gentle pulsating glow from the clubhouse
      const t = state.clock.getElapsedTime();
      const children = clubhouseRef.current.children;
      
      // Find the window meshes and make them glow
      children.forEach((child: THREE.Object3D) => {
        if (child.name === 'window') {
          // @ts-ignore - accessing material property
          if (child.material) {
            // @ts-ignore - accessing emissiveIntensity property
            child.material.emissiveIntensity = 0.8 + Math.sin(t * 0.5) * 0.2;
          }
        }
      });
    }
  });
  
  // Create trees for the sides of the path
  const createTrees = () => {
    const trees = [];
    // Left side trees
    for (let i = 0; i < 10; i++) {
      const x = -5 - Math.random() * 10;
      const z = -15 + i * 3 + Math.random() * 2;
      trees.push(
        <Tree key={`left-${i}`} position={[x, 0, z]} scale={[0.6 + Math.random() * 0.4, 0.6 + Math.random() * 0.4, 0.6 + Math.random() * 0.4]} />
      );
    }
    
    // Right side trees
    for (let i = 0; i < 10; i++) {
      const x = 5 + Math.random() * 10;
      const z = -15 + i * 3 + Math.random() * 2;
      trees.push(
        <Tree key={`right-${i}`} position={[x, 0, z]} scale={[0.6 + Math.random() * 0.4, 0.6 + Math.random() * 0.4, 0.6 + Math.random() * 0.4]} />
      );
    }
    return trees;
  };
  
  return (
    <>
      {/* Ambient light - brighter than previous scenes */}
      <ambientLight intensity={0.3} color="#a8c0ff" />
      
      {/* Sunlight */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        color="#fffaf0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#2a3a2a" />
      </mesh>
      
      {/* Path to clubhouse */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]} receiveShadow>
        <planeGeometry args={[3, 30]} />
        <meshStandardMaterial color="#9b7653" roughness={0.8} />
      </mesh>
      
      {/* Clubhouse in the distance */}
      <group ref={clubhouseRef} position={[0, 0, -20]}>
        {/* Main building */}
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[6, 4, 5]} />
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </mesh>
        
        {/* Roof */}
        <mesh position={[0, 4.5, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[4.5, 2, 4, 1]} />
          <meshStandardMaterial color="#5D4037" roughness={0.6} />
        </mesh>
        
        {/* Door */}
        <mesh position={[0, 1, 2.51]} castShadow>
          <boxGeometry args={[1.5, 2.5, 0.1]} />
          <meshStandardMaterial color="#3E2723" roughness={0.5} />
        </mesh>
        
        {/* Windows with glowing light */}
        <mesh position={[-2, 2.5, 2.51]} name="window" castShadow>
          <boxGeometry args={[1, 1, 0.1]} />
          <meshStandardMaterial 
            color="#FFE082" 
            emissive="#FFC107"
            emissiveIntensity={1}
            roughness={0.3}
          />
        </mesh>
        
        <mesh position={[2, 2.5, 2.51]} name="window" castShadow>
          <boxGeometry args={[1, 1, 0.1]} />
          <meshStandardMaterial 
            color="#FFE082" 
            emissive="#FFC107"
            emissiveIntensity={1}
            roughness={0.3}
          />
        </mesh>
        
        {/* Light from the clubhouse */}
        <pointLight position={[0, 2, 3]} intensity={1} color="#FFC107" distance={10} decay={2} />
      </group>
      
      {/* Trees */}
      {createTrees()}
      
      {/* Subtle fog particles */}
      <Sparkles count={100} scale={[30, 5, 30]} size={3} speed={0.2} opacity={0.05} color="#ffffff" />
      
      {/* Fireflies/light particles around the path */}
      <Sparkles 
        count={50} 
        scale={[10, 3, 20]} 
        size={0.5} 
        speed={0.3} 
        opacity={0.7} 
        color="#FFEB3B" 
      />
    </>
  );
};

// Tree component with greener foliage
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
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      
      {/* Tree foliage - greener and more vibrant */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial color="#2E7D32" />
      </mesh>
    </group>
  );
};

export default PathScene;
