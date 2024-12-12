import React from 'react';
import { Box, Typography, Grid, Link, IconButton } from '@mui/material';
import { GitHub, LinkedIn, Facebook, Instagram } from '@mui/icons-material';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#f0f0f0',
        width: '100%',
        padding: '0.5rem 2rem',
        borderTop: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Left Section: Logo and Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '0.2rem',
            borderRadius: '5px',
          }}
        >
          <img
            src="https://iitj.ac.in/images/logo/Design-of-New-Logo-of-IITJ-2.png"
            alt="IITJ Logo"
            width="40"
          />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'gray' }}>
          © 2024 Urban Mobility and Infrastructure Optimization
        </Typography>
      </Box>

      {/* Right Section: Contributors and Social Links */}
      <Box
      sx={{
        marginRight: '10%',
      }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          Contributors:
        </Typography>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid item>
            <Typography variant="body2">Shubham Raj</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton href="https://github.com/shubham14p3" target="_blank" color="inherit">
                <GitHub />
              </IconButton>
              <IconButton href="https://linkedin.com/in/shubham14p3" target="_blank" color="inherit">
                <LinkedIn />
              </IconButton>
              <IconButton href="https://facebook.com/shubham14p3" target="_blank" color="inherit">
                <Facebook />
              </IconButton>
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="body2">Bhagchandani Niraj</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton href="https://github.com/bhagchandaniniraj" target="_blank" color="inherit">
                <GitHub />
              </IconButton>
              <IconButton href="https://linkedin.com/in/niraj-bhagchandani-218280201" target="_blank" color="inherit">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="body2">Bhavesh Arora</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton href="https://github.com/bhavesharora02" target="_blank" color="inherit">
                <GitHub />
              </IconButton>
              <IconButton href="https://linkedin.com/in/bhavesh-arora-11b0a319b" target="_blank" color="inherit">
                <LinkedIn />
              </IconButton>
              <IconButton href="https://www.instagram.com/bhavesharora02/" target="_blank" color="inherit">
                <Instagram />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Footer;
