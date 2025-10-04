import { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import RequestTable from '../components/request/RequestTable.tsx';
import type { AccessRequest } from '../../api/accessRequest/types/response/AccessRequest.ts';
import { useLoading } from '../../hooks/useLoading.ts';
import { accessRequestApi } from '../../api/accessRequest/accessRequestApi.ts';
import { useSnackbar } from '../../contexts/SnackbarProvider.tsx';

const RequestPage = () => {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const { loading, withLoading } = useLoading();
  const { showMessage } = useSnackbar();

  useEffect(() => {
    const fetchAccessRequest = async () => {
      try {
        const data = await withLoading(() => accessRequestApi.getAllAccessRequest());
        if (data && data.length > 0) {
          setAccessRequests(data);
        }
      } catch (err: any) {
        showMessage({ message: err.toString(), severity: 'error' });
      }
    };
    fetchAccessRequest();
  }, []);

  const onApprove = async (id: string) => {
    try {
      const updateRequest = await withLoading(() => accessRequestApi.approveAccessRequest(id));
      if (updateRequest) {
        setAccessRequests({ ...accessRequests.filter(r => r.id !== updateRequest.id), ...updateRequest });
        showMessage({ message: `Заявка с id ${id} одобрена`, severity: 'success' });
      }
      return null;
    } catch (err: any) {
      const msg = err.toString();
      showMessage({ message: msg, severity: 'error' });
      return null;
    }
  };

  const onReject = async (id: string) => {
    try {
      const updateRequest = await withLoading(() => accessRequestApi.rejectAccessRequest(id));
      if (updateRequest) {
        setAccessRequests({ ...accessRequests.filter(r => r.id !== updateRequest.id), ...updateRequest });
        showMessage({ message: `Заявка с id ${id} одобрена`, severity: 'success' });
      }
      return null;
    } catch (err: any) {
      const msg = err.toString();
      showMessage({ message: msg, severity: 'error' });
      return null;
    }
  };


  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Управление заявками
        </Typography>
      </Box>
      <RequestTable requests={accessRequests} loading={loading} onApprove={onApprove} onReject={onReject} />
    </Container>
  );
};

export default RequestPage;
