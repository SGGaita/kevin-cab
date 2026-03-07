'use client';

import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { Phone, Email } from '@mui/icons-material';
import BookingForm from './BookingForm';

export default function Contact() {
  return (
    <Box id="contact" sx={{ py: 12, bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(58.333% - 32px)' } }}>
            <BookingForm />
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(41.667% - 32px)' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 6 }}>
              <Box id="help">
                <Box sx={{ mb: 5, pb: 3, borderBottom: '2px solid', borderColor: 'secondary.main' }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: -1 }}>
                    Need Immediate Help?
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                    Our dispatch team is available 24/7. Call or WhatsApp for urgent bookings.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Card
                    component="a"
                    href="tel:+254712345678"
                    sx={{
                      textDecoration: 'none',
                      borderRadius: 0,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s',
                      '&:hover': { 
                        boxShadow: 4,
                        borderColor: 'secondary.main',
                        transform: 'translateX(8px)'
                      },
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: '#f5f5f5',
                          borderRadius: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Phone sx={{ color: 'secondary.dark', fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          Call Us
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          +254 712 345 678
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card
                    component="a"
                    href="mailto:karugokevin527@gmail.com"
                    sx={{
                      textDecoration: 'none',
                      borderRadius: 0,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s',
                      '&:hover': { 
                        boxShadow: 4,
                        borderColor: 'secondary.main',
                        transform: 'translateX(8px)'
                      },
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: '#f5f5f5',
                          borderRadius: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Email sx={{ color: 'secondary.dark', fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          Email Us
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                          karugokevin527@gmail.com
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
