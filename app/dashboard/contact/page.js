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
    workingHours: '',
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
      const data = await response.json();
      if (data.success && data.contact) {
        setFormData({
          email: data.contact.email,
          phone: data.contact.phone,
          address: data.contact.address,
          workingHours: data.contact.workingHours,
        });
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/cms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

            <TextField
              label="Working Hours"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              required
              fullWidth
              helperText="e.g., 'Mon-Fri: 8AM-6PM, Sat-Sun: 9AM-5PM'"
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
