'use client';

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Container } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, DirectionsCar } from '@mui/icons-material';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
  ];

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          boxShadow: isScrolled ? 2 : 0,
          transition: 'all 0.3s ease',
          py: isScrolled ? 0.5 : 1.5,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
              <Box 
                sx={{ 
                  bgcolor: 'secondary.main', 
                  p: 1, 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'rotate(12deg)' }
                }}
              >
                <DirectionsCar sx={{ color: 'black' }} />
              </Box>
              <Box sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'white' }}>
                KEVINCAB
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
              {navLinks.map((link) => (
                <Button 
                  key={link.name}
                  href={link.href}
                  sx={{ 
                    color: 'white', 
                    fontWeight: 600,
                    '&:hover': { color: 'secondary.main' }
                  }}
                >
                  {link.name}
                </Button>
              ))}
              <Button 
                href="#contact"
                variant="contained"
                color="secondary"
                sx={{ 
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px rgba(255, 193, 7, 0.2)',
                }}
              >
                Book Now
              </Button>
              <Button 
                component={Link}
                href="/login"
                variant="outlined"
                sx={{ 
                  color: 'white',
                  borderColor: 'white',
                  fontWeight: 600,
                  '&:hover': { 
                    borderColor: 'secondary.main',
                    color: 'secondary.main'
                  }
                }}
              >
                Driver Login
              </Button>
            </Box>

            <IconButton 
              sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
              onClick={() => setIsMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 280, height: '100%', bgcolor: 'black', color: 'white', p: 3 }}>
          <IconButton 
            onClick={() => setIsMenuOpen(false)}
            sx={{ color: 'white', mb: 4, float: 'right' }}
          >
            <CloseIcon />
          </IconButton>
          <List sx={{ mt: 8 }}>
            {navLinks.map((link) => (
              <ListItem key={link.name} disablePadding>
                <ListItemButton 
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  sx={{ 
                    py: 2,
                    '&:hover': { color: 'secondary.main' }
                  }}
                >
                  <ListItemText 
                    primary={link.name}
                    primaryTypographyProps={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem sx={{ mt: 3 }}>
              <Button 
                href="#contact"
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => setIsMenuOpen(false)}
                sx={{ py: 2, fontSize: '1.1rem' }}
              >
                Book a Ride
              </Button>
            </ListItem>
            <ListItem sx={{ mt: 2 }}>
              <Button 
                component={Link}
                href="/login"
                variant="outlined"
                fullWidth
                onClick={() => setIsMenuOpen(false)}
                sx={{ 
                  py: 2, 
                  fontSize: '1.1rem',
                  color: 'white',
                  borderColor: 'white',
                }}
              >
                Driver Login
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
