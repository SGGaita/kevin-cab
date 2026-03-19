'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Divider,
  CircularProgress,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Close,
  WhatsApp,
  Settings as SettingsIcon,
  Message,
  Preview,
} from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';

const triggerEvents = [
  { value: 'booking_pending', label: 'Booking Received (Pending)', color: '#FF9800' },
  { value: 'booking_confirmed', label: 'Booking Confirmed', color: '#2196F3' },
  { value: 'booking_completed', label: 'Booking Completed', color: '#4CAF50' },
  { value: 'booking_cancelled', label: 'Booking Cancelled', color: '#F44336' },
];

const placeholders = [
  '{{customerName}}',
  '{{customerPhone}}',
  '{{pickupLocation}}',
  '{{destination}}',
  '{{serviceType}}',
  '{{bookingDate}}',
  '{{businessPhone}}',
  '{{driverName}}',
  '{{driverPhone}}',
];

export default function WhatsAppTemplatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings] = useState({
    businessPhone: '',
    apiProvider: 'whatsapp_web',
    autoSendEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    triggerEvent: 'booking_confirmed',
    messageTemplate: '',
    isActive: true,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchTemplates();
      fetchSettings();
    }
  }, [session]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/whatsapp/templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/whatsapp/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleOpenDialog = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        triggerEvent: template.triggerEvent,
        messageTemplate: template.messageTemplate,
        isActive: template.isActive,
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: '',
        triggerEvent: 'booking_confirmed',
        messageTemplate: '',
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTemplate(null);
  };

  const handleSaveTemplate = async () => {
    setSaving(true);
    try {
      const url = editingTemplate
        ? `/api/whatsapp/templates/${editingTemplate.id}`
        : '/api/whatsapp/templates';
      const method = editingTemplate ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchTemplates();
        handleCloseDialog();
        setSnackbar({
          open: true,
          message: `Template ${editingTemplate ? 'updated' : 'created'} successfully!`,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to save template',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error saving template:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/whatsapp/templates/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTemplates();
        setSnackbar({
          open: true,
          message: 'Template deleted successfully!',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to delete template',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred',
        severity: 'error',
      });
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/whatsapp/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Settings saved successfully!',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to save settings',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const insertPlaceholder = (placeholder) => {
    setFormData({
      ...formData,
      messageTemplate: formData.messageTemplate + placeholder,
    });
  };

  const getPreviewMessage = () => {
    let message = formData.messageTemplate;
    const sampleData = {
      '{{customerName}}': 'John Doe',
      '{{customerPhone}}': '+254712345678',
      '{{pickupLocation}}': 'Nairobi CBD',
      '{{destination}}': 'Jomo Kenyatta Airport',
      '{{serviceType}}': 'Airport Transfer',
      '{{bookingDate}}': new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      '{{businessPhone}}': settings.businessPhone || '+254716406998',
      '{{driverName}}': 'Kevin',
      '{{driverPhone}}': '+254700000000',
    };

    Object.keys(sampleData).forEach(key => {
      message = message.replace(new RegExp(key, 'g'), sampleData[key]);
    });

    return message;
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <WhatsApp sx={{ fontSize: 32, color: '#25D366' }} />
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
            WhatsApp Notifications
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.05rem' }}>
          Manage automated WhatsApp message templates for booking notifications
        </Typography>
      </Box>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab icon={<Message />} label="Message Templates" iconPosition="start" />
        <Tab icon={<SettingsIcon />} label="Settings" iconPosition="start" />
      </Tabs>

      {activeTab === 0 && (
        <>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: '#25D366',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#128C7E',
                },
              }}
            >
              Create Template
            </Button>
          </Box>

          <Grid container spacing={3}>
            {templates.map((template) => {
              const event = triggerEvents.find(e => e.value === template.triggerEvent);
              return (
                <Grid item xs={12} md={6} key={template.id}>
                  <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {template.name}
                          </Typography>
                          <Chip
                            label={event?.label || template.triggerEvent}
                            size="small"
                            sx={{
                              bgcolor: event?.color ? `${event.color}20` : '#E0E0E0',
                              color: event?.color || '#666',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>
                        <Box>
                          <IconButton size="small" onClick={() => handleOpenDialog(template)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteTemplate(template.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: '#F5F5F5',
                          p: 2,
                          borderRadius: 2,
                          maxHeight: 200,
                          overflow: 'auto',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {template.messageTemplate}
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={template.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={template.isActive ? 'success' : 'default'}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Updated: {new Date(template.updatedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      {activeTab === 1 && (
        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              WhatsApp Configuration
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Business Phone Number"
                value={settings.businessPhone}
                onChange={(e) => setSettings({ ...settings, businessPhone: e.target.value })}
                fullWidth
                helperText="Include country code (e.g., 254716406998)"
              />

              <TextField
                select
                label="API Provider"
                value={settings.apiProvider}
                onChange={(e) => setSettings({ ...settings, apiProvider: e.target.value })}
                fullWidth
                helperText="Choose how WhatsApp messages are sent"
              >
                <MenuItem value="whatsapp_web">WhatsApp Web (Manual)</MenuItem>
                <MenuItem value="twilio">Twilio API</MenuItem>
                <MenuItem value="whatsapp_business_api">WhatsApp Business API</MenuItem>
              </TextField>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoSendEnabled}
                    onChange={(e) => setSettings({ ...settings, autoSendEnabled: e.target.checked })}
                  />
                }
                label="Auto-send messages (requires API integration)"
              />

              <Alert severity="info">
                <Typography variant="body2">
                  <strong>WhatsApp Web:</strong> Opens WhatsApp Web with pre-filled message (requires manual send)
                  <br />
                  <strong>API Integration:</strong> Automatically sends messages (requires API credentials)
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleSaveSettings}
                  disabled={saving}
                  sx={{
                    bgcolor: 'black',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 4,
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.8)',
                    },
                  }}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Template Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />

            <TextField
              select
              label="Trigger Event"
              value={formData.triggerEvent}
              onChange={(e) => setFormData({ ...formData, triggerEvent: e.target.value })}
              fullWidth
              required
            >
              {triggerEvents.map((event) => (
                <MenuItem key={event.value} value={event.value}>
                  {event.label}
                </MenuItem>
              ))}
            </TextField>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Available Placeholders
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {placeholders.map((placeholder) => (
                  <Chip
                    key={placeholder}
                    label={placeholder}
                    size="small"
                    onClick={() => insertPlaceholder(placeholder)}
                    sx={{ cursor: 'pointer', fontFamily: 'monospace' }}
                  />
                ))}
              </Box>
            </Box>

            <TextField
              label="Message Template"
              value={formData.messageTemplate}
              onChange={(e) => setFormData({ ...formData, messageTemplate: e.target.value })}
              multiline
              rows={10}
              fullWidth
              required
              helperText="Click placeholders above to insert them into your message"
            />

            <Button
              startIcon={<Preview />}
              onClick={() => setPreviewOpen(true)}
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            >
              Preview Message
            </Button>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#666', fontWeight: 600, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveTemplate}
            disabled={saving || !formData.name || !formData.messageTemplate}
            sx={{
              bgcolor: '#25D366',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              '&:hover': {
                bgcolor: '#128C7E',
              },
            }}
          >
            {saving ? 'Saving...' : 'Save Template'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Message Preview
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            sx={{
              bgcolor: '#E5DDD5',
              p: 2,
              borderRadius: 2,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                bgcolor: '#DCF8C6',
                p: 2,
                borderRadius: 2,
                maxWidth: '80%',
                ml: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {getPreviewMessage()}
            </Box>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            This is a preview with sample data. Actual messages will use real booking information.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

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
