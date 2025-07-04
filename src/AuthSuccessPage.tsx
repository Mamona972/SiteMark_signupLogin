// AuthSuccessPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box } from '@mui/material';

const AuthSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:6008/auth/status', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.isAuthenticated) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Authenticating...
      </Typography>
    </Box>
  );
};

export default AuthSuccessPage;