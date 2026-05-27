import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  body,
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text:body,
  });

  console.log("📧 Email sent");
};