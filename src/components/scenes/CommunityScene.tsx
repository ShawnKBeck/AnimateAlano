import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const CommunityScene: React.FC = () => {
  const { scene } = useThree();
  const fogRef = useRef<THREE.Fog | null>(null);
  const fireRef = useRef<THREE.Group>(null);
  
  // Set up the scene with people around a firepit
  useEffect(() => {
    // Add minimal fog to the scene
    fogRef.current = new THREE.Fog('#3a3a3a', 1, 40);
    scene.fog = fogRef.current;
    
    return () => {
      // Clean up
      scene.fog = null;
    };
  }, [scene]);
  
  // Animate the fire
  useFrame((state) => {
    if (fireRef.current) {
      // Flickering fire animation
      const t = state.clock.getElapsedTime();
      
      // Animate the fire particles
      fireRef.current.children.forEach((child: THREE.Object3D, index: number) => {
        const offset = index * 0.3;
        child.position.y = 0.5 + Math.sin(t * 2 + offset) * 0.2;
        child.rotation.y = t * (0.5 + index * 0.1);
        
        // Scale pulsing
        const scale = 0.6 + Math.sin(t * 3 + offset) * 0.1;
        child.scale.set(scale, scale, scale);
      });
    }
  });
  
  // Create people silhouettes around the fire
  const createPeople = () => {
    const people = [];
    const count = 8; // Number of people
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * 3;
      const z = Math.sin(angle) * 3;
      
      people.push(
        <Person 
          key={i} 
          position={[x, 0, z]} 
          rotation={[0, -angle + Math.PI, 0]}
          animationOffset={i * 0.3}
        />
      );
    }
    
    return people;
  };
  
  return (
    <>
      {/* Ambient light - warm evening glow */}
      <ambientLight intensity={0.2} color="#FFD54F" />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
      </mesh>
      
      {/* Firepit */}
      <group position={[0, -0.3, 0]}>
        {/* Stone circle */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x = Math.cos(angle) * 1.5;
          const z = Math.sin(angle) * 1.5;
          return (
            <mesh key={i} position={[x, 0, z]} castShadow receiveShadow>
              <sphereGeometry args={[0.3, 6, 6]} />
              <meshStandardMaterial color="#757575" roughness={0.9} />
            </mesh>
          );
        })}
        
        {/* Fire base */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.2, 16]} />
          <meshStandardMaterial color="#424242" roughness={1} />
        </mesh>
        
        {/* Logs */}
        <mesh position={[0.3, 0.2, 0.2]} rotation={[0.1, 0.5, 0.2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} />
        </mesh>
        
        <mesh position={[-0.3, 0.2, -0.1]} rotation={[0.1, -0.3, 0.1]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.3, 8]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} />
        </mesh>
        
        <mesh position={[0, 0.2, -0.3]} rotation={[0.2, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.4, 8]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} />
        </mesh>
        
        {/* Fire light source */}
        <pointLight position={[0, 0.5, 0]} intensity={2} color="#FF9800" distance={15} decay={2} />
        
        {/* Fire particles */}
        <group ref={fireRef}>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={i} position={[0, 0.5 + i * 0.1, 0]}>
              <sphereGeometry args={[0.6 - i * 0.1, 8, 8]} />
              <meshBasicMaterial color={i < 2 ? '#FF5722' : '#FF9800'} transparent opacity={0.8 - i * 0.15} />
            </mesh>
          ))}
        </group>
        
        {/* Ember particles */}
        <Sparkles 
          count={30} 
          scale={[2, 3, 2]} 
          position={[0, 1, 0]}
          size={0.3} 
          speed={1} 
          opacity={0.7} 
          color="#FF5722" 
        />
      </group>
      
      {/* People silhouettes */}
      {createPeople()}
      
      {/* Ambient sound visualization particles */}
      <Sparkles 
        count={50} 
        scale={[15, 2, 15]} 
        size={0.2} 
        speed={0.1} 
        opacity={0.3} 
        color="#FFECB3" 
      />
    </>
  );
};

// Person silhouette component
const Person: React.FC<{ 
  position: [number, number, number], 
  rotation: [number, number, number],
  animationOffset: number
}> = ({ position, rotation, animationOffset }) => {
  const personRef = useRef<THREE.Group>(null);
  
  // Subtle breathing/movement animation
  useFrame((state) => {
    if (personRef.current) {
      const t = state.clock.getElapsedTime() + animationOffset;
      
      // Subtle swaying
      personRef.current.rotation.x = Math.sin(t * 0.3) * 0.03;
      personRef.current.rotation.z = Math.sin(t * 0.2) * 0.02;
      
      // Subtle breathing
      const breathScale = 1 + Math.sin(t * 0.5) * 0.02;
      personRef.current.scale.y = breathScale;
    }
  });
  
  return (
    <group ref={personRef} position={position} rotation={rotation}>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.3, 1, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[0.5, 1.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      <mesh position={[-0.5, 1.3, 0]} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[0.2, 0.4, 0]} rotation={[0.1, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.8, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      <mesh position={[-0.2, 0.4, 0]} rotation={[-0.1, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.8, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};

export default CommunityScene;
