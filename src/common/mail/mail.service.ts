import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendBrandCredentials(email: string, password: string) {
    try {
      const result = await this.mailerService.sendMail({
        to: email,
        subject: 'Your Brand Account Created',
        text: `
          Your brand account has been created.

          Email: ${email}
          Password: ${password}

          Please change your password after login.
        `,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
