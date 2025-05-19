import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(private readonly mailerService: MailerService) {}

  // tranbaoonguyen.tb@gmail.com
  @Get()
  @Public()
  @ResponseMessage('Test email')
  async handleTestEmail() {
    await this.mailerService.sendMail({
      to: 'tranbaoonguyen.tb@gmail.com',
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">🎉 Chúc mừng bạn đã trúng tuyển!</h2>
        <p>Xin chào <b>Ứng viên thân mến</b>,</p>
        <p>Chúng tôi rất vui mừng thông báo rằng bạn đã <strong>chính thức trúng tuyển</strong> vị trí <strong>Odoo Python Developer</strong> tại công ty chúng tôi.</p>
        <p>Buổi onboarding dự kiến sẽ diễn ra vào lúc <b>9h00 sáng, ngày 24/05/2025</b> tại văn phòng công ty. Vui lòng mang theo:</p>
        <ul>
        
          <li>Hồ sơ xin việc (CV, bằng cấp liên quan)</li>
          <li>Máy tính cá nhân (nếu có)</li>
        </ul>
        <p>Chúng tôi rất mong được đồng hành cùng bạn trong chặng đường phát triển tiếp theo!</p>
        <p>Nếu bạn có bất kỳ thắc mắc nào, xin vui lòng liên hệ qua email <a href="mailto:support@example.com">support@example.com</a>.</p>
        <br>
        <p>Trân trọng,</p>
        <p><b>Đội ngũ tuyển dụng</b><br>Công ty TNHH Công nghệ Kĩ thuật truyển thông đa phương tiện</p>
      </div>
    `,
    });
  }
}
