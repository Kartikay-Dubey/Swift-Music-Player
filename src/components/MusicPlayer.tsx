import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, ButtonBase, Slider, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, Menu, Popover } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Howl, Howler } from 'howler';
import { motion, AnimatePresence } from 'framer-motion';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import Playlist from './Playlist';
import { 
  FolderOpen, Refresh, Favorite, Share, Shuffle, RepeatOne, Add, QueueMusic, 
  MoreVert, Settings as SettingsIcon, Info, Equalizer as EqualizerIcon, CloudDownload, NightsStay, Speed, Pause, PlayArrow, SkipPrevious, SkipNext, VolumeOff, VolumeDown, VolumeUp,
  Keyboard, Help, WbSunny, Fireplace, WaterDrop, Opacity, Menu as MenuIcon
} from '@mui/icons-material';
import { useTheme as useAppTheme } from '../context/ThemeContext';
import ThemeBackground from './backgrounds/ThemeBackground';
import Equalizer from './Equalizer';
import About from './About';
import Settings, { AppSettings } from './Settings';
import PlaybackSpeed from './PlaybackSpeed';
import ThemesDialog from './ThemesDialog';
import KeyboardShortcutsDialog from './KeyboardShortcutsDialog';

// Safely check if we're in Electron environment
const isElectron = () => {
  try {
    return window && window.process && window.process.type;
  } catch {
    return false;
  }
};

// Check if we're on mobile web
const isMobileWeb = () => {
  return !isElectron() && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const ParticlesContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: 0,
  '& .particle': {
    position: 'absolute',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2))',
    borderRadius: '50%',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '50%',
      filter: 'blur(10px)',
      background: 'inherit',
    }
  }
});

const PlayerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  minHeight: '100vh',
  color: '#fff',
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'radial-gradient(circle at 50% 50%, rgba(40, 40, 40, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%)',
    animation: 'pulse 8s ease-in-out infinite',
    filter: 'blur(80px)',
  }
}));

const MotionCircularPlayer = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  width: '300px',
  height: '300px',
  borderRadius: '50%',
  overflow: 'hidden',
  margin: '20px 0',
  background: 'linear-gradient(145deg, #1a1a1a, #0a0a0a)',
  boxShadow: '20px 20px 60px #000000, -20px -20px 60px #1a1a1a',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-4px',
    background: 'conic-gradient(from 0deg, #FF8C00, #FF6347, #FF1493, #9400D3, #4B0082, #0000FF, #00FF00, #FFFF00, #FF8C00)',
    borderRadius: '50%',
    animation: 'spin 4s linear infinite, pulse 2s ease-in-out infinite alternate',
    zIndex: 0,
    opacity: 0.8,
  },
  '@keyframes pulse': {
    '0%': {
      filter: 'blur(5px) brightness(0.8)',
      transform: 'scale(1)',
    },
    '100%': {
      filter: 'blur(8px) brightness(1.2)',
      transform: 'scale(1.02)',
    },
  },
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}));

const PlayerContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  overflow: 'hidden',
  zIndex: 1,
  background: '#0a0a0a',
  padding: '3px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
    animation: 'pulse 4s ease-in-out infinite',
  },
}));

const GlowEffect = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '150%',
  height: '150%',
  background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
  zIndex: 2,
  animation: 'glow 3s ease-in-out infinite alternate',
  '@keyframes glow': {
    '0%': {
      opacity: 0.3,
      transform: 'translate(-50%, -50%) scale(0.8)',
    },
    '100%': {
      opacity: 0.5,
      transform: 'translate(-50%, -50%) scale(1.2)',
    },
  },
}));

const SongImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const CircularProgress = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '300px',
  marginTop: theme.spacing(2),
}));

const ControlSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  gap: theme.spacing(1),
}));

const PlaylistContainer = styled(motion.div)(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  marginTop: theme.spacing(4),
  backgroundColor: 'rgba(15, 15, 15, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.03)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
    transform: 'translateY(100%)',
    transition: 'transform 0.3s ease',
  },
  '&:hover::before': {
    transform: 'translateY(0)',
  },
}));

const PlaylistItemBox = styled(Box)<{ isActive: boolean }>(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
  marginBottom: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  transform: isActive ? 'scale(1.02)' : 'scale(1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
    transform: 'scale(1.02)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.5s ease',
  },
  '&:hover::after': {
    transform: 'translateX(100%)',
  },
}));

const AddMusicButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  backgroundColor: '#1a1a1a',
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  '&:hover': {
    backgroundColor: '#333333',
  },
  animation: 'floatButton 3s ease-in-out infinite',
  '@keyframes floatButton': {
    '0%': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    },
    '50%': {
      transform: 'translateY(-10px)',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
    },
    '100%': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    },
  },
}));

const TopBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
  zIndex: 10,
}));

const Sidebar = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    background: 'rgba(10, 10, 10, 0.5)',
    backdropFilter: 'blur(25px) saturate(200%)',
    WebkitBackdropFilter: 'blur(25px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    color: '#fff',
    padding: theme.spacing(2),
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
      pointerEvents: 'none',
    }
  }
}));

const SidebarItem = styled(ButtonBase)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  display: 'flex',
  justifyContent: 'flex-start',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  width: '100%',
  maxWidth: '450px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: theme.spacing(8),
  },
  '& > *': {
    opacity: 0,
    animation: 'fadeInUp 0.5s ease forwards',
  },
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const Version = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '0.75rem',
}));

const PlaylistHeader = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(0, 2),
}));

const PlaylistScroll = styled(Box)(({ theme }) => ({
  width: '100%',
  maxHeight: '300px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '3px',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  },
}));

interface Song {
  title: string;
  artist: string;
  url: string;
  coverUrl?: string; // Optional cover art URL
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

const getRandomImage = () => {
  // Use a more reliable image service with specific IDs to ensure images load
  const imageIds = [
    'pYyOZ0q0P0k', 'eOpewngf68w', 'BdVQU-lHGKg', 'N16iTD3xRrg', 'gUK3lA3K7Yo', 
    'JmVaNyemtN8', 'UBhpOIHnIYo', 'nGrfKmtwv24', 'g1Kr4Ozfoac', 'C7B-ExXpOIE',
    'uPGOEbjrVeE', 'tZCrK66bl8U', 'nss2eRzQwgw', 'koy6FlCCy5s', 'Yh2Y_St0fwY'
  ];
  
  // Get a random image ID from our curated list
  const selectedImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
  
  // Use a timestamp to prevent caching
  const timestamp = new Date().getTime();
  
  // Return a direct Unsplash image URL with the random ID
  return `https://images.unsplash.com/photo-${selectedImageId}?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8bXVzaWMsYWJzdHJhY3R8fHx8fHwxNjk4NzY0ODcz&ixlib=rb-4.0.3&q=80&w=500&t=${timestamp}`;
};

// Add new interfaces for Queue and Playlists
interface Playlist {
  name: string;
  songs: Song[];
}

const MusicPlayer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const soundRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [randomImage, setRandomImage] = useState<string>('');
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  
  // Add state for the new dialogs
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlaybackSpeedOpen, setIsPlaybackSpeedOpen] = useState(false);
  const [isThemesDialogOpen, setIsThemesDialogOpen] = useState(false);
  const [equalizerBands, setEqualizerBands] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [appSettings, setAppSettings] = useState({
    defaultVolume: 0.8,
    playbackSpeed: 1.0,
    darkMode: true,
    cacheSize: 500,
    language: 'en',
    notifications: true,
    autoDownloadArtwork: true,
    crossfadeDuration: 0,
    audioQuality: 'high',
  });
  
  // Import from our custom theme context
  const { currentTheme, setTheme } = useAppTheme();

  // Add state for the menu and new dialogs
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isPlaylistsOpen, setIsPlaylistsOpen] = useState(false);
  const [isTrackDetailsOpen, setIsTrackDetailsOpen] = useState(false);
  const [setAsAnchorEl, setSetAsAnchorEl] = useState<null | HTMLElement>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { name: 'Recently Played', songs: [] },
    { name: 'Favorites', songs: [] },
    { name: 'Most Played', songs: [] }
  ]);
  const [queue, setQueue] = useState<Song[]>([]);
  
  const scanForMusic = async () => {
    if (isElectron()) {
      try {
        const electron = window.require('electron');
        const songs = await electron.ipcRenderer.invoke('scan-for-mp3');
        setPlaylist(prevPlaylist => {
          const newSongs = songs.filter(newSong => 
            !prevPlaylist.some(existingSong => existingSong.url === newSong.url)
          );
          return [...prevPlaylist, ...newSongs];
        });
      } catch (error) {
        console.error('Error scanning for music:', error);
        // Fallback to web version if electron fails
        fileInputRef.current?.click();
      }
    } else {
      // Web version - trigger file input click
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newSongs: Song[] = await Promise.all(
      Array.from(files).map(async (file) => {
        // Create a blob URL for the file
        const blobUrl = URL.createObjectURL(file);
        
        return {
          title: file.name.replace(/\.(mp3|wav|ogg|m4a)$/i, ''),
          artist: 'Unknown Artist',
          url: blobUrl
        };
      })
    );

    setPlaylist(prevPlaylist => [...prevPlaylist, ...newSongs]);
    
    // If no song is currently selected, select the first new song
    if (!currentSong && newSongs.length > 0) {
      const firstSong = newSongs[0];
      setCurrentSong(firstSong);
      initializeAudio(firstSong);
    }
  };

  const selectMusicFolder = async () => {
    if (isElectron()) {
      try {
        const electron = window.require('electron');
        const songs = await electron.ipcRenderer.invoke('select-music-folder');
        setPlaylist(prevPlaylist => {
          const newSongs = songs.filter(newSong => 
            !prevPlaylist.some(existingSong => existingSong.url === newSong.url)
          );
          return [...prevPlaylist, ...newSongs];
        });
      } catch (error) {
        console.error('Error selecting music folder:', error);
        // Fallback to web version if electron fails
        fileInputRef.current?.click();
      }
    } else {
      // Web version - trigger file input click
      fileInputRef.current?.click();
    }
  };

  const initializeAudio = (song: Song) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    try {
      const sound = new Howl({
        src: [song.url],
        html5: true, // Force HTML5 Audio
        volume: volume,
        format: ['mp3', 'wav', 'ogg', 'm4a'],
        loop: isRepeat,
        preload: true, // Ensure audio is preloaded
        pool: 1, // Reduce the number of simultaneous connections
        onload: () => {
          console.log('Audio loaded successfully');
          setDuration(sound.duration());
          // Auto-play when loaded
          sound.play();
          setIsPlaying(true);
        },
        onloaderror: (id, error) => {
          console.error('Error loading audio:', error);
          alert('Error loading audio. Please try again.');
        },
        onplayerror: (id, error) => {
          console.error('Error playing audio:', error);
          // Try to recover from play error
          sound.once('unlock', () => {
            sound.play();
          });
        },
        onend: () => {
          if (!isRepeat) {
            setIsPlaying(false);
            setProgress(0);
            playNextSong();
          }
        },
        onplay: () => {
          setIsPlaying(true);
          startProgressUpdate();
        },
        onpause: () => {
          setIsPlaying(false);
          stopProgressUpdate();
        },
        onstop: () => {
          setIsPlaying(false);
          stopProgressUpdate();
          setProgress(0);
        },
        onseek: () => {
          // Sync with audio element
          if (soundRef.current) {
            soundRef.current.seek(soundRef.current.seek() as number);
          }
        }
      });

      soundRef.current = sound;
    } catch (error) {
      console.error('Error initializing audio:', error);
      alert('Error initializing audio. Please try again.');
    }
  };

  const startProgressUpdate = () => {
    if (progressIntervalRef.current) return;
    
    progressIntervalRef.current = window.setInterval(() => {
      if (soundRef.current) {
        setProgress(soundRef.current.seek());
      }
    }, 1000);
  };

  const stopProgressUpdate = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handlePlayPause = () => {
    if (!currentSong) return;
    
    if (!soundRef.current) {
      initializeAudio(currentSong);
      // Wait for the next tick to ensure sound is initialized
      setTimeout(() => {
        if (soundRef.current) {
          soundRef.current.play();
        }
      }, 0);
      return;
    }

    if (isPlaying) {
      soundRef.current?.pause();
    } else {
      soundRef.current?.play();
    }
  };

  const handleSeek = (value: number) => {
    if (soundRef.current) {
      soundRef.current.seek(value);
      setProgress(value);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (soundRef.current) {
      soundRef.current.volume(value);
    }
  };

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    setProgress(0);
    initializeAudio(song);
    soundRef.current?.play();
  };

  const getCurrentSongIndex = () => {
    if (!currentSong) return -1;
    return playlist.findIndex(song => song.url === currentSong.url);
  };

  const playNextSong = () => {
    if (!currentSong || playlist.length === 0) return;

    const currentIndex = playlist.findIndex(song => song.title === currentSong.title);
    let nextIndex;

    if (isShuffle) {
      // Get random index excluding current song
      const availableIndices = Array.from(Array(playlist.length).keys()).filter(i => i !== currentIndex);
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }

    const nextSong = playlist[nextIndex];
    setCurrentSong(nextSong);
    initializeAudio(nextSong);
  };

  const playPreviousSong = () => {
    if (!currentSong || playlist.length === 0) return;

    const currentIndex = playlist.findIndex(song => song.title === currentSong.title);
    let prevIndex;

    if (isShuffle) {
      // Get random index excluding current song
      const availableIndices = Array.from(Array(playlist.length).keys()).filter(i => i !== currentIndex);
      prevIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    }

    const prevSong = playlist[prevIndex];
    setCurrentSong(prevSong);
    initializeAudio(prevSong);
  };

  // Add cleanup for blob URLs
  useEffect(() => {
    return () => {
      // Cleanup blob URLs when component unmounts
      playlist.forEach(song => {
        if (song.url.startsWith('blob:')) {
          URL.revokeObjectURL(song.url);
        }
      });
    };
  }, [playlist]);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      stopProgressUpdate();
    };
  }, []);

  // Add mobile-specific audio initialization
  useEffect(() => {
    // Initialize audio context on first user interaction for mobile
    const initializeAudioContext = () => {
      // Create and start a silent audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.001);
      }
      
      // Remove the event listeners once initialized
      document.removeEventListener('touchstart', initializeAudioContext);
      document.removeEventListener('click', initializeAudioContext);
    };

    // Add event listeners for user interaction
    document.addEventListener('touchstart', initializeAudioContext);
    document.addEventListener('click', initializeAudioContext);

    return () => {
      // Cleanup event listeners
      document.removeEventListener('touchstart', initializeAudioContext);
      document.removeEventListener('click', initializeAudioContext);
    };
  }, []);

  // Update current sound when repeat state changes
  useEffect(() => {
    if (soundRef.current && currentSong) {
      soundRef.current.loop(isRepeat);
    }
  }, [isRepeat]);

  // Update the effect to ensure image loads on component mount
  useEffect(() => {
    // Set a new random image when component mounts
    const newImage = getRandomImage();
    setRandomImage(newImage);
    
    // Preload the image to ensure it's ready when needed
    const img = new Image();
    img.src = newImage;
    
    // Optional: Add a fallback in case the image fails to load
    img.onerror = () => {
      // If loading fails, use a reliable fallback image
      setRandomImage('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop');
    };
  }, []);
  
  // Update the defaultImage variable with a fallback
  const defaultImage = randomImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop';

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (soundRef.current) {
      soundRef.current.rate(speed);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add dark mode implementation here
  };

  // Add a new shimmer effect for the player
  const ShimmerEffect = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(41, 98, 255, 0.2), transparent)',
    transform: 'skewX(-20deg)',
    animation: 'shimmer 3s infinite',
    zIndex: 3,
    '@keyframes shimmer': {
      '0%': {
        transform: 'translateX(-100%) skewX(-20deg)',
      },
      '100%': {
        transform: 'translateX(200%) skewX(-20deg)',
      },
    },
  }));

  // Add linear progress bar
  const LinearProgress = styled(Box)<{ progress: number }>(({ theme, progress }) => ({
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '4px',
    overflow: 'hidden',
    margin: '10px 0',
    position: 'relative',
    zIndex: 20,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: `${progress}%`,
      background: 'linear-gradient(90deg, #FF8C00, #FF6347)',
      borderRadius: '4px',
      transition: 'width 0.1s linear',
      boxShadow: '0 0 15px rgba(255, 165, 0, 0.6)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: `${progress}%`,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
      animation: 'shimmerProgress 1.5s infinite',
      transform: 'translateX(-100%)',
    },
    '@keyframes shimmerProgress': {
      '100%': {
        transform: 'translateX(100%)',
      },
    },
  }));

  // Update the Particles component
  const Particles: React.FC = () => {
    const [particles, setParticles] = useState<Array<{ 
      id: number; 
      size: number; 
      left: number;
      top: number;
      delay: number;
      duration: number;
      direction: string;
    }>>([]);

    useEffect(() => {
      // Create particles distributed across the screen
      const particlesArray = Array.from({ length: 70 }, (_, i) => {
        const direction = Math.random() > 0.5 ? 'left' : 'right';
        return {
          id: i,
          size: Math.random() * 15 + 5, // Larger particles
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 10,
          duration: Math.random() * 10 + 15,
          direction
        };
      });
      setParticles(particlesArray);
    }, []);

    return (
      <ParticlesContainer>
        {particles.map((particle) => (
          <Box
            key={particle.id}
            className="particle"
            sx={{
              width: particle.size,
              height: particle.size,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `moveParticle${particle.direction === 'left' ? 'Left' : 'Right'} ${particle.duration}s infinite ease-in-out`,
              animationDelay: `${particle.delay}s`,
              '@keyframes moveParticleLeft': {
                '0%': {
                  transform: 'translateX(20vw) translateY(0)',
                  opacity: 0,
                },
                '50%': {
                  transform: 'translateX(0vw) translateY(-20px)',
                  opacity: 0.8,
                },
                '100%': {
                  transform: 'translateX(-20vw) translateY(0)',
                  opacity: 0,
                }
              },
              '@keyframes moveParticleRight': {
                '0%': {
                  transform: 'translateX(-20vw) translateY(0)',
                  opacity: 0,
                },
                '50%': {
                  transform: 'translateX(0vw) translateY(-20px)',
                  opacity: 0.8,
                },
                '100%': {
                  transform: 'translateX(20vw) translateY(0)',
                  opacity: 0,
                }
              }
            }}
          />
        ))}
      </ParticlesContainer>
    );
  };

  // Add keyboard shortcut handler
  const handleKeyDown = (event: KeyboardEvent) => {
    // Only handle shortcuts if not in an input field
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        handlePlayPause();
        break;
      case 'ArrowRight':
        event.preventDefault();
        playNextSong();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        playPreviousSong();
        break;
      case 'ArrowUp':
        event.preventDefault();
        handleVolumeChange(Math.min(volume + 0.1, 1));
        break;
      case 'ArrowDown':
        event.preventDefault();
        handleVolumeChange(Math.max(volume - 0.1, 0));
        break;
      case 'KeyM':
        event.preventDefault();
        handleVolumeChange(volume === 0 ? 0.5 : 0);
        break;
      case 'KeyR':
        event.preventDefault();
        setIsRepeat(!isRepeat);
        break;
      case 'KeyS':
        event.preventDefault();
        setIsShuffle(!isShuffle);
        break;
      case 'KeyF':
        event.preventDefault();
        setIsFavorite(!isFavorite);
        break;
      case 'KeyH':
        event.preventDefault();
        setHelpDialogOpen(!helpDialogOpen);
        break;
      default:
        break;
    }
  };

  // Add handlers for the new dialogs
  const handleEqualizerOpen = () => {
    setIsEqualizerOpen(true);
  };

  const handleEqualizerClose = () => {
    setIsEqualizerOpen(false);
  };

  const handleEqualizerApply = (bands: number[]) => {
    setEqualizerBands(bands);
    // In a real implementation, you would apply the equalizer settings to the audio
    console.log('Applying equalizer bands:', bands);
  };

  const handleAboutOpen = () => {
    setIsAboutOpen(true);
  };

  const handleAboutClose = () => {
    setIsAboutOpen(false);
  };

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  const handleSettingsSave = (settings: AppSettings) => {
    setAppSettings(settings);
    // Apply the settings
    setVolume(settings.defaultVolume);
    setPlaybackSpeed(settings.playbackSpeed);
    setIsDarkMode(settings.darkMode);
    
    // Apply playback speed to the current sound if it exists
    if (soundRef.current) {
      soundRef.current.rate(settings.playbackSpeed);
    }
    
    console.log('Settings applied:', settings);
  };

  const handlePlaybackSpeedOpen = () => {
    setIsPlaybackSpeedOpen(true);
  };

  const handlePlaybackSpeedClose = () => {
    setIsPlaybackSpeedOpen(false);
  };

  const handleThemesDialogOpen = () => {
    setIsThemesDialogOpen(true);
  };

  const handleThemesDialogClose = () => {
    setIsThemesDialogOpen(false);
  };

  // Add keyboard shortcut listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    handlePlayPause, 
    playNextSong, 
    playPreviousSong, 
    handleVolumeChange, 
    volume, 
    isRepeat, 
    isShuffle, 
    isFavorite,
    helpDialogOpen
  ]);

  useEffect(() => {
    if (soundRef.current && isPlaying) {
      // Start progress tracking
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      progressIntervalRef.current = window.setInterval(() => {
        if (soundRef.current) {
          const seek = soundRef.current.seek() || 0;
          setProgress(seek);
        }
      }, 1000 / 60) as unknown as number;
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Add handlers for the menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Add handlers for Queue and Playlists
  const handleQueueOpen = () => {
    setIsQueueOpen(true);
    handleMenuClose();
  };

  const handleQueueClose = () => {
    setIsQueueOpen(false);
  };

  const handlePlaylistsOpen = () => {
    setIsPlaylistsOpen(true);
    handleMenuClose();
  };

  const handlePlaylistsClose = () => {
    setIsPlaylistsOpen(false);
  };
  
  // Update queue when playlist changes
  useEffect(() => {
    if (playlist.length > 0 && currentSong) {
      const currentIndex = playlist.findIndex(song => song.title === currentSong.title);
      if (currentIndex !== -1) {
        const nextSongs = playlist.slice(currentIndex + 1);
        setQueue(nextSongs);
      }
    }
  }, [currentSong, playlist]);
  
  // Add song to recently played
  useEffect(() => {
    if (currentSong) {
      const recentlyPlayed = playlists.find(p => p.name === 'Recently Played');
      if (recentlyPlayed) {
        // Check if song already exists in recently played
        const songExists = recentlyPlayed.songs.some(song => song.title === currentSong.title);
        if (!songExists) {
          const updatedPlaylists = playlists.map(playlist => {
            if (playlist.name === 'Recently Played') {
              // Add to beginning and limit to 10 songs
              const updatedSongs = [currentSong, ...playlist.songs].slice(0, 10);
              return { ...playlist, songs: updatedSongs };
            }
            return playlist;
          });
          setPlaylists(updatedPlaylists);
        }
      }
    }
  }, [currentSong]);
  
  // Add to favorites
  const addToFavorites = (song: Song) => {
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.name === 'Favorites') {
        // Check if song already exists
        const songExists = playlist.songs.some(s => s.title === song.title);
        if (!songExists) {
          return { ...playlist, songs: [...playlist.songs, song] };
        }
      }
      return playlist;
    });
    setPlaylists(updatedPlaylists);
  };
  
  // Remove from favorites
  const removeFromFavorites = (song: Song) => {
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.name === 'Favorites') {
        return { 
          ...playlist, 
          songs: playlist.songs.filter(s => s.title !== song.title) 
        };
      }
      return playlist;
    });
    setPlaylists(updatedPlaylists);
  };
  
  // Toggle favorite status
  const toggleFavorite = () => {
    if (currentSong) {
      const favorites = playlists.find(p => p.name === 'Favorites');
      if (favorites) {
        const isFav = favorites.songs.some(song => song.title === currentSong.title);
        if (isFav) {
          removeFromFavorites(currentSong);
        } else {
          addToFavorites(currentSong);
        }
        setIsFavorite(!isFavorite);
      }
    }
  };

  // Add handlers for new menu options
  const handleShareClick = () => {
    // Implement share functionality
    if (navigator.share && currentSong) {
      navigator.share({
        title: currentSong.title,
        text: `Check out ${currentSong.title} by ${currentSong.artist}`,
        url: window.location.href,
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      alert('Share functionality not supported in this browser');
    }
    handleMenuClose();
  };

  const handleTrackDetailsOpen = () => {
    setIsTrackDetailsOpen(true);
    handleMenuClose();
  };

  const handleTrackDetailsClose = () => {
    setIsTrackDetailsOpen(false);
  };

  const handleAlbumClick = () => {
    // Implement album view functionality
    alert('Album view not implemented yet');
    handleMenuClose();
  };

  const handleArtistClick = () => {
    // Implement artist view functionality
    alert('Artist view not implemented yet');
    handleMenuClose();
  };

  const handleSetAsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSetAsAnchorEl(event.currentTarget);
    handleMenuClose();
  };

  const handleSetAsClose = () => {
    setSetAsAnchorEl(null);
  };

  const handleSetAsRingtone = () => {
    alert('Set as ringtone not implemented yet');
    handleSetAsClose();
  };

  const handleSetAsAlarm = () => {
    alert('Set as alarm not implemented yet');
    handleSetAsClose();
  };

  const handleDeleteSong = () => {
    if (currentSong) {
      // Remove the song from playlist
      const updatedPlaylist = playlist.filter(song => song.title !== currentSong.title);
      setPlaylist(updatedPlaylist);
      
      // If there are songs left, play the next one
      if (updatedPlaylist.length > 0) {
        const nextSong = updatedPlaylist[0];
        setCurrentSong(nextSong);
        initializeAudio(nextSong);
      } else {
        // No songs left
        setCurrentSong(null);
        if (soundRef.current) {
          soundRef.current.stop();
          soundRef.current.unload();
        }
        setIsPlaying(false);
      }
    }
    handleMenuClose();
  };

  return (
    <PlayerContainer>
      <ThemeBackground />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TopBar>
            <IconButton 
              onClick={() => setIsSidebarOpen(true)}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FF8C00, #FF6347)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Music Player
            </Typography>
            <IconButton 
              onClick={handleMenuOpen}
              sx={{ color: 'white' }}
            >
              <MoreVert />
            </IconButton>
            
            {/* Add the Menu */}
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: 'rgba(25, 25, 25, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  '& .MuiMenuItem-root': {
                    fontSize: '0.9rem',
                    padding: '10px 16px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }
                }
              }}
            >
              <MenuItem onClick={handleShareClick}>
                <ListItemIcon sx={{ color: '#FF8C00' }}>
                  <Share fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Share" />
              </MenuItem>
              <MenuItem onClick={handleTrackDetailsOpen}>
                <ListItemIcon sx={{ color: '#FF8C00' }}>
                  <Info fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Track details" />
              </MenuItem>
              <MenuItem onClick={handleAlbumClick}>
                <ListItemIcon sx={{ color: '#FF8C00' }}>
                  <QueueMusic fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Album" />
              </MenuItem>
              <MenuItem onClick={handleArtistClick}>
                <ListItemIcon sx={{ color: '#FF8C00' }}>
                  <Favorite fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Artist" />
              </MenuItem>
              <MenuItem onClick={handleSetAsOpen}>
                <ListItemIcon sx={{ color: '#FF8C00' }}>
                  <Add fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Set as" />
              </MenuItem>
              <MenuItem onClick={handleDeleteSong}>
                <ListItemIcon sx={{ color: '#FF8C00' }}>
                  <Refresh fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </MenuItem>
              <MenuItem onClick={handleSettingsOpen}>
                <ListItemIcon sx={{ color: '#FF8C00' }}>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>
              <Divider sx={{ my: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              <MenuItem onClick={handleQueueOpen}>
                <ListItemIcon sx={{ color: '#FF8C00' }}>
                  <QueueMusic fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Queue" />
              </MenuItem>
              <MenuItem onClick={handlePlaylistsOpen}>
                <ListItemIcon sx={{ color: '#FF8C00' }}>
                  <Favorite fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Playlists" />
              </MenuItem>
            </Menu>
            
            {/* Set As Menu */}
            <Menu
              anchorEl={setAsAnchorEl}
              open={Boolean(setAsAnchorEl)}
              onClose={handleSetAsClose}
              PaperProps={{
                sx: {
                  backgroundColor: 'rgba(25, 25, 25, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  '& .MuiMenuItem-root': {
                    fontSize: '0.9rem',
                    padding: '10px 16px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }
                }
              }}
            >
              <MenuItem onClick={handleSetAsRingtone}>
                <ListItemText primary="Ringtone" />
              </MenuItem>
              <MenuItem onClick={handleSetAsAlarm}>
                <ListItemText primary="Alarm" />
              </MenuItem>
            </Menu>
          </TopBar>

          <Sidebar
            anchor="left"
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            PaperProps={{
              sx: {
                width: 280,
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <List component="nav" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ px: 2, py: 1 }}>
                Music Player
              </Typography>
              <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <Box component="li">
                <SidebarItem onClick={handleEqualizerOpen}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <EqualizerIcon />
                  </ListItemIcon>
                  <ListItemText primary="Equalizer" />
                </SidebarItem>
              </Box>
              <Box component="li">
                <SidebarItem onClick={() => setIsDarkMode(!isDarkMode)}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <NightsStay />
                  </ListItemIcon>
                  <ListItemText primary="Dark Mode" />
                </SidebarItem>
              </Box>
              <Box component="li">
                <SidebarItem onClick={handlePlaybackSpeedOpen}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <Speed />
                  </ListItemIcon>
                  <ListItemText primary="Playback Speed" />
                </SidebarItem>
              </Box>
              <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'rgba(255,255,255,0.7)' }}>
                Themes
              </Typography>
              <Box component="li">
                <SidebarItem onClick={handleThemesDialogOpen}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <WbSunny />
                  </ListItemIcon>
                  <ListItemText primary="Choose Theme" />
                </SidebarItem>
              </Box>
              <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <Box component="li">
                <SidebarItem onClick={handleSettingsOpen}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </SidebarItem>
              </Box>
              <Box component="li">
                <SidebarItem onClick={handleAboutOpen}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <Info />
                  </ListItemIcon>
                  <ListItemText primary="About" />
                </SidebarItem>
              </Box>
            </List>
          </Sidebar>

          <MainContent>
            <MotionCircularPlayer
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <PlayerContent
                sx={{
                  animation: 'rotateContent 15s linear infinite',
                  '@keyframes rotateContent': {
                    '0%': {
                      transform: 'rotate(0deg)',
                    },
                    '100%': {
                      transform: 'rotate(360deg)',
                    },
                  },
                }}
              >
                <SongImage 
                  src={currentSong?.coverUrl || defaultImage} 
                  alt={currentSong?.title || 'Album Art'} 
                />
                <GlowEffect />
                <ShimmerEffect />
              </PlayerContent>
            </MotionCircularPlayer>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="h5" sx={{ 
                mt: 2, 
                fontWeight: 'bold', 
                textAlign: 'center',
                background: 'linear-gradient(45deg, #ffffff, #999999)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '0.5px',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
              }}>
                {currentSong?.title || 'No song selected'}
              </Typography>
            </motion.div>

            <Typography variant="subtitle1" sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              textAlign: 'center', 
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              {currentSong?.artist || 'Unknown Artist'}
            </Typography>

            <ControlSection>
              <ActionButtons>
                <IconButton 
                  onClick={() => setIsShuffle(!isShuffle)}
                  sx={{ 
                    color: isShuffle ? '#FF8C00' : 'white',
                    '&:hover': {
                      color: '#FF8C00',
                    }
                  }}
                >
                  <Shuffle />
                </IconButton>
                <IconButton 
                  onClick={playPreviousSong}
                  sx={{ color: 'white' }}
                >
                  <SkipPrevious />
                </IconButton>
                
                <IconButton 
                  sx={{ 
                    color: 'white',
                    backgroundColor: 'rgba(255, 140, 0, 0.8)',
                    width: 60,
                    height: 60,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 140, 0, 1)',
                    },
                    boxShadow: '0 0 20px rgba(255, 140, 0, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                
                <IconButton 
                  onClick={playNextSong}
                  sx={{ color: 'white' }}
                >
                  <SkipNext />
                </IconButton>
                <IconButton 
                  onClick={() => setIsRepeat(!isRepeat)}
                  sx={{ 
                    color: isRepeat ? '#FF8C00' : 'white',
                    '&:hover': {
                      color: '#FF8C00',
                    }
                  }}
                >
                  <RepeatOne />
                </IconButton>
              </ActionButtons>
              
              <Box sx={{ width: '100%', padding: '0 10px' }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {formatTime(progress)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {formatTime(duration)}
                  </Typography>
                </Box>
                <Slider
                  value={progress}
                  min={0}
                  max={duration || 100}
                  onChange={(_, value) => handleSeek(value as number)}
                  sx={{
                    color: '#FF8C00',
                    height: 6,
                    '& .MuiSlider-rail': {
                      opacity: 0.3,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                    },
                    '& .MuiSlider-track': {
                      border: 'none',
                      background: 'linear-gradient(90deg, #FF8C00, #FF6347)',
                      borderRadius: '4px',
                      transition: 'width 0.1s linear',
                      boxShadow: '0 0 15px rgba(255, 165, 0, 0.6)',
                    },
                    '& .MuiSlider-thumb': {
                      width: 12,
                      height: 12,
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)',
                      },
                      '&.Mui-active': {
                        width: 14,
                        height: 14,
                      },
                    },
                  }}
                />
              </Box>

              {/* Add Volume Control */}
              <Box sx={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                mt: 2, 
                padding: '0 10px',
                gap: 2
              }}>
                <IconButton 
                  onClick={() => handleVolumeChange(volume === 0 ? 0.5 : 0)}
                  sx={{ color: 'white', padding: 0 }}
                >
                  {volume === 0 ? (
                    <VolumeOff fontSize="small" />
                  ) : volume < 0.5 ? (
                    <VolumeDown fontSize="small" />
                  ) : (
                    <VolumeUp fontSize="small" />
                  )}
                </IconButton>
                <Slider
                  value={volume}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(_, value) => handleVolumeChange(value as number)}
                  sx={{
                    color: '#FF8C00',
                    height: 4,
                    '& .MuiSlider-rail': {
                      opacity: 0.3,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    '& .MuiSlider-track': {
                      border: 'none',
                      background: 'linear-gradient(90deg, #FF8C00, #FF6347)',
                    },
                    '& .MuiSlider-thumb': {
                      width: 8,
                      height: 8,
                      backgroundColor: '#fff',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)',
                      },
                    },
                  }}
                />
              </Box>
            </ControlSection>

            <PlaylistContainer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <PlaylistHeader>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Playlist
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {playlist.length} songs
                </Typography>
              </PlaylistHeader>
              
              <PlaylistScroll>
                {playlist.map((song, index) => (
                  <PlaylistItemBox
                    key={index}
                    isActive={currentSong?.title === song.title}
                    onClick={() => {
                      setCurrentSong(song);
                      initializeAudio(song);
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', minWidth: '24px' }}>
                          {index + 1}
                        </Typography>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: currentSong?.title === song.title ? 'bold' : 'normal' }}>
                            {song.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {song.artist}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {formatTime(duration)}
                      </Typography>
                    </Box>
                  </PlaylistItemBox>
                ))}
              </PlaylistScroll>
            </PlaylistContainer>
          </MainContent>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <AddMusicButton 
              onClick={scanForMusic} 
              color="primary"
              sx={{
                position: 'fixed',
                bottom: theme.spacing(4),
                right: theme.spacing(4),
                backgroundColor: '#1a1a1a',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                '&:hover': {
                  backgroundColor: '#333333',
                },
                animation: 'floatButton 3s ease-in-out infinite',
              }}
            >
              <Add />
            </AddMusicButton>
          </motion.div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            multiple
            accept="audio/*"
          />
        </motion.div>
      </AnimatePresence>

      {/* Help Dialog */}
      <KeyboardShortcutsDialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
      />

      {/* Add the new dialogs */}
      <Equalizer 
        open={isEqualizerOpen} 
        onClose={handleEqualizerClose} 
        onApply={handleEqualizerApply} 
      />
      
      <About 
        open={isAboutOpen} 
        onClose={handleAboutClose} 
      />
      
      <Settings 
        open={isSettingsOpen} 
        onClose={handleSettingsClose} 
        onSave={handleSettingsSave}
        initialSettings={appSettings}
      />
      
      <PlaybackSpeed 
        open={isPlaybackSpeedOpen} 
        onClose={handlePlaybackSpeedClose} 
        currentSpeed={playbackSpeed}
        onSpeedChange={setPlaybackSpeed}
      />
      
      <ThemesDialog 
        open={isThemesDialogOpen} 
        onClose={handleThemesDialogClose} 
        currentTheme={currentTheme}
        onThemeChange={setTheme}
      />

      {/* Add Queue Dialog */}
      <Dialog
        open={isQueueOpen}
        onClose={handleQueueClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <QueueMusic fontSize="small" /> Up Next
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            {queue.length > 0 ? (
              queue.map((song, index) => (
                <ListItem 
                  key={index}
                  sx={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                  button
                  onClick={() => {
                    setCurrentSong(song);
                    initializeAudio(song);
                    handleQueueClose();
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', minWidth: '24px', mr: 2 }}>
                      {index + 1}
                    </Typography>
                    <Box>
                      <Typography variant="body1">
                        {song.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {song.artist}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  No songs in queue
                </Typography>
              </Box>
            )}
          </List>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
          <Button 
            onClick={handleQueueClose} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Playlists Dialog */}
      <Dialog
        open={isPlaylistsOpen}
        onClose={handlePlaylistsClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Favorite fontSize="small" /> Playlists
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 0 }}>
            {playlists.map((playlist, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {playlist.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {playlist.songs.length} songs
                  </Typography>
                </Box>
                <List sx={{ p: 0 }}>
                  {playlist.songs.length > 0 ? (
                    playlist.songs.slice(0, 5).map((song, songIndex) => (
                      <ListItem 
                        key={songIndex}
                        sx={{ 
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                          }
                        }}
                        button
                        onClick={() => {
                          setCurrentSong(song);
                          initializeAudio(song);
                          handlePlaylistsClose();
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', minWidth: '24px', mr: 2 }}>
                            {songIndex + 1}
                          </Typography>
                          <Box>
                            <Typography variant="body1">
                              {song.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {song.artist}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        No songs in this playlist
                      </Typography>
                    </Box>
                  )}
                  {playlist.songs.length > 5 && (
                    <Box sx={{ p: 1, textAlign: 'center' }}>
                      <Button 
                        size="small" 
                        sx={{ 
                          color: '#FF8C00',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 140, 0, 0.1)'
                          }
                        }}
                      >
                        View all {playlist.songs.length} songs
                      </Button>
                    </Box>
                  )}
                </List>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
          <Button 
            onClick={handlePlaylistsClose} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Track Details Dialog */}
      <Dialog
        open={isTrackDetailsOpen}
        onClose={handleTrackDetailsClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Info fontSize="small" /> Track Details
        </DialogTitle>
        <DialogContent>
          {currentSong ? (
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Box 
                  component="img" 
                  src={currentSong.coverUrl || getRandomImage()} 
                  alt={currentSong.title}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: 2,
                    objectFit: 'cover',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                  }}
                />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6">{currentSong.title}</Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                    {currentSong.artist}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Duration: {formatTime(duration)}
                  </Typography>
                </Box>
              </Box>
              
              <TableContainer component={Paper} sx={{ bgcolor: 'rgba(0,0,0,0.3)', mb: 2 }}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Title</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{currentSong.title}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Artist</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{currentSong.artist}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>File</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{currentSong.url.split('/').pop()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Duration</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{formatTime(duration)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                No song selected
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
          <Button 
            onClick={handleTrackDetailsClose} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </PlayerContainer>
  );
};

export default MusicPlayer; 