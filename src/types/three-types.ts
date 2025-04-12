import * as THREE from 'three';

// Extend the global namespace to include THREE
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      spotLight: any;
      pointLight: any;
    }
  }
}

// Export THREE for use in components
export { THREE };
