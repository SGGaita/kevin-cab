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
  MenuItem,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Save, Add, Delete, ArrowUpward, ArrowDownward, Edit } from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';
import ImageUpload from '@/components/ImageUpload';

export default function AboutSectionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState({ icon: 'Shield', title: '', text: '' });
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
  });
  const [values, setValues] = useState([
    { icon: 'Shield', title: 'Safety First', text: 'All vehicles equipped with GPS and SOS panic buttons.' },
    { icon: 'AccessTime', title: 'Zero Lateness', text: 'Our punctuality guarantee means we are always there 5 minutes early.' }
  ]);

  const availableIcons = [
    { value: 'Shield', label: 'Shield (Safety)' },
    { value: 'AccessTime', label: 'Access Time (Punctuality)' },
    { value: 'CheckCircle', label: 'Check Circle' },
    { value: 'Star', label: 'Star (Quality)' },
  ];

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
      const result = await response.json();
      if (result.success && result.data) {
        setFormData({
          title: result.data.title || '',
          subtitle: result.data.subtitle || '',
          description: result.data.description || '',
          imageUrl: result.data.image_url || '',
        });
        
        if (result.data.stats) {
          const stats = typeof result.data.stats === 'string' 
            ? JSON.parse(result.data.stats) 
            : result.data.stats;
          if (stats && stats.length > 0) {
            setValues(stats);
          }
        }
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
        body: JSON.stringify({
          ...formData,
          values: values,
        }),
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

  const handleAddValue = () => {
    setEditingIndex(null);
    setEditingValue({ icon: 'Shield', title: '', text: '' });
    setEditDialogOpen(true);
  };

  const handleEditValue = (index) => {
    setEditingIndex(index);
    setEditingValue({ ...values[index] });
    setEditDialogOpen(true);
  };

  const handleSaveValue = () => {
    if (editingIndex !== null) {
      const newValues = [...values];
      newValues[editingIndex] = editingValue;
      setValues(newValues);
    } else {
      setValues([...values, editingValue]);
    }
    setEditDialogOpen(false);
    setEditingValue({ icon: 'Shield', title: '', text: '' });
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditingValue({ icon: 'Shield', title: '', text: '' });
  };

  const handleRemoveValue = (index) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleValueChange = (index, field, value) => {
    const newValues = [...values];
    newValues[index][field] = value;
    setValues(newValues);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newValues = [...values];
    [newValues[index - 1], newValues[index]] = [newValues[index], newValues[index - 1]];
    setValues(newValues);
  };

  const handleMoveDown = (index) => {
    if (index === values.length - 1) return;
    const newValues = [...values];
    [newValues[index], newValues[index + 1]] = [newValues[index + 1], newValues[index]];
    setValues(newValues);
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

            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              label="About Section Image"
              helperText="Drag and drop an image here, or click to select"
              maxSize={10}
            />

            <Divider sx={{ my: 2 }} />

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Key Features
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddValue}
                  size="small"
                >
                  Add Feature
                </Button>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Manage features like "Safety First" and "Zero Lateness" that appear below the description
              </Typography>

              {values.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No features yet. Click "Add Feature" to create one.
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Order</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Icon</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.map((value, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleMoveUp(index)}
                                disabled={index === 0}
                                color="primary"
                              >
                                <ArrowUpward fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleMoveDown(index)}
                                disabled={index === values.length - 1}
                                color="primary"
                              >
                                <ArrowDownward fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell>{value.icon}</TableCell>
                          <TableCell>{value.title}</TableCell>
                          <TableCell>{value.text.substring(0, 50)}...</TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleEditValue(index)}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleRemoveValue(index)} color="error">
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>

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

      <Dialog open={editDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingIndex !== null ? 'Edit Feature' : 'Add New Feature'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              select
              label="Icon"
              value={editingValue.icon}
              onChange={(e) => setEditingValue({ ...editingValue, icon: e.target.value })}
              fullWidth
            >
              {availableIcons.map((icon) => (
                <MenuItem key={icon.value} value={icon.value}>
                  {icon.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Title"
              value={editingValue.title}
              onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
              required
              fullWidth
              placeholder="e.g., Safety First"
            />

            <TextField
              label="Description"
              value={editingValue.text}
              onChange={(e) => setEditingValue({ ...editingValue, text: e.target.value })}
              required
              multiline
              rows={4}
              fullWidth
              placeholder="e.g., All vehicles equipped with GPS and SOS panic buttons."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveValue}
            disabled={!editingValue.title || !editingValue.text}
            sx={{ bgcolor: 'black', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
          >
            {editingIndex !== null ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
