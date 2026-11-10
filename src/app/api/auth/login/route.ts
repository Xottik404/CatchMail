import { NextRequest, NextResponse } from "next/server";
import { authenticateAccount } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/auth/login" });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let email = body.email || "";
    let password = body.password || "";

    // Support du collage automatique de combo "email:password"
    if (email.includes(":") && !password) {
      const parts = email.split(":");
      email = parts[0].trim();
      password = parts.slice(1).join(":").trim();
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez renseigner votre email et mot de passe." },
        { status: 400 }
      );
    }

    const account = await authenticateAccount(email, password);
    if (!account) {
      return NextResponse.json(
        { error: "Identifiants invalides. Vérifiez l'adresse et le mot de passe." },
        { status: 401 }
      );
    }

    // Utilisateur authentifié sans exposer le mot de passe dans l'objet user
    const { password: _, ...safeUser } = account;

    return NextResponse.json({
      success: true,
      message: "Connexion réussie",
      user: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

