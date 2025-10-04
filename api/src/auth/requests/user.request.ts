import { Request } from 'express';
import { UserPayload } from '../types/user.payload';

interface RequestWithUser extends Request {
  user: UserPayload;
}

export default RequestWithUser;
