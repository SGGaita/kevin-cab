'use client';

import { Box, Typography, Button } from '@mui/material';
import { Flight, Hotel, Park } from '@mui/icons-material';

const services = [
  {
    icon: Flight,
    title: 'Airport & Hotel Transfers',
    description: 'Reliable transfers from airport to hotel, guesthouse to airport, ensuring timely and comfortable transportation with professional drivers.',
  },
  {
    icon: Hotel,
    title: 'Transfer from Hotel to Hotel',
    description: 'Seamless transfers between hotels for your convenience during your stay.',
  },
  {
    icon: Park,
    title: 'National Park Tours & Transfers',
    description: 'Comfortable transportation from your hotel to national parks and guided safari tours to experience the beauty of Kenya\'s wildlife.',
  },
];

export default function Services() {
  return (
    <Box id="services" sx={{ py: 12, bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 40%' } }}>
          <Box
            component="img"
            src="/uploads/service-1.png"
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
            WE DO MORE
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, mb: 3, fontWeight: 900, color: 'text.primary', letterSpacing: -1 }}>
            THAN YOU WISH
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6, lineHeight: 1.8 }}>
            Professional transfer services and exciting national park tours across Kenya. Your trusted travel partner since 2018.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 6 }}>
            {services.map((service, index) => (
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
                  <service.icon 
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
            ))}
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
