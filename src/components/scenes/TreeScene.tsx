import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';

// Recovery values for the glowing leaves
const VALUES = [
  'Hope', 'Faith', 'Courage', 'Honesty', 'Willingness',
  'Humility', 'Love', 'Service', 'Integrity', 'Perseverance',
  'Serenity', 'Gratitude', 'Acceptance', 'Forgiveness', 'Growth'
];

const TreeScene: React.FC = () => {
  const { scene } = useThree();
  const fogRef = useRef<THREE.Fog | null>(null);
  const treeRef = useRef<THREE.Group>(null);
  
  // Set up the scene with a glowing tree
  useEffect(() => {
    // Add minimal fog to the scene
    fogRef.current = new THREE.Fog('#4a4a4a', 1, 50);
    scene.fog = fogRef.current;
    
    return () => {
      // Clean up
      scene.fog = null;
    };
  }, [scene]);
  
  // Animate the tree and leaves
  useFrame((state) => {
    if (treeRef.current) {
      // Subtle tree movement
      const t = state.clock.getElapsedTime();
      treeRef.current.rotation.y = Math.sin(t * 0.1) * 0.05;
      
      // Animate the leaves
      treeRef.current.children.forEach((child: THREE.Object3D, index: number) => {
        if (child.name === 'leaf') {
          const offset = index * 0.3;
          
          // Gentle floating motion
          child.position.y += Math.sin(t * 0.5 + offset) * 0.001;
          child.rotation.z = Math.sin(t * 0.3 + offset) * 0.1;
          
          // Pulsing glow effect
          // @ts-ignore - accessing material property
          if (child.material) {
            // @ts-ignore - accessing emissiveIntensity property
            child.material.emissiveIntensity = 0.5 + Math.sin(t * 0.5 + offset) * 0.3;
          }
        }
      });
    }
  });
  
  // Create the glowing leaves with values
  const createLeaves = () => {
    const leaves = [];
    const leafCount = VALUES.length;
    
    for (let i = 0; i < leafCount; i++) {
      // Calculate position in a spiral pattern around the tree
      const angle = (i / leafCount) * Math.PI * 6; // Multiple rotations for spiral
      const radius = 2 + (i / leafCount) * 3; // Increasing radius for spiral
      const height = 2 + (i / leafCount) * 8; // Height increases with spiral
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Random offset for natural look
      const offsetX = (Math.random() - 0.5) * 0.5;
      const offsetY = (Math.random() - 0.5) * 0.5;
      const offsetZ = (Math.random() - 0.5) * 0.5;
      
      // Generate a color based on position in the spiral
      const hue = (i / leafCount) * 120 + 60; // From yellow (60) to green (180)
      const color = `hsl(${hue}, 100%, 70%)`;
      const emissiveColor = `hsl(${hue}, 100%, 50%)`;
      
      leaves.push(
        <group key={i} position={[x + offsetX, height + offsetY, z + offsetZ]}>
          {/* Leaf */}
          <mesh name="leaf">
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial 
              color={color} 
              emissive={emissiveColor}
              emissiveIntensity={0.8}
              roughness={0.3}
            />
          </mesh>
          
          {/* Value text */}
          <Text
            position={[0, 0.7, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
            font="https://fonts.gstatic.com/s/raleway/v28/1Ptsg8zYS_SKggPNyCg4TYFq.woff"
          >
            {VALUES[i]}
          </Text>
        </group>
      );
    }
    
    return leaves;
  };
  
  return (
    <>
      {/* Ambient light - bright, hopeful scene */}
      <ambientLight intensity={0.4} color="#FFFFFF" />
      
      {/* Directional light */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        color="#FFFDE7"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#4a5a4a" roughness={0.8} />
      </mesh>
      
      {/* Tree */}
      <group ref={treeRef} position={[0, 0, 0]}>
        {/* Trunk */}
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.8, 4, 12]} />
          <meshStandardMaterial color="#5D4037" roughness={0.8} />
        </mesh>
        
        {/* Main branches */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const x = Math.cos(angle) * 0.8;
          const z = Math.sin(angle) * 0.8;
          const height = 3 + i * 0.5;
          
          return (
            <mesh 
              key={i} 
              position={[x, height, z]} 
              rotation={[Math.random() * 0.3, angle, Math.random() * 0.3]}
              castShadow
            >
              <cylinderGeometry args={[0.15, 0.25, 1.5 + Math.random(), 8]} />
              <meshStandardMaterial color="#5D4037" roughness={0.8} />
            </mesh>
          );
        })}
        
        {/* Secondary branches */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2 + 0.2;
          const x = Math.cos(angle) * 1.2;
          const z = Math.sin(angle) * 1.2;
          const height = 4 + i * 0.3;
          
          return (
            <mesh 
              key={i + 5} 
              position={[x, height, z]} 
              rotation={[Math.random() * 0.3, angle, Math.random() * 0.3]}
              castShadow
            >
              <cylinderGeometry args={[0.1, 0.15, 1.2 + Math.random(), 8]} />
              <meshStandardMaterial color="#5D4037" roughness={0.8} />
            </mesh>
          );
        })}
        
        {/* Leaves with values */}
        {createLeaves()}
      </group>
      
      {/* Ambient particles */}
      <Sparkles 
        count={100} 
        scale={[15, 10, 15]} 
        size={0.5} 
        speed={0.2} 
        opacity={0.5} 
        color="#FFECB3" 
      />
      
      {/* Light beams */}
      <Sparkles 
        count={50} 
        scale={[10, 15, 10]} 
        position={[0, 5, 0]}
        size={1} 
        speed={0.1} 
        opacity={0.3} 
        color="#FFFFFF" 
      />
    </>
  );
};

export default TreeScene;
