'use client';

import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Box } from '@mui/material';
import { Home, DirectionsCar, Info, Phone, BookOnline } from '@mui/icons-material';

export default function MobileBottomNav() {
  const [value, setValue] = useState(0);

  const navItems = [
    { label: 'Home', icon: Home, href: '#home' },
    { label: 'Services', icon: DirectionsCar, href: '#services' },
    { label: 'Book', icon: BookOnline, href: '#contact', isSpecial: true },
    { label: 'About', icon: Info, href: '#about' },
    { label: 'Contact', icon: Phone, href: '#help' },
  ];

  const handleNavigation = (event, newValue) => {
    setValue(newValue);
    const href = navItems[newValue].href;
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', md: 'none' },
        borderTop: '2px solid',
        borderColor: 'secondary.main',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleNavigation}
        showLabels
        sx={{
          bgcolor: 'black',
          height: 70,
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(255, 255, 255, 0.5)',
            minWidth: 'auto',
            '&.Mui-selected': {
              color: 'secondary.main',
            },
          },
        }}
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={item.label}
            icon={
              item.isSpecial ? (
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: -20,
                    boxShadow: '0 4px 14px rgba(255, 193, 7, 0.4)',
                  }}
                >
                  <item.icon sx={{ color: 'black', fontSize: 28 }} />
                </Box>
              ) : (
                <item.icon />
              )
            }
            sx={
              item.isSpecial
                ? {
                    '& .MuiBottomNavigationAction-label': {
                      fontSize: '0.75rem',
                      mt: 1,
                    },
                  }
                : {}
            }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
