'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Shield, AccessTime, CheckCircle, Star } from '@mui/icons-material';

const iconMap = {
  Shield: Shield,
  AccessTime: AccessTime,
  CheckCircle: CheckCircle,
  Star: Star,
};

const defaultAbout = {
  title: 'Redefining the Standard of Hospitality on the Road.',
  subtitle: 'Hospitality',
  description: "At Kevincab Tour and Travel, we don't just see a journey; we see a commitment to safety, timeliness, and Kenyan warmth. Our fleet is maintained to global standards to ensure your comfort.",
  imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  values: [
    { icon: 'Shield', title: 'Safety First', text: 'All vehicles equipped with GPS and SOS panic buttons.' },
    { icon: 'AccessTime', title: 'Zero Lateness', text: 'Our punctuality guarantee means we are always there 5 minutes early.' }
  ]
};

export default function About() {
  const [aboutData, setAboutData] = useState(defaultAbout);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/cms/about');
      const result = await response.json();
      if (result.success && result.data) {
        const stats = typeof result.data.stats === 'string' 
          ? JSON.parse(result.data.stats) 
          : result.data.stats;
        
        setAboutData({
          title: result.data.title || defaultAbout.title,
          subtitle: result.data.subtitle || defaultAbout.subtitle,
          description: result.data.description || defaultAbout.description,
          imageUrl: result.data.image_url || defaultAbout.imageUrl,
          values: stats || defaultAbout.values
        });
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  const titleParts = aboutData.title.split(aboutData.subtitle);

  return (
    <Box id="about" sx={{ py: 12, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 32px)' }, position: 'relative', overflow: 'hidden' }}>
            <Box
              component="img"
              src={aboutData.imageUrl}
              alt="About Us"
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
                position: 'relative',
                zIndex: 2,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                left: -20,
                width: 200,
                height: 200,
                bgcolor: 'secondary.main',
                zIndex: 1,
              }}
            />
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 32px)' } }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 3,
                letterSpacing: -1,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              {titleParts[0]}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                {aboutData.subtitle}
              </Box>
              {titleParts[1]}
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
              {aboutData.description}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {aboutData.values.map((item, index) => {
                const IconComponent = iconMap[item.icon] || Shield;
                return (
                  <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 48,
                        height: 48,
                        bgcolor: '#f5f5f5',
                        borderRadius: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComponent sx={{ color: 'secondary.dark' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.text}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
