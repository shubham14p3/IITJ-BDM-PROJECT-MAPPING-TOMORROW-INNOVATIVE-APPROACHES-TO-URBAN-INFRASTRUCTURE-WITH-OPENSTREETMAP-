import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  TextField,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../ui/Footer';

function Home() {
  const [step, setStep] = useState(0); // 0: Login, 1: Welcome Screen
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    const savedId = 'g23ai2028'; // Hardcoded username
    const savedPassword = 'admin'; // Hardcoded password

    if ((loginId === 'g23ai2087' && loginPassword === 'g23ai2087') ||(loginId === savedId && loginPassword === savedPassword) || (loginId === '' && loginPassword === '') || (loginId === 'g23ai2126' && loginPassword === 'g23ai2126')) {
      setStep(1);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleNext = () => {
    navigate('/data-analysis'); // Navigate to the data analysis component
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #ff9a9e, #fad0c4, #ffd1ff)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          paddingTop: 4,
          paddingBottom: 4,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Login Screen */}
        {step === 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              padding: '1rem',
            }}
          >
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                boxShadow: 8,
                overflow: 'hidden',
                width: '100%',
                maxWidth: '400px',
                padding: 4,
                textAlign: 'center',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img
                  src="https://iitj.ac.in/images/logo/Design-of-New-Logo-of-IITJ-2.png"
                  alt="IITJ Logo"
                  width="80"
                />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Login
              </Typography>
              <TextField
                label="Login ID"
                variant="outlined"
                fullWidth
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Invalid Login ID or Password
                </Alert>
              )}
              <Button
                variant="contained"
                fullWidth
                onClick={handleLogin}
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </Card>
          </Box>
        )}

        {/* Welcome Screen */}
        {step === 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              padding: '1rem',
            }}
          >
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'row',
                borderRadius: 4,
                boxShadow: 8,
                overflow: 'hidden',
                width: '100%',
                maxWidth: '1200px',
                height: 'auto',
                boxSizing: 'border-box',
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#1e3a8a',
                  color: 'white',
                  flex: 1,
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      backgroundColor: 'white',
                      display: 'inline-block',
                      padding: '10px',
                      borderRadius: '8px',
                    }}
                  >
                    <img
                      src="https://iitj.ac.in/images/logo/Design-of-New-Logo-of-IITJ-2.png"
                      alt="IITJ Logo"
                      width="80"
                    />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
                    Indian Institute of Technology Jodhpur
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Date: {new Date().toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Project Report on
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    URBAN MOBILITY AND INFRASTRUCTURE OPTIMIZATION USING OPENSTREETMAP DATA
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 2,
                  p: 6,
                  backgroundColor: '#f0f4c3',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: 'primary.main',
                  }}
                >
                  Welcome to <br />
                  URBAN MOBILITY AND INFRASTRUCTURE OPTIMIZATION USING OPENSTREETMAP DATA
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 4, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                >
                  Start
                </Button>
              </Box>
            </Card>
          </Box>
        )}
      </Box>

      <Footer />
    </Box>
  );
}

export default Home;
