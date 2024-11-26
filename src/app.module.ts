import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { MailService } from './mail/mail.service';
import * as dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [],
  providers: [MailService],
})
export class AppModule {}
