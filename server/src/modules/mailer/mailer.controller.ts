import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './dto/mailer.dto';
import { Mailer } from './entities/mailer.entity';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendEmail(@Body() dto: SendEmailDto): Promise<Mailer> {
    return this.mailerService.sendEmail(dto);
  }
}
