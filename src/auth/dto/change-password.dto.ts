// src/auth/dto/change-password.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'ejemplo@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'contraseña123' })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'nuevacontraseña123' })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ example: 'nuevacontraseña123' })
  @IsNotEmpty()
  @MinLength(6)
  confirmNewPassword: string;
}
