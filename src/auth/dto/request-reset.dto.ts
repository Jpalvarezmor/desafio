// src/auth/dto/request-reset.dto.ts
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestResetDto {
  @ApiProperty({ example: 'ejemplo@gmail.com' })
  @IsEmail()
  email: string;
}
