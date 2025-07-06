import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // host: 'smtp.forwardemail.net',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

export async function sendEmail({email, username, otp} : {email:string, username: string, otp: number}) {
    try {

      await transporter.sendMail({
        from: "jayraj4430@gmail.com",
        to: email,
        subject: "Zapier Verification Code",
        text: `Greeting ${username}, Thank you for choose Zapier , here is your OTP ${otp}`
      });

      return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return { success: false, message: 'Failed to send verification email.' };
    }
}