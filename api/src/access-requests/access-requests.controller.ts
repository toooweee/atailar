import { Body, Controller, Post } from '@nestjs/common';
import { AccessRequestsService } from './access-requests.service';
import { CreateAccessRequestDto } from './dtos/create-access-request.dto';

@Controller('access-requests')
export class AccessRequestsController {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}

  @Post()
  createAccessRequest(@Body() createAccessRequestDto: CreateAccessRequestDto) {}
}
