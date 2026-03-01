'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Avatar } from '@mui/material';
import { FormatQuote, Star } from '@mui/icons-material';

const testimonials = [
  {
    name: 'Stephen Gaita',
    role: 'Business Traveler',
    rating: 5,
    text: 'Exceptional service! The professionalism and punctuality of Kevincab Tour and Travel is unmatched. Every journey with them has been smooth and comfortable.',
    avatar: 'SG',
  },
  {
    name: 'Esther Gaikia',
    role: 'Frequent Customer',
    rating: 5,
    text: 'Outstanding experience from start to finish. The booking process was seamless and the driver was incredibly professional. Will definitely use again!',
    avatar: 'EG',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  if (!currentTestimonial) {
    return null;
  }

  return (
    <Box 
      id="testimonial"
      sx={{ 
        py: 5, 
        bgcolor: 'white',
        backgroundImage: 'url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 900, 
              color: 'white',
              mb: 1,
              letterSpacing: -1,
            }}
          >
            WORDS FROM OUR CUSTOMERS
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 1 }}>
            {[...Array(8)].map((_, i) => (
              <Box 
                key={i} 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  bgcolor: 'secondary.main',
                  transform: 'rotate(45deg)',
                }} 
              />
            ))}
          </Box>
        </Box>

        <Box 
          sx={{ 
            maxWidth: 900, 
            mx: 'auto',
            textAlign: 'center',
            transition: 'all 0.5s ease-in-out',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <FormatQuote 
              sx={{ 
                fontSize: 40, 
                color: 'secondary.main',
                transform: 'scaleX(-1)',
              }} 
            />
          </Box>

          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              fontStyle: 'italic',
              lineHeight: 1.6,
              mb: 2,
              px: { xs: 2, md: 6 },
              minHeight: 60,
            }}
          >
            {currentTestimonial.text}
          </Typography>

          <Box sx={{ mb: 0.5 }}>
            <FormatQuote 
              sx={{ 
                fontSize: 60, 
                color: 'secondary.main',
              }} 
            />
          </Box>

          <Typography 
            variant="body1" 
            sx={{ 
              color: 'white',
              fontWeight: 'bold',
              mb: 0.5,
            }}
          >
            - {currentTestimonial.name}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 2 }}>
            {testimonials.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: index === currentIndex ? 'secondary.main' : 'rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: index === currentIndex ? 'secondary.main' : 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

      </Container>
    </Box>
  );
}
