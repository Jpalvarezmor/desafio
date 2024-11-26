import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  async register(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return await this.usersRepository.save(newUser);
  }

  async login(loginData: LoginDto): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { email: loginData.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return { message: 'Inicio de sesión exitoso' };
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { email, oldPassword, newPassword, confirmNewPassword } = changePasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Las nuevas contraseñas no coinciden');
    }

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new UnauthorizedException('La contraseña antigua es incorrecta');
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await this.usersRepository.save(user);

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async requestPasswordReset(requestResetDto: RequestResetDto): Promise<{ message: string }> {
    const { email } = requestResetDto;

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const resetToken = uuidv4();

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await this.usersRepository.save(user);

    // Enviar el correo electrónico con el token
    await this.mailService.sendMail(
      user.email,
      'Restablecimiento de contraseña',
      `Hola ${user.username}, utiliza este token para restablecer tu contraseña: ${resetToken}`,
      `<p>Hola ${user.username},</p><p>Utiliza este token para restablecer tu contraseña:</p><p><strong>${resetToken}</strong></p>`
    );

    return { message: 'Se ha enviado un correo electrónico para restablecer la contraseña' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword, confirmNewPassword } = resetPasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Las nuevas contraseñas no coinciden');
    }

    const user = await this.usersRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.usersRepository.save(user);

    return { message: 'Contraseña restablecida exitosamente' };
  }
}
