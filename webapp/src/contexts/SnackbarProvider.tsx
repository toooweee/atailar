import React, { createContext, type ReactNode, useContext, useState } from 'react';
import { Snackbar, Alert, type AlertProps } from '@mui/material';

interface SnackbarMessage {
  message: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
}

interface SnackbarContextType {
  showMessage: (msg: SnackbarMessage) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertProps['severity']>('error');

  const showMessage = (msg: SnackbarMessage) => {
    setMessage(msg.message);
    setSeverity(msg.severity || 'error');
    setOpen(true);
  };

  const handleClose = (reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => handleClose()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => handleClose()} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};
