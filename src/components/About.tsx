import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Link,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Info, 
  Code, 
  GitHub, 
  MusicNote, 
  Favorite, 
  Update,
  BugReport,
  LibraryMusic
} from '@mui/icons-material';

interface AboutProps {
  open: boolean;
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <Info fontSize="small" /> About Music Player
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <MusicNote sx={{ fontSize: 60, color: '#FF8C00', mb: 1 }} />
            <Typography variant="h5" gutterBottom>
              Music Player
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Version 1.0.0
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              A modern, feature-rich music player built with React
            </Typography>
          </Box>
          
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#FF8C00' }}>
              Features
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <LibraryMusic sx={{ color: '#FF8C00' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Dynamic Theme Backgrounds" 
                  secondary="Enjoy beautiful animated backgrounds that change with your theme" 
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Favorite sx={{ color: '#FF8C00' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Advanced Audio Controls" 
                  secondary="Equalizer, playback speed control, and high-quality audio processing" 
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MusicNote sx={{ color: '#FF8C00' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Keyboard Shortcuts" 
                  secondary="Control your music without touching the mouse" 
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            </List>
          </Box>
          
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#FF8C00' }}>
              Technologies
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Code sx={{ color: '#FF8C00' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="React & TypeScript" 
                  secondary="Built with modern web technologies" 
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Code sx={{ color: '#FF8C00' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Material UI" 
                  secondary="Beautiful and responsive user interface components" 
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Code sx={{ color: '#FF8C00' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Web Audio API" 
                  secondary="Advanced audio processing capabilities" 
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            </List>
          </Box>
          
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Created with <Favorite sx={{ fontSize: 14, color: '#FF8C00', verticalAlign: 'middle' }} /> by Music Player Team
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                startIcon={<GitHub />} 
                size="small"
                sx={{ 
                  color: '#FF8C00',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 140, 0, 0.1)'
                  }
                }}
              >
                GitHub
              </Button>
              <Button 
                startIcon={<BugReport />} 
                size="small"
                sx={{ 
                  color: '#FF8C00',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 140, 0, 0.1)'
                  }
                }}
              >
                Report Bug
              </Button>
              <Button 
                startIcon={<Update />} 
                size="small"
                sx={{ 
                  color: '#FF8C00',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 140, 0, 0.1)'
                  }
                }}
              >
                Check for Updates
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            bgcolor: '#FF8C00',
            '&:hover': {
              bgcolor: '#e67e00'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default About; 