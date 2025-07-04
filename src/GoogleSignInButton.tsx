// GoogleSignInButton.tsx
import React from 'react';
import Button from '@mui/material/Button';
import { GoogleIcon } from './components/CustomIcons';
import { useNavigate } from 'react-router-dom';

const GoogleSignInButton = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    // Open Google OAuth in a popup
    const popup = window.open(
      'http://localhost:6008/auth/google',
      'GoogleAuth',
      'width=500,height=600'
    );
    
    // Check for auth completion
    const checkAuth = setInterval(async () => {
      if (popup?.closed) {
        clearInterval(checkAuth);
        try {
          const response = await fetch('http://localhost:6008/auth/status', {
            credentials: 'include'
          });
          const data = await response.json();
          
          if (data.isAuthenticated) {
            navigate('/dashboard'); // Redirect to dashboard after successful auth
          }
        } catch (err) {
          console.error('Auth check failed:', err);
        }
      }
    }, 500);
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={handleGoogleSignIn}
      startIcon={<GoogleIcon />}
    >
      Sign up with Google
    </Button>
  );
};

export default GoogleSignInButton;