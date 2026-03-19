'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import { DirectionsCar, Facebook, Twitter, Instagram, LinkedIn, YouTube } from '@mui/icons-material';

const iconMap = {
  Facebook: Facebook,
  Twitter: Twitter,
  Instagram: Instagram,
  LinkedIn: LinkedIn,
  YouTube: YouTube,
};

export default function Footer() {
  const [settings, setSettings] = useState({
    siteName: 'KEVINCAB TOUR AND TRAVEL',
    footerDescription: 'Professional transfer services and national park tours across Kenya. Your trusted travel partner since 2018.',
    copyrightText: 'Kevincab Tour and Travel. Designed for the open road.'
  });
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    fetchSettings();
    fetchSocialLinks();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/cms/settings');
      const result = await response.json();
      if (result.success && result.data) {
        setSettings({
          siteName: result.data.site_name || 'KEVINCAB TOUR AND TRAVEL',
          footerDescription: result.data.footer_description || 'Professional transfer services and national park tours across Kenya. Your trusted travel partner since 2018.',
          copyrightText: result.data.copyright_text || 'Kevincab Tour and Travel. Designed for the open road.'
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const response = await fetch('/api/cms/social');
      const result = await response.json();
      if (result.success && result.socialLinks) {
        setSocialLinks(result.socialLinks.filter(link => link.is_active));
      }
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  return (
    <Box component="footer" sx={{ bgcolor: 'black', color: 'white', py: 8, pb: { xs: 10, md: 8 } }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
            <DirectionsCar sx={{ color: 'secondary.main', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 900, fontStyle: 'italic', letterSpacing: -1 }}>
              {settings.siteName}
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, lineHeight: 1.8, maxWidth: 600, mx: 'auto' }}>
            {settings.footerDescription}
          </Typography>
          
          {socialLinks.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 5 }}>
              {socialLinks.map((link) => {
                const IconComponent = iconMap[link.platform] || Facebook;
                return (
                  <IconButton
                    key={link.id}
                    component="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      '&:hover': { bgcolor: 'secondary.main', color: 'black' },
                    }}
                  >
                    <IconComponent />
                  </IconButton>
                );
              })}
            </Box>
          )}

          <Box sx={{ pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.4)',
                fontStyle: 'italic',
                mb: 1,
              }}
            >
              &copy; {new Date().getFullYear()} {settings.copyrightText}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.75rem',
              }}
            >
              Design by Ascension Dynamics
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
