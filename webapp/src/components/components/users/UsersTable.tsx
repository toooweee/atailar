// src/components/users/UsersTable.tsx
import React from 'react';
import { Typography } from '@mui/material';
import UsersListTable from './UsersListTable.tsx';
import type { UserInfo } from '../../../api/users/types/response/UserInfo.ts';

interface UsersTableProps {
  users: UserInfo[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  if (users.length === 0) {
    return <Typography>Нет пользователей</Typography>;
  }

  return <UsersListTable users={users} />;
};

export default UsersTable;
