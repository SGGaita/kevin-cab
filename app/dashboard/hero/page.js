'use client';

import { useState, useEffect, useRef } from 'react';
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
  Snackbar,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { Save, CloudUpload, Delete, Image as ImageIcon, Close } from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';

export default function HeroSectionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    ctaText: '',
    imageUrl: '',
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchHeroSection();
    }
  }, [session]);

  const fetchHeroSection = async () => {
    try {
      const response = await fetch('/api/cms/hero');
      const data = await response.json();
      if (data.success && data.hero) {
        setFormData({
          title: data.hero.title,
          subtitle: data.hero.subtitle,
          description: data.hero.description,
          ctaText: data.hero.ctaText,
          imageUrl: data.hero.imageUrl || '',
        });
      }
    } catch (error) {
      console.error('Error fetching hero section:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSnackbar({
        open: true,
        message: 'Please upload an image file',
        severity: 'error',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: 'File size must be less than 10MB',
        severity: 'error',
      });
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();
      if (data.success) {
        setFormData({ ...formData, imageUrl: data.imageUrl });
        setSnackbar({
          open: true,
          message: 'Image uploaded successfully!',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to upload image',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred during upload',
        severity: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/cms/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setSnackbar({
          open: true,
          message: 'Hero section updated successfully!',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to update hero section',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred',
        severity: 'error',
      });
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
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: -0.5 }}>
          Hero Section
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.05rem' }}>
          Manage the main banner section of your homepage
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)', mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Image Upload Section */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                Background Image
              </Typography>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {formData.imageUrl ? (
                <Box>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 300,
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: '2px solid #E0E0E0',
                      mb: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={formData.imageUrl}
                      alt="Hero background"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.8)',
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      borderColor: '#E0E0E0',
                      color: '#666',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#BDBDBD',
                        bgcolor: 'rgba(0,0,0,0.02)',
                      },
                    }}
                  >
                    Change Image
                  </Button>
                </Box>
              ) : (
                <Box
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    border: dragActive ? '3px dashed #2196F3' : '3px dashed #E0E0E0',
                    borderRadius: 3,
                    p: 6,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: dragActive ? 'rgba(33, 150, 243, 0.05)' : '#FAFAFA',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#BDBDBD',
                      bgcolor: 'rgba(0,0,0,0.02)',
                    },
                  }}
                >
                  <ImageIcon sx={{ fontSize: 64, color: '#BDBDBD', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {dragActive ? 'Drop image here' : 'Drag & drop image here'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    or click to browse
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    Supported formats: JPG, PNG, GIF (Max 10MB)
                  </Typography>
                </Box>
              )}

              {uploading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                    Uploading image...
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Form Fields */}
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
              helperText="Main headline text"
            />

            <TextField
              label="Subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              required
              fullWidth
              helperText="Secondary headline text"
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              multiline
              rows={4}
              fullWidth
              helperText="Brief description or tagline"
            />

            <TextField
              label="Call-to-Action Text"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              required
              fullWidth
              helperText="Text for the main button (e.g., 'Book Now')"
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={saving || uploading}
                startIcon={<Save />}
                sx={{ 
                  bgcolor: 'black', 
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 4,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } 
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
