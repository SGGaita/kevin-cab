'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';
import { DirectionsCar } from '@mui/icons-material';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <Box
              sx={{
                bgcolor: 'secondary.main',
                p: 1.5,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <DirectionsCar sx={{ color: 'black', fontSize: 32 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              KEVINCAB
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            Driver Portal
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Sign in to manage your bookings
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                fullWidth
                autoComplete="email"
              />

              <TextField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                fullWidth
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  bgcolor: 'black',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Button
                href="/"
                sx={{ color: 'text.secondary' }}
              >
                Back to Home
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
          Need access? Contact admin at admin@kevincab.co.ke
        </Typography>
      </Container>
    </Box>
  );
}
