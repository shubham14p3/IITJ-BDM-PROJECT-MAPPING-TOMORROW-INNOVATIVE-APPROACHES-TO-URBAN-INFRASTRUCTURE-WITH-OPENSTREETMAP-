import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../ui/Footer';

function Home() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

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
        overflow: 'hidden', // Ensure no overflow causes scrollbars
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1, // Ensures the content area takes remaining space
          paddingTop: 4, // Add padding at the top
          paddingBottom: 4, // Add padding at the bottom for space with footer
          width: '100%', // Ensure the content takes full width
          boxSizing: 'border-box', // Prevent padding from affecting the width
        }}
      >
        {step === 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%', // Take full width
              padding: '1rem',
              overflow: 'hidden', // Ensure no scrollbars
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
                height: 'auto', // Adjust the height based on content
                boxSizing: 'border-box', // Consider padding in width and height calculations
              }}
            >
              {/* Left Side with IITJ Info */}
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
                      backgroundColor: 'white', // White background for the logo
                      display: 'inline-block',  // Ensure the background fits around the logo
                      padding: '10px',          // Add padding around the logo
                      borderRadius: '8px',      // Optional: Rounded corners for the background
                    }}
                  >
                    <img
                      src="https://iitj.ac.in/images/logo/Design-of-New-Logo-of-IITJ-2.png"
                      alt="IITJ Logo"
                      width="80"
                    />
                  </Box>

                  {/* IITJ Information */}
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
                    Indian Institute of Technology Jodhpur
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Date: {new Date().toLocaleDateString()}
                  </Typography>
                  <br />
                  <Typography variant="body2">Project Report on</Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    URBAN MOBILITY AND INFRASTRUCTURE OPTIMIZATION USING OPENSTREETMAP DATA
                  </Typography>

                </Box>
              </Box>

              {/* Right Side with Welcome Message and Button */}
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
                <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
                  Welcome to <br />URBAN MOBILITY AND INFRASTRUCTURE OPTIMIZATION USING OPENSTREETMAP DATA
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

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Home;
