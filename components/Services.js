'use client';

import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { Flight, LocationOn, Business } from '@mui/icons-material';

const services = [
  {
    icon: Flight,
    title: 'Airport Transfers',
    description: 'Prompt transfers to JKIA, Wilson, and Moi International. We track your flight status in real-time to ensure zero wait time.',
  },
  {
    icon: LocationOn,
    title: 'Inter-County Trips',
    description: 'Reliable long-distance travel from Nairobi to any town including Nakuru, Kisumu, and Eldoret at competitive flat rates.',
  },
  {
    icon: Business,
    title: 'Corporate Logistics',
    description: 'Exclusive transport management for your employees and high-profile guests with monthly billing cycles.',
  },
];

export default function Services() {
  return (
    <Box id="services" sx={{ py: 12, bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', mb: 8, gap: 3 }}>
          <Box sx={{ maxWidth: 600 }}>
            <Typography 
              variant="overline" 
              sx={{ color: 'secondary.main', fontWeight: 'bold', letterSpacing: 2 }}
            >
              What we do
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, fontWeight: 800, color: 'text.primary' }}>
              Tailored Transportation Solutions
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary', 
              maxWidth: 400,
              alignSelf: 'flex-end'
            }}
          >
            We provide more than just a ride; we provide peace of mind across Kenya.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {services.map((service, index) => (
            <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 22px)' } }}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    boxShadow: '0 12px 40px rgba(255, 193, 7, 0.1)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box 
                    sx={{ 
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      bgcolor: 'rgba(255, 193, 7, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      transition: 'all 0.3s',
                      '.MuiCard-root:hover &': {
                        bgcolor: 'secondary.main',
                      },
                    }}
                  >
                    <service.icon 
                      sx={{ 
                        fontSize: 28,
                        color: 'secondary.dark',
                        transition: 'color 0.3s',
                        '.MuiCard-root:hover &': {
                          color: 'black',
                        },
                      }} 
                    />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
