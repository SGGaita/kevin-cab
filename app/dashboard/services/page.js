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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  Divider,
} from '@mui/material';
import { Add, Edit, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';
import ImageUpload from '@/components/ImageUpload';

export default function ServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [sectionHeading, setSectionHeading] = useState({
    overline: '',
    heading: '',
    description: '',
    imageUrl: '',
  });
  const [headingSaving, setHeadingSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Flight',
    price: '',
    displayOrder: 0,
  });

  const availableIcons = [
    { value: 'Flight', label: 'Flight (Airplane)' },
    { value: 'AirportShuttle', label: 'Airport Shuttle' },
    { value: 'LocalTaxi', label: 'Local Taxi' },
    { value: 'DirectionsCar', label: 'Directions Car' },
    { value: 'Hotel', label: 'Hotel' },
    { value: 'Park', label: 'Park (National Parks)' },
    { value: 'Explore', label: 'Explore (Tours)' },
    { value: 'DriveEta', label: 'Drive Eta' },
    { value: 'LocalShipping', label: 'Local Shipping' },
    { value: 'TwoWheeler', label: 'Two Wheeler' },
  ];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchServices();
      fetchSectionHeading();
    }
  }, [session]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/cms/services');
      const data = await response.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionHeading = async () => {
    try {
      const response = await fetch('/api/cms/section-headings?section=services');
      const data = await response.json();
      if (data.success && data.data) {
        setSectionHeading({
          overline: data.data.overline || '',
          heading: data.data.heading || '',
          description: data.data.description || '',
          imageUrl: data.data.image_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching section heading:', error);
    }
  };

  const handleSaveSectionHeading = async () => {
    setHeadingSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/cms/section-headings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey: 'services',
          ...sectionHeading,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Section heading updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update section heading' });
      }
    } catch (error) {
      console.error('Error saving section heading:', error);
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setHeadingSaving(false);
    }
  };

  const handleOpenDialog = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        price: service.price || '',
        displayOrder: service.display_order || 0,
      });
    } else {
      setEditingService(null);
      setFormData({ title: '', description: '', icon: 'Flight', price: '', displayOrder: services.length });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingService(null);
    setFormData({ title: '', description: '', icon: 'Flight', price: '', displayOrder: 0 });
  };

  const handleMoveUp = async (service, index) => {
    if (index === 0) return;
    
    const newServices = [...services];
    [newServices[index - 1], newServices[index]] = [newServices[index], newServices[index - 1]];
    
    await updateServiceOrder(newServices);
  };

  const handleMoveDown = async (service, index) => {
    if (index === services.length - 1) return;
    
    const newServices = [...services];
    [newServices[index], newServices[index + 1]] = [newServices[index + 1], newServices[index]];
    
    await updateServiceOrder(newServices);
  };

  const updateServiceOrder = async (orderedServices) => {
    try {
      const updates = orderedServices.map((service, index) => ({
        id: service.id,
        displayOrder: index,
      }));

      const response = await fetch('/api/cms/services/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: updates }),
      });

      const data = await response.json();
      if (data.success) {
        setServices(orderedServices);
        setMessage({ type: 'success', text: 'Service order updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update order' });
      }
    } catch (error) {
      console.error('Error updating service order:', error);
      setMessage({ type: 'error', text: 'Failed to update service order' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const url = editingService
        ? `/api/cms/services/${editingService.id}`
        : '/api/cms/services';
      const method = editingService ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          displayOrder: formData.displayOrder,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({
          type: 'success',
          text: editingService ? 'Service updated successfully!' : 'Service created successfully!',
        });
        fetchServices();
        handleCloseDialog();
      } else {
        setMessage({ type: 'error', text: 'Failed to save service' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/cms/services/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Service deleted successfully!' });
        fetchServices();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete service' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Services Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage your service offerings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: 'black', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
        >
          Add Service
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Section Heading & Introduction
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Overline Text"
              value={sectionHeading.overline}
              onChange={(e) => setSectionHeading({ ...sectionHeading, overline: e.target.value })}
              fullWidth
              placeholder="e.g., WE DO MORE"
              helperText="Small text above the main heading"
            />
            <TextField
              label="Main Heading"
              value={sectionHeading.heading}
              onChange={(e) => setSectionHeading({ ...sectionHeading, heading: e.target.value })}
              fullWidth
              placeholder="e.g., THAN YOU WISH"
              helperText="Large heading text"
            />
            <TextField
              label="Description"
              value={sectionHeading.description}
              onChange={(e) => setSectionHeading({ ...sectionHeading, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="e.g., Professional transfer services and exciting national park tours across Kenya..."
              helperText="Introduction text below the heading"
            />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Section Image
              </Typography>
              <ImageUpload
                value={sectionHeading.imageUrl}
                onChange={(url) => setSectionHeading({ ...sectionHeading, imageUrl: url })}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                Upload an image to display on the left side of the services section
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSaveSectionHeading}
                disabled={headingSaving}
                sx={{ bgcolor: 'black', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
              >
                {headingSaving ? 'Saving...' : 'Save Section Heading'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent>
          {!services || services.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                No services yet. Click "Add Service" to create one.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Order</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Icon</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((service, index) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleMoveUp(service, index)}
                            disabled={index === 0}
                            color="primary"
                          >
                            <ArrowUpward fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleMoveDown(service, index)}
                            disabled={index === services.length - 1}
                            color="primary"
                          >
                            <ArrowDownward fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>{service.title}</TableCell>
                      <TableCell>{service.description.substring(0, 50)}...</TableCell>
                      <TableCell>{service.icon}</TableCell>
                      <TableCell>{service.price || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={service.isActive ? 'Active' : 'Inactive'}
                          color={service.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleOpenDialog(service)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(service.id)} color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              multiline
              rows={4}
              fullWidth
            />

            <TextField
              label="Icon"
              select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              required
              fullWidth
              helperText="Select an icon for this service"
            >
              {availableIcons.map((icon) => (
                <MenuItem key={icon.value} value={icon.value}>
                  {icon.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Price (Optional)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              fullWidth
              helperText="e.g., 'From KES 500' or 'Contact for quote'"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingService ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
