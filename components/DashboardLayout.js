'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  BookOnline,
  Article,
  Info,
  MiscellaneousServices,
  ContactMail,
  Share,
  Settings,
  Logout,
  DirectionsCar,
  Collections,
  RateReview,
  BarChart,
  AccountCircle,
  People,
  WhatsApp,
  Person,
  LockReset,
  Badge,
} from '@mui/icons-material';

const drawerWidth = 260;

const allMenuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['driver', 'admin'] },
  { text: 'Bookings', icon: <BookOnline />, path: '/dashboard/bookings', roles: ['driver', 'admin'] },
  { text: 'WhatsApp Templates', icon: <WhatsApp />, path: '/dashboard/whatsapp-templates', roles: ['driver', 'admin'] },
  { text: 'Hero Section', icon: <Article />, path: '/dashboard/hero', roles: ['admin'] },
  { text: 'About Section', icon: <Info />, path: '/dashboard/about', roles: ['admin'] },
  { text: 'Services', icon: <MiscellaneousServices />, path: '/dashboard/services', roles: ['admin'] },
  { text: 'Gallery', icon: <Collections />, path: '/dashboard/gallery', roles: ['admin'] },
  { text: 'Testimonials', icon: <RateReview />, path: '/dashboard/testimonials', roles: ['admin'] },
  { text: 'Stats Bar', icon: <BarChart />, path: '/dashboard/stats', roles: ['admin'] },
  { text: 'Contact Info', icon: <ContactMail />, path: '/dashboard/contact', roles: ['driver', 'admin'] },
  { text: 'Social Media', icon: <Share />, path: '/dashboard/social', roles: ['driver', 'admin'] },
  { text: 'Site Settings', icon: <Settings />, path: '/dashboard/settings', roles: ['admin'] },
  { text: 'User Management', icon: <People />, path: '/dashboard/users', roles: ['admin'] },
  { text: 'Account Settings', icon: <AccountCircle />, path: '/dashboard/account', roles: ['driver', 'admin'] },
];

export default function DashboardLayout({ children, session }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [firstLoginDialogOpen, setFirstLoginDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    role: session?.user?.role || 'driver',
    firstLogin: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('DashboardLayout - Fetching user data...');
        const response = await fetch('/api/user/me');
        const result = await response.json();
        console.log('DashboardLayout - API response:', result);
        
        if (result.success && result.user) {
          console.log('DashboardLayout - Setting userData with role:', result.user.role);
          setUserData({
            name: result.user.name || '',
            email: result.user.email || '',
            role: result.user.role || 'driver',
            firstLogin: result.user.firstLogin || false,
          });
          
          if (result.user.firstLogin) {
            setFirstLoginDialogOpen(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  // Filter menu items based on user role (case-insensitive)
  console.log('DashboardLayout - Current userData:', userData);
  console.log('DashboardLayout - Filtering menu for role:', userData.role);
  const userRole = (userData.role || 'driver').toLowerCase();
  const menuItems = allMenuItems.filter(item => 
    item.roles.includes(userRole)
  );
  console.log('DashboardLayout - Normalized role:', userRole);
  console.log('DashboardLayout - Filtered menu items count:', menuItems.length);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!userData.firstLogin && !passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    setSavingPassword(true);

    try {
      const response = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: userData.firstLogin ? undefined : passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          isFirstLogin: userData.firstLogin,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        
        if (userData.firstLogin) {
          setUserData({ ...userData, firstLogin: false });
          setTimeout(() => {
            setFirstLoginDialogOpen(false);
            setPasswordSuccess('');
          }, 1500);
        } else {
          setTimeout(() => {
            setFirstLoginDialogOpen(false);
            setPasswordSuccess('');
          }, 1500);
        }
      } else {
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('An error occurred while changing password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleClosePasswordDialog = () => {
    if (userData.firstLogin) {
      return;
    }
    setFirstLoginDialogOpen(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            bgcolor: 'secondary.main',
            p: 1,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <DirectionsCar sx={{ color: 'black', fontSize: 28 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 900, fontStyle: 'italic', letterSpacing: -0.5 }}>
          KEVINCAB
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'secondary.main',
                  color: 'black',
                  '&:hover': {
                    bgcolor: 'secondary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'black',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'black',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Content Management System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {userData.name || userData.email}
            </Typography>
            <IconButton onClick={handleMenuOpen}>
              <Avatar sx={{ bgcolor: 'secondary.main', color: 'black', width: 36, height: 36 }}>
                {userData.name?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
          <Menu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl)} 
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 240,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {userData.name || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {userData.email}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    bgcolor: userData.role === 'admin' ? '#FFD700' : '#E3F2FD',
                    color: userData.role === 'admin' ? 'black' : '#1976D2',
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.65rem',
                  }}
                >
                  {userData.role}
                </Typography>
              </Box>
            </Box>
            
            <MenuItem 
              onClick={() => {
                handleMenuClose();
                router.push('/dashboard/account');
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Account Settings"
                secondary="Manage your profile"
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </MenuItem>

            <MenuItem 
              onClick={() => {
                handleMenuClose();
                setFirstLoginDialogOpen(true);
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                <LockReset fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Change Password"
                secondary="Update your password"
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                py: 1.5,
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.lighter',
                },
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>

      <Dialog 
        open={firstLoginDialogOpen} 
        onClose={handleClosePasswordDialog}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={userData.firstLogin}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockReset sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {userData.firstLogin ? 'Welcome! Change Your Password' : 'Change Password'}
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {userData.firstLogin && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                First Time Login Detected
              </Typography>
              <Typography variant="body2">
                For security reasons, please change your password before continuing.
              </Typography>
            </Alert>
          )}

          {passwordError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {passwordError}
            </Alert>
          )}

          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {passwordSuccess}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {!userData.firstLogin && (
              <TextField
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                fullWidth
                autoComplete="current-password"
              />
            )}

            <TextField
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              fullWidth
              helperText="Minimum 6 characters"
              autoComplete="new-password"
            />

            <TextField
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              fullWidth
              autoComplete="new-password"
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          {!userData.firstLogin && (
            <Button 
              onClick={handleClosePasswordDialog}
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={savingPassword}
            sx={{
              bgcolor: 'black',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.8)',
              },
            }}
          >
            {savingPassword ? 'Changing Password...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
