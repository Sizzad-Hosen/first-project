import nodemailer from "nodemailer";
import config from "../config";


export const sendEmail = async (to: string, html: string) => {
  try {
    // ✅ Create a transporter for Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Use 587 if 465 doesn't work
      secure: true, // true for 465, false for 587
      auth: {
        user: config.email_user, // Use environment variable
        pass: config.email_pass, // Use App Password (not regular password)
      },
    });

    await transporter.sendMail({
      from: `"Sizzad Hosen" <${config.email_user}>`, // Sender email
      to, // Recipient email
      subject: "Please change your password", // Subject
      text: "Hello world?", // Plain text
      html, // HTML content
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
