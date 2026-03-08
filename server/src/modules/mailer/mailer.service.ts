import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Mailer } from './entities/mailer.entity';
import { SendEmailDto } from './dto/mailer.dto';

@Injectable()
export class MailerService {
  constructor(
    @InjectRepository(Mailer)
    private readonly mailerRepository: Repository<Mailer>,
  ) {}

  private createTransporter() {
    const isGmail = process.env.EMAIL_USER?.endsWith('@gmail.com');

    return nodemailer.createTransport(
      isGmail
        ? {
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          }
        : {
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          },
    );
  }

  async sendEmail(dto: SendEmailDto): Promise<Mailer> {
    const transporter = this.createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: dto.recipient,
      subject: dto.subject,
      html: dto.body,
    });

    return this.mailerRepository.save(
      this.mailerRepository.create({
        sender: process.env.EMAIL_USER,
        recepient: dto.recipient,
        subject: dto.subject,
        body: dto.body,
      }),
    );
  }
}
