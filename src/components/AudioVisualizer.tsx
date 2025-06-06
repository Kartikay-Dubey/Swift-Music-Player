import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AudioVisualizerProps {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  colorScheme?: 'default' | 'rainbow' | 'fire' | 'ocean';
  // Add optional howler instance for alternative audio source
  howlerInstance?: any;
}

const VisualizerContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '80px',
  position: 'relative',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)',
}));

const VisualizerCanvas = styled('canvas')({
  width: '100%',
  height: '100%',
  display: 'block',
});

// Fallback visualization when audio context isn't available
const FallbackVisualizer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& .bar': {
    width: '4px',
    marginRight: '3px',
    backgroundColor: '#FF8C00',
    borderRadius: '2px',
    transition: 'height 0.2s ease',
  }
}));

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  audioRef, 
  isPlaying,
  colorScheme = 'default',
  howlerInstance
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [fallbackBars, setFallbackBars] = useState<number[]>(Array(30).fill(0));

  // Initialize audio analyzer
  useEffect(() => {
    try {
      // Check if Web Audio API is supported
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.warn('Web Audio API not supported, using fallback visualizer');
        setFallbackMode(true);
        return;
      }

      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      // Create analyzer node
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
      }

      // Connect audio element to analyzer if available
      if (audioRef.current && !sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        
        // Disconnect and clean up
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }
        if (analyserRef.current) {
          analyserRef.current.disconnect();
        }
      };
    } catch (error) {
      console.error('Error initializing audio analyzer:', error);
      setFallbackMode(true);
    }
  }, [audioRef.current]);

  // Draw visualization
  useEffect(() => {
    if (fallbackMode) {
      // Use fallback visualization
      if (isPlaying) {
        const interval = setInterval(() => {
          // Generate random bar heights for a simple visualization
          setFallbackBars(fallbackBars.map(() => Math.random() * 70 + 5));
        }, 100);
        return () => clearInterval(interval);
      }
      return;
    }

    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match display size
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };
    resize();

    // Animation function
    const animate = () => {
      if (!analyserRef.current || !dataArrayRef.current || !ctx) return;
      
      animationRef.current = requestAnimationFrame(animate);
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / dataArrayRef.current.length) * 2.5;
      let x = 0;
      
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const barHeight = (dataArrayRef.current[i] / 255) * canvas.height;
        
        // Different color schemes
        let gradient;
        switch (colorScheme) {
          case 'rainbow':
            const hue = i / dataArrayRef.current.length * 360;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            break;
          case 'fire':
            gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#ff4500');
            gradient.addColorStop(0.5, '#ff8c00');
            gradient.addColorStop(1, '#ffff00');
            ctx.fillStyle = gradient;
            break;
          case 'ocean':
            gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#000080');
            gradient.addColorStop(0.5, '#0000ff');
            gradient.addColorStop(1, '#00ffff');
            ctx.fillStyle = gradient;
            break;
          default:
            gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#FF8C00');
            gradient.addColorStop(1, '#FF6347');
            ctx.fillStyle = gradient;
        }
        
        // Draw bar
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.fillStyle.toString();
        
        x += barWidth + 1;
      }
    };

    // Start or stop animation based on isPlaying
    if (isPlaying) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      
      // Clear canvas when not playing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Handle window resize
    window.addEventListener('resize', resize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, [isPlaying, colorScheme, fallbackMode]);

  return (
    <VisualizerContainer>
      {fallbackMode ? (
        <FallbackVisualizer>
          {fallbackBars.map((height, index) => (
            <Box 
              key={index} 
              className="bar" 
              sx={{ 
                height: isPlaying ? `${height}px` : '3px',
                opacity: isPlaying ? 1 : 0.5,
                background: colorScheme === 'rainbow' 
                  ? `hsl(${index * 12}, 100%, 50%)` 
                  : colorScheme === 'fire' 
                    ? 'linear-gradient(to top, #ff4500, #ffff00)'
                    : colorScheme === 'ocean'
                      ? 'linear-gradient(to top, #000080, #00ffff)'
                      : 'linear-gradient(to top, #FF8C00, #FF6347)',
                boxShadow: isPlaying ? '0 0 8px rgba(255, 140, 0, 0.7)' : 'none'
              }} 
            />
          ))}
        </FallbackVisualizer>
      ) : (
        <VisualizerCanvas ref={canvasRef} />
      )}
    </VisualizerContainer>
  );
};

export default AudioVisualizer; 