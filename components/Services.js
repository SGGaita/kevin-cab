'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Flight, Hotel, Park, DirectionsCar, LocalTaxi, Explore } from '@mui/icons-material';

const iconMap = {
  Flight: Flight,
  Hotel: Hotel,
  Park: Park,
  DirectionsCar: DirectionsCar,
  LocalTaxi: LocalTaxi,
  Explore: Explore,
};

const defaultServices = [
  {
    icon: 'Flight',
    title: 'Airport & Hotel Transfers',
    description: 'Reliable transfers from airport to hotel, guesthouse to airport, ensuring timely and comfortable transportation with professional drivers.',
  },
  {
    icon: 'Hotel',
    title: 'Transfer from Hotel to Hotel',
    description: 'Seamless transfers between hotels for your convenience during your stay.',
  },
  {
    icon: 'Park',
    title: 'National Park Tours & Transfers',
    description: 'Comfortable transportation from your hotel to national parks and guided safari tours to experience the beauty of Kenya\'s wildlife.',
  },
];

const defaultSectionHeading = {
  overline: 'WE DO MORE',
  heading: 'THAN YOU WISH',
  description: 'Professional transfer services and exciting national park tours across Kenya. Your trusted travel partner since 2018.',
  imageUrl: '/uploads/service-1.png'
};

export default function Services() {
  const [services, setServices] = useState(defaultServices);
  const [sectionHeading, setSectionHeading] = useState(defaultSectionHeading);

  useEffect(() => {
    fetchServices();
    fetchSectionHeading();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/cms/services');
      const result = await response.json();
      if (result.success && result.services && result.services.length > 0) {
        setServices(result.services.map(s => ({
          icon: s.icon || 'Flight',
          title: s.title,
          description: s.description
        })));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchSectionHeading = async () => {
    try {
      const response = await fetch('/api/cms/section-headings?section=services');
      const result = await response.json();
      if (result.success && result.data) {
        setSectionHeading({
          overline: result.data.overline || defaultSectionHeading.overline,
          heading: result.data.heading || defaultSectionHeading.heading,
          description: result.data.description || defaultSectionHeading.description,
          imageUrl: result.data.image_url || defaultSectionHeading.imageUrl
        });
      }
    } catch (error) {
      console.error('Error fetching section heading:', error);
    }
  };

  return (
    <Box id="services" sx={{ py: 12, bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 40%' } }}>
          <Box
            component="img"
            src={sectionHeading.imageUrl}
            alt="Kevincab Taxi"
            sx={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 60%' }, px: { xs: 3, md: 8 }, py: { xs: 6, lg: 0 } }}>
          <Typography 
            variant="overline" 
            sx={{ color: 'text.secondary', fontWeight: 'bold', letterSpacing: 2, fontSize: '0.85rem' }}
          >
            {sectionHeading.overline}
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, mb: 3, fontWeight: 900, color: 'text.primary', letterSpacing: -1 }}>
            {sectionHeading.heading}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6, lineHeight: 1.8 }}>
            {sectionHeading.description}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 6 }}>
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Flight;
              return (
              <Box key={index} sx={{ display: 'flex', gap: 3 }}>
                <Box 
                  sx={{ 
                    flexShrink: 0,
                    width: 56,
                    height: 56,
                    borderRadius: 0,
                    border: '2px solid',
                    borderColor: 'secondary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent 
                    sx={{ 
                      fontSize: 28,
                      color: 'secondary.main',
                    }} 
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase' }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 1 }}>
                    {service.description}
                  </Typography>
                </Box>
              </Box>
            );
            })}
          </Box>

          <Button
            href="#contact"
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: 0,
              boxShadow: '0 4px 14px rgba(255, 193, 7, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(255, 193, 7, 0.4)',
              },
            }}
          >
            BOOK NOW
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
