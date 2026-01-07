import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class EmailService {
  static async createTransporter() {
    try {
      console.log('📧 Configuring Gmail SMTP with App Password...');
      
      const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        secure: process.env.MAIL_SECURE === 'true',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

      // Verify the connection
      await transporter.verify();
      console.log('✅ Gmail SMTP connection verified successfully');
      
      return transporter;
      
    } catch (error) {
      console.error('❌ Error creating Gmail transporter:', error.message);
      throw error;
    }
  }

  static async sendInvoiceEmail(customerEmail, customerName, businessInfo, pdfBuffer, orderNumber) {
    try {
      const transporter = await this.createTransporter();

      const mailOptions = {
        from: `"${businessInfo.businessName}" <${process.env.MAIL_USER}>`,
        to: customerEmail,
        subject: `Invoice ${orderNumber} from ${businessInfo.businessName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">${businessInfo.businessName}</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Invoice Notification</p>
            </div>
            
            <div style="padding: 30px; background: white;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello ${customerName || 'Valued Customer'},</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for your business! Please find your invoice <strong>${orderNumber}</strong> attached to this email.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #8B5CF6; margin: 20px 0;">
                <h3 style="color: #8B5CF6; margin-top: 0;">Invoice Details:</h3>
                <p style="margin: 5px 0; color: #666;"><strong>Invoice Number:</strong> ${orderNumber}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Customer:</strong> ${customerName || 'N/A'}</p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                If you have any questions about this invoice, please don't hesitate to contact us.
              </p>
              
              <div style="background: #8B5CF6; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <h3 style="margin: 0 0 10px 0;">Contact Information</h3>
                <p style="margin: 5px 0;">${businessInfo.email}</p>
                <p style="margin: 5px 0;">${businessInfo.phone}</p>
                <p style="margin: 5px 0;">${businessInfo.address}</p>
              </div>
              
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                This is an automated email from ${businessInfo.businessName}. Please do not reply to this email.
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `Invoice-${orderNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      };

      console.log(`📧 Sending invoice email to: ${customerEmail}`);
      const result = await transporter.sendMail(mailOptions);
      
      console.log('✅ Email sent successfully via Gmail!');
      console.log('Message ID:', result.messageId);
      console.log('Response:', result.response);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Invoice sent successfully via Gmail'
      };

    } catch (error) {
      console.error('❌ Email sending error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send invoice email'
      };
    }
  }

  static async testEmailConnection() {
    try {
      const transporter = await this.createTransporter();
      console.log('✅ Gmail SMTP connection test successful');
      return { success: true, message: 'Gmail SMTP connection verified' };
    } catch (error) {
      console.error('❌ Gmail SMTP connection test failed:', error.message);
      return { success: false, error: error.message, message: 'Gmail SMTP connection failed' };
    }
  }
}