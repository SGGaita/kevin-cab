'use client';

import { Box, Container, Typography, IconButton } from '@mui/material';
import { DirectionsCar, Facebook, Twitter, Instagram } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'black', color: 'white', py: 8, pb: { xs: 12, md: 8 } }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
            <DirectionsCar sx={{ color: 'secondary.main', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 900, fontStyle: 'italic', letterSpacing: -1 }}>
              KEVINCAB TOUR AND TRAVEL
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, lineHeight: 1.8, maxWidth: 600, mx: 'auto' }}>
            Professional transfer services and national park tours across Kenya. Your trusted travel partner since 2018.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 5 }}>
            <IconButton
              href="#"
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'white',
                '&:hover': { bgcolor: 'secondary.main', color: 'black' },
              }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              href="#"
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'white',
                '&:hover': { bgcolor: 'secondary.main', color: 'black' },
              }}
            >
              <Twitter />
            </IconButton>
            <IconButton
              href="#"
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'white',
                '&:hover': { bgcolor: 'secondary.main', color: 'black' },
              }}
            >
              <Instagram />
            </IconButton>
          </Box>

          <Box sx={{ pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.4)',
                fontStyle: 'italic',
                mb: 1,
              }}
            >
              &copy; {new Date().getFullYear()} Kevincab Tour and Travel. Designed for the open road.
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.75rem',
              }}
            >
              Design by Ascension Dynamics
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
