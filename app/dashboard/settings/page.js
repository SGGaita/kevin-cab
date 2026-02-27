'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';

export default function SiteSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    siteName: '',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '',
    secondaryColor: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/cms/settings');
      const data = await response.json();
      if (data.success && data.settings) {
        setFormData({
          siteName: data.settings.siteName,
          logoUrl: data.settings.logoUrl || '',
          faviconUrl: data.settings.faviconUrl || '',
          primaryColor: data.settings.primaryColor,
          secondaryColor: data.settings.secondaryColor,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout session={session}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Site Settings
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Configure your website branding and appearance
        </Typography>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                General Settings
              </Typography>
              <TextField
                label="Site Name"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                required
                fullWidth
                helperText="Your company or website name"
              />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Branding
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Logo URL"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  fullWidth
                  helperText="URL to your logo image (PNG, SVG recommended)"
                />

                <TextField
                  label="Favicon URL"
                  value={formData.faviconUrl}
                  onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                  fullWidth
                  helperText="URL to your favicon (16x16 or 32x32 px)"
                />

                {formData.logoUrl && (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Logo Preview:
                    </Typography>
                    <Box
                      component="img"
                      src={formData.logoUrl}
                      alt="Logo preview"
                      sx={{ maxWidth: 200, maxHeight: 100, objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Color Scheme
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    label="Primary Color"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    required
                    fullWidth
                    helperText="Main brand color (e.g., buttons, accents)"
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    label="Secondary Color"
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    required
                    fullWidth
                    helperText="Secondary brand color"
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={saving}
                startIcon={<Save />}
                sx={{ bgcolor: 'black', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
