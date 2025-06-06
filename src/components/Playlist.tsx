import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  IconButton,
  Box,
  alpha,
} from '@mui/material';
import { PlayArrow, MusicNote, Favorite, FavoriteBorder } from '@mui/icons-material';

interface Song {
  title: string;
  artist: string;
  url: string;
}

interface PlaylistProps {
  songs: Song[];
  currentSong: Song | null;
  onSongSelect: (song: Song) => void;
}

const Playlist: React.FC<PlaylistProps> = ({
  songs,
  currentSong,
  onSongSelect,
}) => {
  // This would normally be managed by your app's state management
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  const toggleFavorite = (songUrl: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(songUrl)) {
        newFavorites.delete(songUrl);
      } else {
        newFavorites.add(songUrl);
      }
      return newFavorites;
    });
  };

  return (
    <List 
      sx={{ 
        height: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '3px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.3)',
          },
        },
      }}
    >
      {songs.map((song, index) => (
        <ListItem
          key={index}
          disablePadding
          sx={{
            mb: 0.5,
            px: 0.5,
          }}
          secondaryAction={
            <Box sx={{ 
              display: 'flex', 
              gap: 0.5,
              mr: -1,
            }}>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(song.url);
                }}
                sx={{
                  color: favorites.has(song.url) ? '#ff4081' : 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.3s ease',
                  padding: '4px',
                  '&:hover': {
                    color: '#ff4081',
                    transform: 'scale(1.1)',
                  },
                }}
                size="small"
              >
                {favorites.has(song.url) ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
              </IconButton>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  onSongSelect(song);
                }}
                sx={{
                  color: currentSong?.url === song.url ? '#1ed760' : 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.3s ease',
                  padding: '4px',
                  '&:hover': {
                    color: '#1ed760',
                    transform: 'scale(1.1)',
                  },
                }}
                size="small"
              >
                <PlayArrow fontSize="small" />
              </IconButton>
            </Box>
          }
        >
          <ListItemButton
            selected={currentSong?.url === song.url}
            onClick={() => onSongSelect(song)}
            sx={{
              borderRadius: '6px',
              transition: 'all 0.3s ease',
              pr: 6,
              py: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'rgba(30, 215, 96, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(30, 215, 96, 0.2)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            <MusicNote 
              sx={{ 
                mr: 1.5,
                fontSize: '1.2rem',
                color: currentSong?.url === song.url ? '#1ed760' : 'rgba(255, 255, 255, 0.7)',
                transition: 'color 0.3s ease',
              }} 
            />
            <ListItemText
              primary={song.title}
              secondary={song.artist}
              primaryTypographyProps={{
                sx: {
                  color: currentSong?.url === song.url ? '#1ed760' : '#fff',
                  fontWeight: currentSong?.url === song.url ? 600 : 400,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                },
              }}
              secondaryTypographyProps={{
                sx: {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.8rem',
                  transition: 'color 0.3s ease',
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default Playlist; 