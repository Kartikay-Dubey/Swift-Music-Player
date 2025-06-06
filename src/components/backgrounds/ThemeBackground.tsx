import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import StarsBackground from './StarsBackground';
import FireBackground from './FireBackground';
import OceanBackground from './OceanBackground';
import RainBackground from './RainBackground';

const ThemeBackground: React.FC = () => {
  const { currentTheme } = useTheme();
  
  return (
    <>
      {currentTheme === 'stars' && <StarsBackground />}
      {currentTheme === 'fire' && <FireBackground />}
      {currentTheme === 'ocean' && <OceanBackground />}
      {currentTheme === 'rain' && <RainBackground />}
    </>
  );
};

export default ThemeBackground; 