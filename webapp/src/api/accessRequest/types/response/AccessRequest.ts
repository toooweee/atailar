import { StatusRequest } from '../enums/StatusRequest.ts';

export interface AccessRequest {
  id: string,
  comment: string,
  status: StatusRequest,
  createdAt: Date,
  userId: string | null,
  secretId: string | null
}
