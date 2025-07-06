import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: process.env.SMTP_ENDPOINT || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

export async function sendEmail(to: string, body: string) {
    try {
      await transport.sendMail({
        from: "contact@100xdevs.com",
        sender: "contact@100xdevs.com",
        to,
        subject: "Hello from Zapier",
        text: body,
      });
    } catch (err) {
      console.log(err);
      
    }
}