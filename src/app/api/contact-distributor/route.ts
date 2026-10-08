import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, country, countryId, interests } = body;

    if (!email || !country) {
      return NextResponse.json(
        { error: 'Brak wymaganego adresu email lub kraju.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const interestsList = interests && interests.length > 0 
      ? interests.map((i: string) => `<li>${i}</li>`).join('') 
      : '<li>Nie zaznaczono (Brak konkretnych preferencji)</li>';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #ffcc33; padding: 20px; text-align: center;">
          <h2 style="margin: 0; color: #000; font-size: 24px;">Nowe Zapytanie B2B</h2>
        </div>
        <div style="padding: 30px; background-color: #fafafa; color: #333;">
          <p style="font-size: 16px; line-height: 1.5; margin-top: 0;">Otrzymałeś nową prośbę o kontakt z mapy dystrybutorów.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; width: 40%; color: #666;"><strong>Imię:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; width: 60%;">${name || '<em>Nie podano</em>'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #666;"><strong>E-mail:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}" style="color: #0056b3;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #666;"><strong>Region / Kraj:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>${country}</strong> (${countryId})</td>
            </tr>
          </table>

          <h3 style="margin-top: 30px; font-size: 16px; color: #333;">Czym interesuje się ten klient:</h3>
          <ul style="background-color: #fff; padding: 15px 15px 15px 35px; border: 1px solid #ddd; border-radius: 6px; line-height: 1.6;">
            ${interestsList}
          </ul>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffcc33; color: #856404; font-size: 14px;">
            Zaleca się jak najszybszy kontakt z klientem w celu ustalenia szczegółów i przydzielenia go do odpowiedniego handlowca w tym regionie.
          </div>
        </div>
        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
          Wiadomość wygenerowana automatycznie z systemu GMS Corporation.
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `Nowe zapytanie o dystrybutora: ${country}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email wysłany.' });
  } catch (error: any) {
    console.error('Błąd przy wysyłaniu maila:', error);
    return NextResponse.json(
      { error: 'Błąd serwera. Nie udało się wysłać wiadomości.' },
      { status: 500 }
    );
  }
}
