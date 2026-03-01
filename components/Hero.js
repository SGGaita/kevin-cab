'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Chip } from '@mui/material';
import { ChevronRight, DirectionsCar } from '@mui/icons-material';

export default function Hero() {
  const [heroData, setHeroData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/cms/hero');
      const data = await response.json();
      if (data.success && data.hero) {
        setHeroData({
          title: data.hero.title,
          subtitle: data.hero.subtitle,
          description: data.hero.description,
          ctaText: data.hero.ctaText,
          imageUrl: data.hero.imageUrl || 'https://images.unsplash.com/photo-1549194388-f61be84a6e9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        });
      } else {
        setHeroData({
          title: 'Reliable Travel Across Kenya',
          subtitle: 'Premier Taxi Service Kenya',
          description: 'From JKIA airport transfers to safe city rides in Nairobi, Mombasa, and Kisumu. Experience travel that puts you first.',
          ctaText: 'Book a Cab',
          imageUrl: 'https://images.unsplash.com/photo-1549194388-f61be84a6e9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        });
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      setHeroData({
        title: 'Reliable Travel Across Kenya',
        subtitle: 'Premier Taxi Service Kenya',
        description: 'From JKIA airport transfers to safe city rides in Nairobi, Mombasa, and Kisumu. Experience travel that puts you first.',
        ctaText: 'Book a Cab',
        imageUrl: 'https://images.unsplash.com/photo-1549194388-f61be84a6e9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      });
    }
  };

  if (!mounted || !heroData) {
    return null;
  }
  return (
    <Box
      id="home"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroData.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6), rgba(0,0,0,0.8))',
          },
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10, textAlign: 'center', px: 3 }}>
        <Chip 
          label={heroData.subtitle}
          sx={{ 
            mb: 3,
            bgcolor: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.2)',
            backdropFilter: 'blur(10px)',
            color: 'secondary.main',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        />
        
        <Typography 
          variant="h1" 
          sx={{ 
            color: 'white', 
            mb: 3,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          {heroData.title}
        </Typography>

        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255,255,255,0.8)', 
            mb: 5,
            maxWidth: 700,
            mx: 'auto',
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.25rem' },
          }}
        >
          {heroData.description}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
          <Button 
            href="#contact"
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ChevronRight />}
            sx={{ 
              py: 2,
              px: 5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 8px 24px rgba(255, 193, 7, 0.3)',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 12px 32px rgba(255, 193, 7, 0.4)',
              },
              transition: 'all 0.3s',
            }}
          >
            {heroData.ctaText}
          </Button>
          <Button 
            href="#services"
            variant="outlined"
            size="large"
            sx={{ 
              py: 2,
              px: 5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            Our Services
          </Button>
        </Box>
      </Container>

      {/* Scroll Down Indicator with Car Animation */}
      <Box
        onClick={() => {
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        }}
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          cursor: 'pointer',
          textAlign: 'center',
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.7)',
            display: 'block',
            mb: 2,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Scroll Down
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: 60,
            height: 60,
            mx: 'auto',
          }}
        >
          <DirectionsCar
            sx={{
              fontSize: 40,
              color: 'secondary.main',
              animation: 'carBounce 2s ease-in-out infinite',
              '@keyframes carBounce': {
                '0%, 100%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(10px)',
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
