'use client';

import { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Card, CardContent } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

export default function BookingForm() {
  const [formStatus, setFormStatus] = useState('idle');
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    pickupLocation: '',
    destination: '',
    bookingDate: '',
    serviceType: 'Economy (4 Seater)',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const whatsappMessage = `*New Booking Request*\n\n` +
          `*Customer:* ${formData.customerName}\n` +
          `*Phone:* ${formData.customerPhone}\n` +
          `*Pickup:* ${formData.pickupLocation}\n` +
          `*Destination:* ${formData.destination}\n` +
          `*Date:* ${formData.bookingDate}\n` +
          `*Service Type:* ${formData.serviceType}\n` +
          `\n` +
          `_Please acknowledge receipt of this trip._`;
        
        const whatsappUrl = `https://wa.me/254716406998?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');

        setFormStatus('success');
        setFormData({
          customerName: '',
          customerPhone: '',
          pickupLocation: '',
          destination: '',
          bookingDate: '',
          serviceType: 'Economy (4 Seater)',
        });
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setFormStatus('error');
    }
  };

  if (formStatus === 'success') {
    return (
      <Card sx={{ borderRadius: 0, boxShadow: 3, border: '2px solid', borderColor: 'secondary.main' }}>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              bgcolor: '#f5f5f5',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <CheckCircle sx={{ fontSize: 40, color: 'secondary.dark' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Booking Received!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            A dispatcher will contact you within 5 minutes to confirm your ride and driver details.
          </Typography>
          <Button
            onClick={() => setFormStatus('idle')}
            sx={{ color: 'secondary.dark', fontWeight: 'bold' }}
          >
            Book another ride
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 0, boxShadow: 3, border: '2px solid', borderColor: 'secondary.main' }}>
      <CardContent sx={{ p: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: 5, pb: 3, borderBottom: '2px solid', borderColor: 'secondary.main' }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: -1 }}>
            Instant Booking
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
            Available 24/7 across all 47 counties.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <TextField
                label="Full Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <TextField
                label="Phone Number"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                fullWidth
                placeholder="07XX XXX XXX"
                variant="outlined"
              />
            </Box>
          </Box>

          <TextField
            label="Pickup Location"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
            fullWidth
            placeholder="Enter pickup address"
            variant="outlined"
          />

          <TextField
            label="Destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            fullWidth
            placeholder="Where are you going?"
            variant="outlined"
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <TextField
                label="Date"
                name="bookingDate"
                type="date"
                value={formData.bookingDate}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <TextField
                label="Service Type"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                select
                required
                fullWidth
                variant="outlined"
              >
                <MenuItem value="Economy (4 Seater)">Economy (4 Seater)</MenuItem>
                <MenuItem value="SUV (6 Seater)">SUV (6 Seater)</MenuItem>
                <MenuItem value="Executive">Executive</MenuItem>
                <MenuItem value="Airport Van">Airport Van</MenuItem>
              </TextField>
            </Box>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={formStatus === 'sending'}
            sx={{
              py: 2.5,
              bgcolor: 'secondary.main',
              color: 'black',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              borderRadius: 0,
              boxShadow: '0 4px 14px rgba(255, 193, 7, 0.3)',
              '&:hover': { bgcolor: 'secondary.dark', boxShadow: '0 6px 20px rgba(255, 193, 7, 0.4)' },
            }}
          >
            {formStatus === 'sending' ? 'Processing...' : 'Request Quote & Book'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
