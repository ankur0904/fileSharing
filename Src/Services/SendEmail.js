import nodemailer from 'nodemailer'
export const sendEmail = async ({ to = "", subject = "", message = "" }) => {
    let transporter = nodemailer.createTransport({
        host: "localhost",
        port: 587,
        secure: false,
        service: "gmail",
        auth: {
            user: process.env.SEND_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }, tls: {
            rejectUnauthorized: false,
        },
    });
    let info = await transporter.sendMail({
        from: `Route ${process.env.SEND_EMAIL}`,
        to,
        subject,
        html: message,
    });
    if (info.accepted.length) {
        return true;
    }
    return false;
}