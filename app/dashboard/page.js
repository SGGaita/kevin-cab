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

  const quickActions = [
    {
      title: 'Manage Bookings',
      description: 'View and update customer bookings',
      icon: <BookOnline sx={{ fontSize: 28 }} />,
      color: '#FFD700',
      path: '/dashboard/bookings',
    },
    {
      title: 'Edit Hero Section',
      description: 'Update homepage banner content',
      icon: <ArticleIcon sx={{ fontSize: 28 }} />,
      color: '#9C27B0',
      path: '/dashboard/hero',
    },
    {
      title: 'Manage Services',
      description: 'Add or edit service offerings',
      icon: <MiscellaneousServices sx={{ fontSize: 28 }} />,
      color: '#2196F3',
      path: '/dashboard/services',
    },
    {
      title: 'About Section',
      description: 'Edit company information',
      icon: <Info sx={{ fontSize: 28 }} />,
      color: '#00BCD4',
      path: '/dashboard/about',
    },
    {
      title: 'Contact Info',
      description: 'Update contact details',
      icon: <ContactMail sx={{ fontSize: 28 }} />,
      color: '#FF5722',
      path: '/dashboard/contact',
    },
    {
      title: 'Social Media',
      description: 'Manage social links',
      icon: <Share sx={{ fontSize: 28 }} />,
      color: '#E91E63',
      path: '/dashboard/social',
    },
    {
      title: 'Site Settings',
      description: 'Configure branding & colors',
      icon: <Settings sx={{ fontSize: 28 }} />,
      color: '#607D8B',
      path: '/dashboard/settings',
    },
  ];

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
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: -0.5 }}>
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
              Welcome back, <strong>{session.user.name || session.user.email}</strong>
            </Typography>
          </Box>
          <Chip 
            label={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            sx={{ 
              bgcolor: 'black', 
              color: 'white', 
              fontWeight: 'bold',
              px: 2,
              py: 2.5,
              fontSize: '0.9rem',
            }}
          />
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 5 }}>
        {statCards.map((stat, index) => (
          <Card
            key={index}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(25% - 18px)' },
              borderRadius: 3,
              boxShadow: 'none',
              background: 'white',
              border: '1px solid #E0E0E0',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderColor: '#BDBDBD',
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box
                  sx={{
                    background: stat.bgColor,
                    color: stat.color,
                    p: 1.2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {stat.icon}
                </Box>
                <Chip
                  label={stat.trend}
                  size="small"
                  sx={{
                    bgcolor: stat.trendUp ? 'rgba(76, 175, 80, 0.08)' : 'rgba(255, 152, 0, 0.08)',
                    color: stat.trendUp ? '#66BB6A' : '#FFA726',
                    fontWeight: '600',
                    fontSize: '0.7rem',
                    border: `1px solid ${stat.trendUp ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)'}`,
                    height: '22px',
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#9E9E9E', mb: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                {stat.title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.3, letterSpacing: -0.5, color: '#212121' }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ color: '#BDBDBD', fontSize: '0.7rem' }}>
                {stat.subtitle}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Performance Overview */}
      <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 5, border: '1px solid rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
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
      <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 5, border: '1px solid rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Latest Bookings
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          Quick Actions
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Manage your website content and settings
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {quickActions.map((action, index) => (
          <Card
            key={index}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' },
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)',
                borderColor: action.color,
              },
            }}
            onClick={() => router.push(action.path)}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: `${action.color}15`,
                    color: action.color,
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {action.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                    {action.description}
                  </Typography>
                </Box>
              </Box>
              <Button
                endIcon={<ArrowForward />}
                sx={{
                  color: action.color,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  p: 0,
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }}
              >
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </DashboardLayout>
  );
}
