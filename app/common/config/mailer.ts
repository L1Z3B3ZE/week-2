import nodemailer from "nodemailer";
import { z } from "zod";

const emailSchema = z.object({
    to: z.string().email(),
    subject: z.string().min(1),
    text: z.string().optional()
});

export type EmailOptions = z.infer<typeof emailSchema>;

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

export async function sendMail(options: EmailOptions) {
    const validatedOptions = emailSchema.parse(options);

    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: validatedOptions.to,
            subject: validatedOptions.subject,
            text: validatedOptions.text
        });
        return { message: "Email отправлен успешно" };
    } catch {
        throw new Error("Не удалось отправить email");
    }
}
