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
} from '@mui/material';
import { Save } from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';

export default function AboutSectionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchAboutSection();
    }
  }, [session]);

  const fetchAboutSection = async () => {
    try {
      const response = await fetch('/api/cms/about');
      const data = await response.json();
      if (data.success && data.about) {
        setFormData({
          title: data.about.title,
          subtitle: data.about.subtitle,
          description: data.about.description,
          imageUrl: data.about.imageUrl || '',
        });
      }
    } catch (error) {
      console.error('Error fetching about section:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/cms/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'About section updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update about section' });
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
          About Section
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Manage your company information and story
        </Typography>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
              helperText="Main heading for the about section"
            />

            <TextField
              label="Subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              required
              fullWidth
              helperText="Secondary heading or tagline"
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              multiline
              rows={6}
              fullWidth
              helperText="Detailed description about your company"
            />

            <TextField
              label="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              fullWidth
              helperText="Optional: URL to an image for the about section"
            />

            {formData.imageUrl && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Image Preview:
                </Typography>
                <Box
                  component="img"
                  src={formData.imageUrl}
                  alt="About section preview"
                  sx={{ maxWidth: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 2 }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
