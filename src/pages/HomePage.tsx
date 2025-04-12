import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/HomePage.css';
import { ForestScene, HorizonScene, PathScene, CommunityScene, TreeScene } from '../components/scenes';
import { CallToAction, LoadingScreen } from '../components/ui';

gsap.registerPlugin(ScrollTrigger);

const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Force the loaded state after a timeout to prevent getting stuck
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Initialize GSAP ScrollTrigger for scene transitions
    if (containerRef.current && scrollRef.current && isLoaded) {
      const sections = gsap.utils.toArray('.scene-section');
      
      // Create a timeline for each section
      sections.forEach((section: any, i) => {
        const nextSection = sections[i + 1];
        
        if (nextSection) {
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            pin: true,
            pinSpacing: false
          });
        }
      });
    }
    
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoaded]);

  return (
    <div className="home-container" ref={containerRef}>
      {!isLoaded ? (
        <LoadingScreen message="From Isolation to Illumination" />
      ) : (
        <div className="scroll-container" ref={scrollRef}>
          {/* Scene 1: Foggy Forest (Isolation) */}
          <section className="scene-section" id="scene-isolation">
            <div className="canvas-container">
              <Canvas shadows>
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 1, 5]} />
                  <ForestScene />
                  <OrbitControls enableZoom={false} enablePan={false} />
                </Suspense>
              </Canvas>
            </div>
            <motion.div 
              className="text-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
            >
              <h2>Lost. Alone. Numb.</h2>
              <p>We've all been there.</p>
            </motion.div>
          </section>
          
          {/* Scene 2: Light on the Horizon (Hope) */}
          <section className="scene-section" id="scene-hope">
            <div className="canvas-container">
              <Canvas shadows>
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 1, 5]} />
                  <HorizonScene />
                  <OrbitControls enableZoom={false} enablePan={false} />
                </Suspense>
              </Canvas>
            </div>
            <motion.div 
              className="text-overlay"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            >
              <h2>Recovery starts with a single step.</h2>
            </motion.div>
          </section>
          
          {/* Scene 3: Walking Path to Clubhouse (Community) */}
          <section className="scene-section" id="scene-community">
            <div className="canvas-container">
              <Canvas shadows>
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 1, 5]} />
                  <PathScene />
                  <OrbitControls enableZoom={false} enablePan={false} />
                </Suspense>
              </Canvas>
            </div>
            <motion.div 
              className="text-overlay"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            >
              <h2>A place to heal, to share, to belong.</h2>
            </motion.div>
          </section>
          
          {/* Scene 4: People Silhouettes Around a Firepit (Connection) */}
          <section className="scene-section" id="scene-connection">
            <div className="canvas-container">
              <Canvas shadows>
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 1, 5]} />
                  <CommunityScene />
                  <OrbitControls enableZoom={false} enablePan={false} />
                </Suspense>
              </Canvas>
            </div>
            <motion.div 
              className="text-overlay"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            >
              <h2>Find your people. Find your peace.</h2>
            </motion.div>
          </section>
          
          {/* Scene 5: Tree with Glowing Leaves (Growth & Self-Discovery) */}
          <section className="scene-section" id="scene-growth">
            <div className="canvas-container">
              <Canvas shadows>
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 1, 5]} />
                  <TreeScene />
                  <OrbitControls enableZoom={false} enablePan={false} />
                </Suspense>
              </Canvas>
            </div>
            <motion.div 
              className="text-overlay"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            >
              <h2>Discover who you were meant to be.</h2>
            </motion.div>
          </section>
          
          {/* Call to Action Section */}
          <section className="scene-section" id="scene-cta">
            <motion.div 
              className="cta-container"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            >
              <h1>DeKalb Area Alano Club</h1>
              <p>A safe, private, and inclusive meeting space for 12-step recovery meetings within DeKalb County.</p>
              <CallToAction />
            </motion.div>
          </section>
        </div>
      )}
    </div>
  );
};

export default HomePage;
