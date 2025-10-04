import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSecretDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  encryptionValue: string;
}
