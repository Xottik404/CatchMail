import { NextRequest, NextResponse } from "next/server";
import { getAccounts, createAccount, deleteAccount, createRandomAccount, createBatchAccounts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accounts = await getAccounts();
    return NextResponse.json({ accounts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Création en masse (Batch Creator)
    if (body.batch) {
      const count = Number(body.batch) || 10;
      const createdAccounts = await createBatchAccounts(count);
      return NextResponse.json({ success: true, accounts: createdAccounts }, { status: 201 });
    }

    // Génération automatique d'une boîte mail aléatoire unique
    if (body.random) {
      const randomAccount = await createRandomAccount();
      return NextResponse.json({ success: true, account: randomAccount }, { status: 201 });
    }

    if (!body.address) {
      return NextResponse.json({ error: "L'adresse email est requise" }, { status: 400 });
    }

    const newAccount = await createAccount({
      name: body.name || "",
      address: body.address,
      password: body.password || undefined,
      role: body.role || "user",
    });

    return NextResponse.json({ success: true, account: newAccount }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Paramètre 'id' manquant" }, { status: 400 });
    }

    const deleted = await deleteAccount(id);
    if (!deleted) {
      return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Compte supprimé" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

