'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Card, CardContent, TextField, Button, Typography, Alert, Link } from '@mui/material';
import { DirectionsCar, ArrowBack, LockReset } from '@mui/icons-material';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [resetData, setResetData] = useState({ email: '', phone: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);

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

  const handleVerifyUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetData.email,
          phone: resetData.phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVerifiedUser(data.user);
        setSuccess(`Account verified! Welcome ${data.user.name}. You can now set a new password.`);
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (resetData.newPassword !== resetData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (resetData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetData.email,
          phone: resetData.phone,
          newPassword: resetData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password reset successfully! You can now sign in with your new password.');
        setTimeout(() => {
          setMode('login');
          setResetData({ email: '', phone: '', newPassword: '', confirmPassword: '' });
          setVerifiedUser(null);
          setSuccess('');
        }, 2000);
      } else {
        setError(data.error || 'Password reset failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setMode('login');
    setError('');
    setSuccess('');
    setResetData({ email: '', phone: '', newPassword: '', confirmPassword: '' });
    setVerifiedUser(null);
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
            {mode === 'login' ? (
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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link
                    component="button"
                    type="button"
                    onClick={() => setMode('reset')}
                    sx={{ 
                      color: 'primary.main', 
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                      fontWeight: 600,
                    }}
                  >
                    Forgot Password?
                  </Link>
                  <Button
                    href="/"
                    sx={{ color: 'text.secondary' }}
                  >
                    Back to Home
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LockReset sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Reset Password
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    {success}
                  </Alert>
                )}

                {!verifiedUser ? (
                  <Box component="form" onSubmit={handleVerifyUser} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      Enter your email and phone number to verify your account
                    </Alert>

                    <TextField
                      label="Email Address"
                      type="email"
                      value={resetData.email}
                      onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                      required
                      fullWidth
                      autoComplete="email"
                    />

                    <TextField
                      label="Phone Number"
                      type="tel"
                      value={resetData.phone}
                      onChange={(e) => setResetData({ ...resetData, phone: e.target.value })}
                      required
                      fullWidth
                      placeholder="254712345678"
                      helperText="Enter your registered phone number"
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        bgcolor: 'primary.main',
                        fontWeight: 'bold',
                      }}
                    >
                      {loading ? 'Verifying...' : 'Verify Account'}
                    </Button>

                    <Button
                      startIcon={<ArrowBack />}
                      onClick={handleBackToLogin}
                      sx={{ color: 'text.secondary' }}
                    >
                      Back to Login
                    </Button>
                  </Box>
                ) : (
                  <Box component="form" onSubmit={handleResetPassword} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                      Account verified! Set your new password below.
                    </Alert>

                    <TextField
                      label="New Password"
                      type="password"
                      value={resetData.newPassword}
                      onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                      required
                      fullWidth
                      helperText="Minimum 6 characters"
                    />

                    <TextField
                      label="Confirm New Password"
                      type="password"
                      value={resetData.confirmPassword}
                      onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                      required
                      fullWidth
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
                      {loading ? 'Resetting Password...' : 'Reset Password'}
                    </Button>

                    <Button
                      startIcon={<ArrowBack />}
                      onClick={handleBackToLogin}
                      sx={{ color: 'text.secondary' }}
                    >
                      Back to Login
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
          Need access? Contact admin at admin@kevincab.co.ke
        </Typography>
      </Container>
    </Box>
  );
}
