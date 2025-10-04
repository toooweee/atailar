import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SecretsService } from '../secrets.service';

@Injectable()
export class ApprovedRequestGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly secretsService: SecretsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const secretId = req.params.id;
    const userId = req.user.sub;

    return await this.secretsService.validateSecret(secretId, userId);
  }
}
