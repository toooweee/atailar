import { Controller } from '@nestjs/common';
import { AccessRequestsService } from './access-requests.service';

@Controller('access-requests')
export class AccessRequestsController {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}
}
