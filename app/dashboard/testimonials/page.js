'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Rating,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';

export default function TestimonialsDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 5,
    text: '',
    avatarUrl: '',
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
      fetchTestimonials();
    }
  }, [status]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/cms/testimonials');
      const result = await response.json();
      if (result.success) {
        setTestimonials(result.testimonials || []);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setMessage({ type: 'error', text: 'Failed to load testimonials' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role || '',
        rating: testimonial.rating || 5,
        text: testimonial.text,
        avatarUrl: testimonial.avatar_url || '',
        order: testimonial.order || 0,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        role: '',
        rating: 5,
        text: '',
        avatarUrl: '',
        order: testimonials.length,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTestimonial(null);
    setFormData({ name: '', role: '', rating: 5, text: '', avatarUrl: '', order: 0 });
  };

  const handleSubmit = async () => {
    try {
      const url = editingTestimonial
        ? `/api/cms/testimonials/${editingTestimonial.id}`
        : '/api/cms/testimonials';
      const method = editingTestimonial ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: editingTestimonial ? 'Testimonial updated successfully' : 'Testimonial added successfully',
        });
        fetchTestimonials();
        handleCloseDialog();
      } else {
        setMessage({ type: 'error', text: result.error || 'Operation failed' });
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      setMessage({ type: 'error', text: 'Failed to save testimonial' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/cms/testimonials/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Testimonial deleted successfully' });
        fetchTestimonials();
      } else {
        setMessage({ type: 'error', text: result.error || 'Delete failed' });
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      setMessage({ type: 'error', text: 'Failed to delete testimonial' });
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
          Testimonials Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 0 }}
        >
          Add Testimonial
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Testimonial</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell>{testimonial.name}</TableCell>
                <TableCell>{testimonial.role || '-'}</TableCell>
                <TableCell>
                  <Rating value={testimonial.rating} readOnly size="small" />
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  {testimonial.text.substring(0, 100)}...
                </TableCell>
                <TableCell>{testimonial.order}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(testimonial)}
                      color="primary"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(testimonial.id)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {testimonials.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No testimonials yet. Click "Add Testimonial" to get started.
          </Typography>
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Customer Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Role/Title"
              fullWidth
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Business Traveler"
            />
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Rating</Typography>
              <Rating
                value={formData.rating}
                onChange={(e, newValue) => setFormData({ ...formData, rating: newValue })}
              />
            </Box>
            <TextField
              label="Testimonial Text"
              fullWidth
              required
              multiline
              rows={4}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            />
            <TextField
              label="Avatar URL (optional)"
              fullWidth
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
            <TextField
              label="Display Order"
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
            {editingTestimonial ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </DashboardLayout>
  );
}
