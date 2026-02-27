'use client';

import { Box, Container, Typography } from '@mui/material';
import { Shield, AccessTime } from '@mui/icons-material';

const values = [
  {
    icon: Shield,
    title: 'Safety First',
    text: 'All vehicles equipped with GPS and SOS panic buttons.',
  },
  {
    icon: AccessTime,
    title: 'Zero Lateness',
    text: 'Our punctuality guarantee means we are always there 5 minutes early.',
  },
];

export default function About() {
  return (
    <Box id="about" sx={{ py: 12, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 32px)' } }}>
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: -24,
                  left: -24,
                  width: 128,
                  height: 128,
                  bgcolor: 'secondary.main',
                  borderRadius: 4,
                  zIndex: 0,
                }}
              />
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Kevincab Experience"
                sx={{
                  position: 'relative',
                  zIndex: 10,
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
              />
            </Box>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 32px)' } }}>
            <Box>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, lineHeight: 1.3 }}>
                Redefining the Standard of{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    color: 'secondary.dark',
                    textDecoration: 'underline',
                    textDecorationColor: 'secondary.main',
                    textUnderlineOffset: 8,
                  }}
                >
                  Hospitality
                </Box>{' '}
                on the Road.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5, lineHeight: 1.8, fontSize: '1.1rem' }}>
                At Kevincab, we don't just see a journey; we see a commitment to safety, timeliness, 
                and Kenyan warmth. Our fleet is maintained to global standards to ensure your comfort.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {values.map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 2.5 }}>
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 48,
                        height: 48,
                        bgcolor: '#f5f5f5',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <item.icon sx={{ color: 'secondary.dark' }} />
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
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
