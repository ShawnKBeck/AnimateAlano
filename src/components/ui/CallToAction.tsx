import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/CallToAction.css';

const CallToAction: React.FC = () => {
  return (
    <div className="cta-buttons-container">
      <motion.div
        className="cta-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        <CTAButton 
          icon="📅" 
          text="View Meeting Schedule" 
          onClick={() => console.log('View Meeting Schedule clicked')} 
          delay={0.1}
        />
        <CTAButton 
          icon="🧭" 
          text="New to Recovery?" 
          onClick={() => console.log('New to Recovery clicked')} 
          delay={0.2}
        />
        <CTAButton 
          icon="❤️" 
          text="Get Involved" 
          onClick={() => console.log('Get Involved clicked')} 
          delay={0.3}
        />
        <CTAButton 
          icon="✍️" 
          text="Contact Us" 
          onClick={() => console.log('Contact Us clicked')} 
          delay={0.4}
        />
      </motion.div>
    </div>
  );
};

interface CTAButtonProps {
  icon: string;
  text: string;
  onClick: () => void;
  delay: number;
}

const CTAButton: React.FC<CTAButtonProps> = ({ icon, text, onClick, delay }) => {
  return (
    <motion.button
      className="cta-button"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05, backgroundColor: '#FFD54F' }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="cta-icon">{icon}</span>
      <span className="cta-text">{text}</span>
    </motion.button>
  );
};

export default CallToAction;
