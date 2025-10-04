import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccessRequestDto {
  @IsString()
  @IsNotEmpty()
  secretId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
