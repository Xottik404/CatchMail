import { NextRequest, NextResponse } from "next/server";
import { saveEmail } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/webhooks/inbound" });
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    console.log("[CatchMail Webhook] Requête reçue :", JSON.stringify(rawBody, null, 2));

    // Normalisation si le payload est sous un objet "data" (ex: Resend event email.received)
    const payload = rawBody.data && typeof rawBody.data === "object" ? rawBody.data : rawBody;

    // 1. Extraction de l'expéditeur (from)
    let from = payload.from || payload.From || payload.sender || "";
    if (typeof from === "object" && from !== null) {
      from = from.email ? (from.name ? `${from.name} <${from.email}>` : from.email) : JSON.stringify(from);
    }
    if (!from) from = "Expéditeur inconnu <unknown@inbound.mail>";

    // 2. Extraction du destinataire (to)
    let to = payload.to || payload.To || payload.recipient || "";
    if (Array.isArray(to)) {
      to = to.map((item) => (typeof item === "object" && item.email ? item.email : String(item))).join(", ");
    } else if (typeof to === "object" && to !== null) {
      to = to.email || JSON.stringify(to);
    }
    if (!to) to = "catchall@local";

    // 3. Extraction du sujet (subject)
    const subject = payload.subject || payload.Subject || "(Sans objet)";

    // 4. Extraction du corps (text / html)
    let text = payload.text || payload.TextBody || payload.body || payload.plain || "";
    let html = payload.html || payload.HtmlBody || undefined;

    // SPÉCIFIQUE RESEND : Si Resend envoie un email_id sans le corps complet
    const emailId = payload.email_id || payload.id;
    if ((!text || text === subject) && emailId) {
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        try {
          console.log(`[CatchMail] Récupération du corps complet auprès de Resend (ID: ${emailId})...`);
          const res = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          });
          if (res.ok) {
            const emailDetail = await res.json();
            const detailData = emailDetail.data || emailDetail;
            text = detailData.text || detailData.body || "";
            html = detailData.html || undefined;
            console.log(`[CatchMail] Corps récupéré avec succès depuis Resend ! (Longueur texte: ${text.length}, HTML: ${Boolean(html)})`);
          } else {
            console.warn(`[CatchMail] Erreur API Resend (Status ${res.status}): ${await res.text()}`);
          }
        } catch (fetchErr) {
          console.error("[CatchMail] Erreur fetch Resend receiving detail:", fetchErr);
        }
      } else {
        console.warn("[CatchMail] ⚠️ RESEND_API_KEY non définie dans .env.local ! Impossible de télécharger le contenu complet (boutons / liens Discord).");
        if (!text) {
          text = `${subject}\n\n⚠️ Pour afficher les liens et boutons de confirmation Discord, configurez RESEND_API_KEY dans votre fichier .env.local.`;
        }
      }
    }

    // Si aucun texte brut n'est fourni mais qu'on a du HTML
    if (!text && html) {
      text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 5. Extraction de la date
    let date = payload.date || payload.Date || payload.created_at || payload.createdAt || new Date().toISOString();
    try {
      date = new Date(date).toISOString();
    } catch {
      date = new Date().toISOString();
    }

    // Sauvegarde & extraction automatique du code
    const savedEmail = await saveEmail({
      from,
      to,
      subject,
      text: text || subject,
      html,
      date,
    });

    console.log(`[CatchMail]  Email sauvegardé avec succès ! ID: ${savedEmail.id}`);
    if (savedEmail.extractedCode) {
      console.log(`[CatchMail]  Code OTP extrait: ${savedEmail.extractedCode}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Email reçu et enregistré avec succès",
        email: savedEmail,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[CatchMail] Erreur lors du traitement du webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la lecture du payload JSON",
        details: error?.message || String(error),
      },
      { status: 400 }
    );
  }
}
