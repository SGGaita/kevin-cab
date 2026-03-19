'use client';

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Container } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, DirectionsCar, Phone, Email } from '@mui/icons-material';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [siteName, setSiteName] = useState('KEVINCAB TOUR AND TRAVEL');
  const [phone, setPhone] = useState('+254 712 345 678');
  const [email, setEmail] = useState('info@kevincab.com');

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchSiteInfo();
  }, []);

  const fetchSiteInfo = async () => {
    try {
      const [settingsRes, contactRes] = await Promise.all([
        fetch('/api/cms/settings'),
        fetch('/api/cms/contact')
      ]);
      
      const settings = await settingsRes.json();
      const contact = await contactRes.json();
      
      if (settings.success && settings.data) {
        setSiteName(settings.data.site_name || 'KEVINCAB TOUR AND TRAVEL');
      }
      
      if (contact.success && contact.data) {
        setPhone(contact.data.phone || '+254 712 345 678');
        setEmail(contact.data.email || 'info@kevincab.com');
      }
    } catch (error) {
      console.error('Error fetching site info:', error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Testimonial', href: '#testimonial' },
  ];

  return (
    <>
      {/* Top Contact Bar - Desktop */}
      <Box
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1201,
          display: { xs: 'none', md: 'flex' }
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4, alignItems: 'center' }}>
            <Box
              component="a"
              href={`tel:${phone.replace(/\s/g, '')}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.3s',
                '&:hover': { color: 'secondary.main' }
              }}
            >
              <Phone sx={{ fontSize: '1rem' }} />
              <Box component="span">{phone}</Box>
            </Box>
            <Box
              component="a"
              href={`mailto:${email}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.3s',
                '&:hover': { color: 'secondary.main' }
              }}
            >
              <Email sx={{ fontSize: '1rem' }} />
              <Box component="span">{email}</Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Top Contact Bar - Mobile */}
      <Box
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1201,
          display: { xs: 'flex', md: 'none' }
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
              component="a"
              href={`tel:${phone.replace(/\s/g, '')}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.85rem',
                transition: 'color 0.3s',
                '&:hover': { color: 'secondary.main' }
              }}
            >
              <Phone sx={{ fontSize: '1rem' }} />
              <Box component="span">{phone}</Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <AppBar 
        position="fixed" 
        sx={{ 
          top: { xs: '32px', md: '32px' },
          backgroundColor: mounted && isScrolled ? 'rgba(0, 0, 0, 0.95)' : 'transparent',
          backdropFilter: mounted && isScrolled ? 'blur(10px)' : 'none',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          py: mounted && isScrolled ? 0.5 : 1.5,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', gap: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexShrink: 0 }}>
              <Box 
                sx={{ 
                  bgcolor: 'secondary.main', 
                  p: 1, 
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'rotate(12deg)' }
                }}
              >
                <DirectionsCar sx={{ color: 'black' }} />
              </Box>
              <Box sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'white', whiteSpace: 'nowrap' }}>
                {siteName}
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
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
                  borderRadius: 0,
                }}
              >
                Book Now
              </Button>
            </Box>

            <IconButton 
              sx={{ display: { xs: 'block', md: 'none' }, color: 'white' }}
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
                sx={{ py: 2, fontSize: '1.1rem', borderRadius: 0 }}
              >
                Book a Ride
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
