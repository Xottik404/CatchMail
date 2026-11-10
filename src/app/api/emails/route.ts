import { NextRequest, NextResponse } from "next/server";
import { getEmails, deleteEmail, clearAllEmails, markAsRead } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const account = searchParams.get("account"); // filter by specific mail account or "all"
    const emails = await getEmails(account);
    return NextResponse.json({ emails });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action");

    if (action === "clear-all") {
      await clearAllEmails();
      return NextResponse.json({ success: true, message: "Tous les emails ont été supprimés" });
    }

    if (!id) {
      return NextResponse.json({ error: "Paramètre 'id' manquant" }, { status: 400 });
    }

    const deleted = await deleteEmail(id);
    if (!deleted) {
      return NextResponse.json({ error: "Email non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Email supprimé" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Paramètre 'id' manquant" }, { status: 400 });
    }
    await markAsRead(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

