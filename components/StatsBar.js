'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';

const defaultStats = [
  { label: 'Counties', value: '47' },
  { label: 'Availability', value: '24/7' },
  { label: 'Customer Rating', value: '4.9/5' },
  { label: 'Response Time', value: '5-10m' },
];

export default function StatsBar() {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/cms/stats');
      const result = await response.json();
      if (result.success && result.stats && result.stats.length > 0) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: 'black', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'space-around' }}>
          {stats.map((stat, i) => (
            <Box 
              key={i}
              sx={{ 
                flex: { xs: '1 1 45%', lg: '1 1 20%' },
                textAlign: 'center',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  color: 'secondary.main', 
                  fontWeight: 'bold',
                  mb: 0.5,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                {stat.value}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  fontWeight: 600,
                  fontSize: { xs: '0.65rem', md: '0.75rem' }
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
