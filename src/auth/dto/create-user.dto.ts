import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'ejemplo' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'ejemplo@gmail.comm' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'contraseña123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
