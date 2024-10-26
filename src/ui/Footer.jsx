import React from 'react';
import { Box, Typography, Grid, Link } from '@mui/material';
import { GitHub, LinkedIn, Facebook } from '@mui/icons-material';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#f0f0f0',
        width: '100%',
        textAlign: 'center',
        padding: '1rem',
        borderTop: '1px solid #ddd',
      }}
    >
      <Typography variant="body2" sx={{ color: 'gray' }}>
        Copyright © 2024. All rights reserved.
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Contributors:
      </Typography>

      <Grid container justifyContent="center" spacing={3} sx={{ mt: 2 }}>
        <Grid item>
          <Typography variant="body2">Shubham Raj</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Link href="https://github.com/shubham14p3" target="_blank">
              <GitHub />
            </Link>
            <Link href="https://linkedin.com/in/shubham14p3" target="_blank">
              <LinkedIn />
            </Link>
            <Link href="https://facebook.com/shubham14p3" target="_blank">
              <Facebook />
            </Link>
          </Box>
        </Grid>
        <Grid item>
          <Typography variant="body2">Bhagchandani Niraj</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Link href="https://github.com/bhagchandaniniraj" target="_blank">
              <GitHub />
            </Link>
            <Link href="https://linkedin.com/in/niraj-bhagchandani-218280201" target="_blank">
              <LinkedIn />
            </Link>
            {/* <Link href="https://facebook.com/nirajbhagchandani" target="_blank" >
              <Facebook />
            </Link> */}
          </Box>
        </Grid>

        {/* Additional contributors */}
        <Grid item>
          <Typography variant="body2">Bhavesh Arora</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Link href="https://github.com/bhavesharora02" target="_blank">
              <GitHub />
            </Link>
            <Link href="https://linkedin.com/in/bhavesh-arora-11b0a319b" target="_blank">
              <LinkedIn />
            </Link>
            <Link href="https://www.instagram.com/bhavesharora02/" target="_blank">
              <Facebook />
            </Link>          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;
