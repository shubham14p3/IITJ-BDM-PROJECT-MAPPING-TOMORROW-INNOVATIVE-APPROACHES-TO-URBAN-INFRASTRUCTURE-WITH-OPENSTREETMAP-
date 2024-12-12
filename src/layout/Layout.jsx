import React from 'react';
import { Box } from '@mui/material';
import Footer from '../ui/Footer';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Main Content */}
      <Box sx={{ flex: 1, width: '100%' }}>{children}</Box>
      <Footer />
    </Box>
  );
};

export default Layout;
