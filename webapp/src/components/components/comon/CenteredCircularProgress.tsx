import React from 'react';
import {
  CircularProgress,
  Box, type CircularProgressProps,
} from '@mui/material';

interface CenteredCircularProgressProps extends CircularProgressProps {
  size?: number;
}

const CenteredCircularProgress: React.FC<CenteredCircularProgressProps> = ({
                                                                             size = 40,
                                                                             ...props
                                                                           }) => {
  return (
    <Box
      sx={{
    display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px',
  }}
>
  <CircularProgress size={size} {...props} />
  </Box>
);
};

export default CenteredCircularProgress;
