import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/LoadingScreen.css';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading experience...' }) => {
  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="loading-logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="#FFD54F" strokeWidth="2" />
          <path d="M30 40 L50 60 L70 40" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 60 L50 80 L70 60" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M30 20 L50 40 L70 20" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        </svg>
      </motion.div>
      
      <motion.div
        className="loading-text"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {message}
      </motion.div>
      
      <motion.div
        className="loading-progress"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default LoadingScreen;
