import { NextResponse } from "next/server";
import { db, isDatabaseUnavailableError } from "@/lib/db";
import { ApiRequestError, enforceRateLimit, parseJsonBody, validateRequestOrigin } from "@/lib/api-security";
import { verifyCaptcha } from "@/lib/bot-protection";
import { sendAdminNotification } from "@/lib/notification";
import { donationSchema } from "@/lib/validations/donation.schema";

export async function POST(request) {
  try {
    if (!validateRequestOrigin(request)) return NextResponse.json({ success:false, message:"Geçersiz istek kaynağı." }, { status:403 });
    await enforceRateLimit(request, 'donations', 10, 3600);
    const body = await parseJsonBody(request, 8_000);
    await verifyCaptcha(request, body.captchaToken);

    const result = donationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Gönderilen bağış bilgileri geçersiz.",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      donationType,
      paymentPeriod,
      amount,
      senderName,
      transferDate,
      dedicationName,
      isAnonymous,
    } = result.data;

    const [databaseResult] = await db.execute(
      `
        INSERT INTO donations (
          donation_type,
          payment_period,
          amount,
          sender_name,
          transfer_date,
          dedication_name,
          is_anonymous,
          payment_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        donationType,
        paymentPeriod,
        amount,
        senderName,
        transferDate,
        dedicationName || null,
        isAnonymous ? 1 : 0,
        "pending",
      ]
    );

    await sendAdminNotification('donation.created', {
      id: databaseResult.insertId,
      donationType,
      paymentPeriod,
      amount,
      transferDate,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Bağış kaydı başarıyla oluşturuldu.",
        donationId: databaseResult.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      console.warn("Bağış formu: veritabanına ulaşılamadı.");
      return NextResponse.json({ success:false, message:"Bağış formu geçici olarak kullanılamıyor. Lütfen daha sonra yeniden deneyin." }, { status:503, headers:{'Retry-After':'30'} });
    }
    console.error("Bağış kayıt hatası:", error);

    if (error instanceof ApiRequestError) {
      return NextResponse.json({ success:false, message:error.message }, { status:error.status, headers:error.retryAfter?{'Retry-After':String(error.retryAfter)}:undefined });
    }
    return NextResponse.json(
      {
        success: false,
        message: "Bağış kaydı oluşturulurken bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
