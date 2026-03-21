import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_TOKEN);

export async function sendVerificationEmail(to: string, code: string) {
  try {
    const data = await resend.emails.send({
      from: "VidShop <suporte@vidshop.com.br>", 
      to: [to],
      subject: "VidShop - Código de Verificação",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Bem-vindo à VidShop!</h2>
          <p>Para ativar sua conta e começar a gerenciar suas lojas, utilize o código de verificação abaixo:</p>
          <div style="margin: 20px 0; padding: 15px; background: #f4f4f5; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px;">
            ${code}
          </div>
          <p>Este código é válido pelas próximas 24 horas.</p>
        </div>
      `,
    });
    return data;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
}
