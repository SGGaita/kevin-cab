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
  Divider,
  Grid,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';

export default function ContactInfoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    whatsappNumber: '',
    headingText: '',
    subtitleText: '',
    bookingFormHeading: '',
    bookingFormSubtitle: '',
  });
  const [workingHours, setWorkingHours] = useState({
    monday: { open: '08:00', close: '18:00', closed: false },
    tuesday: { open: '08:00', close: '18:00', closed: false },
    wednesday: { open: '08:00', close: '18:00', closed: false },
    thursday: { open: '08:00', close: '18:00', closed: false },
    friday: { open: '08:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '17:00', closed: false },
    sunday: { open: '09:00', close: '17:00', closed: false },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchContactInfo();
    }
  }, [session]);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/cms/contact');
      const result = await response.json();
      if (result.success && result.data) {
        setFormData({
          email: result.data.email || '',
          phone: result.data.phone || '',
          address: result.data.address || '',
          whatsappNumber: result.data.whatsapp_number || '',
          headingText: result.data.heading_text || '',
          subtitleText: result.data.subtitle_text || '',
          bookingFormHeading: result.data.booking_form_heading || '',
          bookingFormSubtitle: result.data.booking_form_subtitle || '',
        });
        
        if (result.data.working_hours) {
          try {
            const hours = typeof result.data.working_hours === 'string' 
              ? JSON.parse(result.data.working_hours) 
              : result.data.working_hours;
            if (hours && typeof hours === 'object') {
              setWorkingHours(hours);
            }
          } catch (e) {
            console.error('Error parsing working hours:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkingHoursChange = (day, field, value) => {
    setWorkingHours({
      ...workingHours,
      [day]: {
        ...workingHours[day],
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/cms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          workingHours: workingHours,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Contact information updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update contact information' });
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
          Contact Information
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Manage your business contact details
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
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              fullWidth
              helperText="Primary contact email"
            />

            <TextField
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              fullWidth
              helperText="Primary contact phone number"
            />

            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              multiline
              rows={3}
              fullWidth
              helperText="Physical business address"
            />

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Working Hours
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Set opening and closing times for each day of the week
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.entries(workingHours).map(([day, hours]) => (
                  <Card key={day} sx={{ bgcolor: '#f5f5f5', boxShadow: 'none' }}>
                    <CardContent sx={{ py: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2.5}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize', minWidth: '100px' }}>
                            {day}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} sm={3}>
                          <TextField
                            label="Open"
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleWorkingHoursChange(day, 'open', e.target.value)}
                            disabled={hours.closed}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={5} sm={3}>
                          <TextField
                            label="Close"
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleWorkingHoursChange(day, 'close', e.target.value)}
                            disabled={hours.closed}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={2} sm={3.5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            variant={hours.closed ? 'outlined' : 'contained'}
                            color={hours.closed ? 'primary' : 'error'}
                            onClick={() => handleWorkingHoursChange(day, 'closed', !hours.closed)}
                            size="small"
                            sx={{ minWidth: '90px' }}
                          >
                            {hours.closed ? 'Closed' : 'Open'}
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <TextField
              label="WhatsApp Number"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              fullWidth
              helperText="WhatsApp contact number (e.g., 254716406998)"
            />

            <TextField
              label="Contact Section Heading"
              value={formData.headingText}
              onChange={(e) => setFormData({ ...formData, headingText: e.target.value })}
              fullWidth
              helperText="Main heading for contact section"
            />

            <TextField
              label="Contact Section Subtitle"
              value={formData.subtitleText}
              onChange={(e) => setFormData({ ...formData, subtitleText: e.target.value })}
              fullWidth
              helperText="Subtitle for contact section"
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Booking Form Content
            </Typography>

            <TextField
              label="Booking Form Heading"
              value={formData.bookingFormHeading}
              onChange={(e) => setFormData({ ...formData, bookingFormHeading: e.target.value })}
              fullWidth
              helperText="Main heading for booking form (e.g., 'Instant Booking')"
            />

            <TextField
              label="Booking Form Subtitle"
              value={formData.bookingFormSubtitle}
              onChange={(e) => setFormData({ ...formData, bookingFormSubtitle: e.target.value })}
              fullWidth
              helperText="Subtitle for booking form (e.g., 'Available 24/7 across all 47 counties.')"
            />

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
