import React from 'react';
import {
  TableRow,
  TableCell,
} from '@mui/material';
import type { UserInfo } from '../../../api/users/types/response/UserInfo.ts';

interface UsersListItemProps {
  user: UserInfo;
}

const UsersListItem: React.FC<UsersListItemProps> = ({ user }) => {
  return (
    <TableRow key={user.id} hover>
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.fullName}</TableCell>
      <TableCell>{user.email}</TableCell>

    </TableRow>
  );
};

export default UsersListItem;
