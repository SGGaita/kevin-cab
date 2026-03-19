'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, DragIndicator } from '@mui/icons-material';
import ImageUpload from '@/components/ImageUpload';
import DashboardLayout from '@/components/DashboardLayout';

export default function GalleryDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    caption: '',
    category: 'safari',
    order: 0,
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchImages();
    }
  }, [status]);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/cms/gallery');
      const result = await response.json();
      if (result.success) {
        setImages(result.images || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setMessage({ type: 'error', text: 'Failed to load images' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (image = null) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        imageUrl: image.image_url,
        caption: image.caption,
        category: image.category || 'safari',
        order: image.order || 0,
      });
    } else {
      setEditingImage(null);
      setFormData({
        imageUrl: '',
        caption: '',
        category: 'safari',
        order: images.length,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingImage(null);
    setFormData({ imageUrl: '', caption: '', category: 'safari', order: 0 });
  };

  const handleSubmit = async () => {
    try {
      const url = editingImage
        ? `/api/cms/gallery/${editingImage.id}`
        : '/api/cms/gallery';
      const method = editingImage ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: editingImage ? 'Image updated successfully' : 'Image added successfully',
        });
        fetchImages();
        handleCloseDialog();
      } else {
        setMessage({ type: 'error', text: result.error || 'Operation failed' });
      }
    } catch (error) {
      console.error('Error saving image:', error);
      setMessage({ type: 'error', text: 'Failed to save image' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/cms/gallery/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Image deleted successfully' });
        fetchImages();
      } else {
        setMessage({ type: 'error', text: result.error || 'Delete failed' });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage({ type: 'error', text: 'Failed to delete image' });
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
      <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Gallery Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 0 }}
        >
          Add Image
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
            <Card sx={{ position: 'relative', borderRadius: 0 }}>
              <CardMedia
                component="img"
                height="200"
                image={image.image_url}
                alt={image.caption}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {image.caption}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Order: {image.order}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(image)}
                    sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(image.id)}
                    sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {images.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No images yet. Click "Add Image" to get started.
          </Typography>
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingImage ? 'Edit Image' : 'Add New Image'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              label="Gallery Image"
              helperText="Drag and drop an image here, or click to select"
              maxSize={10}
            />
            <TextField
              label="Caption"
              fullWidth
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="Image description"
            />
            <TextField
              label="Category"
              fullWidth
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="safari"
            />
            <TextField
              label="Order"
              type="number"
              fullWidth
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 0 }}>
            {editingImage ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </DashboardLayout>
  );
}
