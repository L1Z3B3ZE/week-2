import nodemailer from "nodemailer";

type EmailOptionsType = {
    to: string;
    subject: string;
    text?: string;
};

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

export async function sendMail(options: EmailOptionsType) {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: options.to,
            subject: options.subject,
            text: options.text
        });
        return { message: "Email отправлен успешно" };
    } catch {
        throw new Error("Не удалось отправить email");
    }
}
