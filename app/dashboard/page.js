'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  BookOnline,
  CheckCircle,
  MiscellaneousServices,
  Schedule,
  ArrowForward,
  Edit,
  Settings,
  Share,
  ContactMail,
  Info,
  Article as ArticleIcon,
  Collections,
  RateReview,
  BarChart,
  AccountCircle,
  People,
} from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalServices: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchStats();
      fetchRecentBookings();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const response = await fetch('/api/bookings?limit=5');
      const data = await response.json();
      if (data.success) {
        setRecentBookings(data.bookings.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <BookOnline sx={{ fontSize: 28 }} />,
      color: '#666666',
      bgColor: '#F5F5F5',
      trend: '+12%',
      trendUp: true,
      subtitle: 'All time',
    },
    {
      title: 'Pending',
      value: stats.pendingBookings,
      icon: <Schedule sx={{ fontSize: 28 }} />,
      color: '#666666',
      bgColor: '#F5F5F5',
      trend: stats.pendingBookings > 0 ? 'Needs attention' : 'All clear',
      trendUp: false,
      subtitle: 'Awaiting confirmation',
    },
    {
      title: 'Completed',
      value: stats.completedBookings,
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
      color: '#666666',
      bgColor: '#F5F5F5',
      trend: '+8%',
      trendUp: true,
      subtitle: 'This month',
    },
    {
      title: 'Active Services',
      value: stats.totalServices,
      icon: <MiscellaneousServices sx={{ fontSize: 28 }} />,
      color: '#666666',
      bgColor: '#F5F5F5',
      trend: 'Live',
      trendUp: true,
      subtitle: 'Service offerings',
    },
  ];

  // Define all available quick actions - Top 4 most important for admin
  const allQuickActions = [
    {
      title: 'Manage Bookings',
      description: 'View and update customer bookings',
      icon: <BookOnline sx={{ fontSize: 28 }} />,
      color: '#FFD700',
      path: '/dashboard/bookings',
      roles: ['admin', 'driver'], // Available to both admin and driver
    },
    {
      title: 'Manage Services',
      description: 'Add or edit service offerings',
      icon: <MiscellaneousServices sx={{ fontSize: 28 }} />,
      color: '#2196F3',
      path: '/dashboard/services',
      roles: ['admin'], // Admin only
    },
    {
      title: 'Contact Info',
      description: 'Update contact details & hours',
      icon: <ContactMail sx={{ fontSize: 28 }} />,
      color: '#FF5722',
      path: '/dashboard/contact',
      roles: ['admin'], // Admin only
    },
    {
      title: 'Account Settings',
      description: 'Manage profile & password',
      icon: <AccountCircle sx={{ fontSize: 28 }} />,
      color: '#795548',
      path: '/dashboard/account',
      roles: ['admin', 'driver'], // Available to both admin and driver
    },
  ];

  // Filter quick actions based on user role (case-insensitive)
  const userRole = session?.user?.role?.toLowerCase() || 'driver';
  const quickActions = allQuickActions.filter(action => 
    action.roles.includes(userRole)
  );

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

  const completionRate = stats.totalBookings > 0 
    ? Math.round((stats.completedBookings / stats.totalBookings) * 100) 
    : 0;

  return (
    <DashboardLayout session={session}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: -1, color: '#1a1a1a' }}>
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', fontSize: '1rem', fontWeight: 400 }}>
              Welcome back, <Box component="span" sx={{ fontWeight: 600, color: '#333' }}>{session.user.name || session.user.email}</Box>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Today
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mb: 6 }}>
        {statCards.map((stat, index) => (
          <Card
            key={index}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', lg: '1 1 calc(25% - 15px)' },
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              background: 'white',
              border: '1px solid #f0f0f0',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transform: 'translateY(-2px)',
                borderColor: '#e0e0e0',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)',
                    color: '#333',
                    p: 1.5,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  {stat.icon}
                </Box>
                <Chip
                  label={stat.trend}
                  size="small"
                  sx={{
                    bgcolor: stat.trendUp ? 'rgba(34, 197, 94, 0.1)' : 'rgba(251, 146, 60, 0.1)',
                    color: stat.trendUp ? '#16a34a' : '#ea580c',
                    fontWeight: '600',
                    fontSize: '0.7rem',
                    border: 'none',
                    height: '24px',
                    px: 1.5,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#999', mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
                {stat.title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: -1, color: '#1a1a1a' }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem', fontWeight: 400 }}>
                {stat.subtitle}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Performance Overview */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', mb: 6, border: '1px solid #f0f0f0' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1a1a1a', fontSize: '1.1rem' }}>
            Performance Overview
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Booking Completion Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={completionRate} 
                  sx={{ 
                    flex: 1, 
                    height: 10, 
                    borderRadius: 5,
                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#4CAF50',
                      borderRadius: 5,
                    },
                  }} 
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', minWidth: 50 }}>
                  {completionRate}%
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Service Availability
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.totalServices > 0 ? 100 : 0} 
                  sx={{ 
                    flex: 1, 
                    height: 10, 
                    borderRadius: 5,
                    bgcolor: 'rgba(33, 150, 243, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#2196F3',
                      borderRadius: 5,
                    },
                  }} 
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', minWidth: 50 }}>
                  {stats.totalServices > 0 ? '100%' : '0%'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Latest Bookings */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', mb: 6, border: '1px solid #f0f0f0' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#1a1a1a', fontSize: '1.1rem' }}>
                Latest Bookings
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem' }}>
                Recent customer reservations
              </Typography>
            </Box>
            <Button
              endIcon={<ArrowForward />}
              onClick={() => router.push('/dashboard/bookings')}
              sx={{
                color: 'black',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              View All
            </Button>
          </Box>

          {recentBookings.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                No bookings yet
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Route</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow 
                      key={booking.id}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.02)',
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{booking.customerName}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{booking.customerPhone}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {booking.pickupLocation}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          → {booking.destination}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {booking.serviceType}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {new Date(booking.bookingDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            fontSize: '0.7rem',
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
                          onClick={() => router.push('/dashboard/bookings')}
                          sx={{ 
                            color: '#666',
                            '&:hover': {
                              bgcolor: 'rgba(0,0,0,0.04)',
                            },
                          }}
                        >
                          <ArrowForward fontSize="small" />
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

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a', fontSize: '1.25rem' }}>
          Quick Actions
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 3, fontSize: '0.9rem' }}>
          Manage your website content and settings
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
        {quickActions.map((action, index) => (
          <Card
            key={index}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', lg: '1 1 calc(33.333% - 14px)' },
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)',
                borderColor: action.color,
                '& .action-arrow': {
                  transform: 'translateX(4px)',
                },
              },
            }}
            onClick={() => router.push(action.path)}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: 3 }}>
                <Box
                  sx={{
                    bgcolor: `${action.color}12`,
                    color: action.color,
                    p: 1.5,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: `0 2px 8px ${action.color}20`,
                  }}
                >
                  {action.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1rem', color: '#1a1a1a' }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {action.description}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: action.color }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  Manage
                </Typography>
                <ArrowForward className="action-arrow" sx={{ fontSize: 16, transition: 'transform 0.25s' }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </DashboardLayout>
  );
}
