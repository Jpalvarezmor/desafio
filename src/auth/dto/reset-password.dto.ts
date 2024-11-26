// src/auth/dto/reset-password.dto.ts
import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'nuevacontraseña123' })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ example: 'nuevacontraseña123' })
  @IsNotEmpty()
  @MinLength(6)
  confirmNewPassword: string;
}
