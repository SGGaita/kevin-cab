'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Pagination,
  InputAdornment,
} from '@mui/material';
import { Edit, Close, CheckCircle, Schedule, Cancel, Phone, LocationOn, Search } from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState({ status: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, limit: 10 });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchBookings();
    }
  }, [session, page, searchTerm]);

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`/api/bookings?${params}`);
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setUpdateData({ status: booking.status, notes: booking.notes || '' });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updateData.status,
          notes: updateData.notes,
          driverId: session?.user?.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await fetchBookings();
        handleCloseDialog();
        
        if (data.whatsapp && data.whatsapp.success) {
          if (data.whatsapp.whatsappUrl && !data.whatsapp.autoSendEnabled) {
            window.open(data.whatsapp.whatsappUrl, '_blank');
          }
          setSnackbar({
            open: true,
            message: 'Booking updated and WhatsApp notification prepared!',
            severity: 'success',
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Booking updated successfully!',
            severity: 'success',
          });
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to update booking',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while updating',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Schedule sx={{ fontSize: 16 }} />;
      case 'confirmed':
        return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'completed':
        return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'cancelled':
        return <Cancel sx={{ fontSize: 16 }} />;
      default:
        return null;
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
          Booking Management
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.05rem' }}>
          View and manage all customer bookings ({pagination.total} total)
        </Typography>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 2.5 }}>
          <TextField
            fullWidth
            placeholder="Search by customer name, phone, location, or service type..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#999' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#FAFAFA',
                '&:hover': {
                  bgcolor: '#F5F5F5',
                },
                '&.Mui-focused': {
                  bgcolor: 'white',
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 0 }}>
          {bookings.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                No bookings yet
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#FAFAFA' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Route</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow 
                      key={booking.id}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.02)',
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{booking.customerName}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Phone sx={{ fontSize: 16, color: '#999' }} />
                          {booking.customerPhone}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                            {booking.pickupLocation}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <LocationOn sx={{ fontSize: 14 }} />
                            {booking.destination}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>{booking.serviceType}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                        {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(booking.status)}
                          label={booking.status}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: 
                              booking.status === 'completed' ? 'rgba(76, 175, 80, 0.1)' :
                              booking.status === 'confirmed' ? 'rgba(33, 150, 243, 0.1)' :
                              booking.status === 'cancelled' ? 'rgba(244, 67, 54, 0.1)' :
                              'rgba(255, 152, 0, 0.1)',
                            color:
                              booking.status === 'completed' ? '#4CAF50' :
                              booking.status === 'confirmed' ? '#2196F3' :
                              booking.status === 'cancelled' ? '#F44336' :
                              '#FF9800',
                            border: `1px solid ${
                              booking.status === 'completed' ? 'rgba(76, 175, 80, 0.3)' :
                              booking.status === 'confirmed' ? 'rgba(33, 150, 243, 0.3)' :
                              booking.status === 'cancelled' ? 'rgba(244, 67, 54, 0.3)' :
                              'rgba(255, 152, 0, 0.3)'
                            }`,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(booking)}
                          sx={{ 
                            color: '#666',
                            '&:hover': {
                              bgcolor: 'rgba(0,0,0,0.04)',
                              color: 'black',
                            },
                          }}
                        >
                          <Edit fontSize="small" />
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

      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 600,
                fontSize: '0.95rem',
              },
              '& .Mui-selected': {
                bgcolor: 'black !important',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.8) !important',
                },
              },
            }}
          />
        </Box>
      )}

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Update Booking
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {selectedBooking && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Booking Details Card */}
              <Card sx={{ bgcolor: '#F5F5F5', boxShadow: 'none', border: '1px solid #E0E0E0' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                    Booking Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                        Customer
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedBooking.customerName}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                        Phone
                      </Typography>
                      <Typography variant="body2">
                        {selectedBooking.customerPhone}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                        Route
                      </Typography>
                      <Typography variant="body2">
                        {selectedBooking.pickupLocation} → {selectedBooking.destination}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                          Service Type
                        </Typography>
                        <Typography variant="body2">
                          {selectedBooking.serviceType}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                          Booking Date
                        </Typography>
                        <Typography variant="body2">
                          {new Date(selectedBooking.bookingDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Update Form */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  select
                  label="Status"
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  fullWidth
                  helperText="Update the booking status"
                >
                  <MenuItem value="pending">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule sx={{ fontSize: 18, color: '#FF9800' }} />
                      Pending
                    </Box>
                  </MenuItem>
                  <MenuItem value="confirmed">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ fontSize: 18, color: '#2196F3' }} />
                      Confirmed
                    </Box>
                  </MenuItem>
                  <MenuItem value="completed">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ fontSize: 18, color: '#4CAF50' }} />
                      Completed
                    </Box>
                  </MenuItem>
                  <MenuItem value="cancelled">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Cancel sx={{ fontSize: 18, color: '#F44336' }} />
                      Cancelled
                    </Box>
                  </MenuItem>
                </TextField>

                <TextField
                  label="Driver Notes"
                  multiline
                  rows={4}
                  value={updateData.notes}
                  onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                  fullWidth
                  placeholder="Add any notes or special instructions..."
                  helperText="Optional notes about this booking"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: '#666',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateBooking}
            disabled={saving}
            sx={{
              bgcolor: 'black',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.8)',
              },
            }}
          >
            {saving ? 'Updating...' : 'Update Booking'}
          </Button>
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
