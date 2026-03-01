'use client';

import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

export default function CursorRipple() {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const ripple = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, ripple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 1000);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {ripples.map((ripple) => (
        <Box
          key={ripple.id}
          sx={{
            position: 'fixed',
            top: ripple.y,
            left: ripple.x,
            width: 0,
            height: 0,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: 'secondary.main',
            pointerEvents: 'none',
            zIndex: 9999,
            animation: 'rippleEffect 1s ease-out',
            '@keyframes rippleEffect': {
              '0%': {
                width: 0,
                height: 0,
                marginTop: 0,
                marginLeft: 0,
                opacity: 1,
              },
              '100%': {
                width: 100,
                height: 100,
                marginTop: -50,
                marginLeft: -50,
                opacity: 0,
              },
            },
          }}
        />
      ))}
    </>
  );
}
