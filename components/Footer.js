'use client';

import { Box, Container, Typography, TextField, Button, IconButton } from '@mui/material';
import { DirectionsCar, Facebook, Twitter, Instagram } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'black', color: 'white', pt: 10, pb: 5 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, pb: 8, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <DirectionsCar sx={{ color: 'secondary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 900, fontStyle: 'italic', letterSpacing: -1 }}>
                KEVINCAB
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 4, lineHeight: 1.7 }}>
              The most trusted cab network across Kenya. Providing seamless mobility solutions since 2018.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
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
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(16.667% - 30px)' } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Our Hubs
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['Nairobi (HQ)', 'Mombasa Port', 'Kisumu City', 'Eldoret Town'].map((hub) => (
                <Typography key={hub} variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {hub}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(16.667% - 30px)' } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['Help Center', 'Driver Registration', 'Terms of Service', 'Privacy Policy'].map((link) => (
                <Typography key={link} variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2 }}>
              Subscribe for travel discounts.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Email"
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'secondary.main' },
                  },
                }}
              />
              <Button variant="contained" color="secondary" sx={{ fontWeight: 'bold' }}>
                OK
              </Button>
            </Box>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mt: 5,
            color: 'rgba(255,255,255,0.4)',
            fontStyle: 'italic',
          }}
        >
          &copy; {new Date().getFullYear()} Kevincab Kenya. Designed for the open road.
        </Typography>
      </Container>
    </Box>
  );
}
