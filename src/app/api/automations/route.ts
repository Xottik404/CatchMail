import { NextRequest, NextResponse } from "next/server";
import {
  getAutomatedProfiles,
  saveAutomatedProfile,
  updateAutomatedProfile,
  deleteAutomatedProfile,
  generateRandomUsername,
  generateRandomDOB,
} from "@/lib/automations";
import { generateStrongPassword } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profiles = await getAutomatedProfiles();
    return NextResponse.json({ profiles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Helper pour générer un profil gamer complet (username, dob, password)
    if (body.action === "generate_info") {
      return NextResponse.json({
        username: generateRandomUsername(),
        password: generateStrongPassword(16),
        dateOfBirth: generateRandomDOB(),
      });
    }

    if (!body.email || !body.service) {
      return NextResponse.json(
        { error: "L'email et le service sont obligatoires." },
        { status: 400 }
      );
    }

    const saved = await saveAutomatedProfile({
      service: body.service,
      email: body.email,
      username: body.username || generateRandomUsername(),
      password: body.password || generateStrongPassword(16),
      dateOfBirth: body.dateOfBirth || generateRandomDOB(),
      status: body.status || "pending",
      verificationCode: body.verificationCode || null,
      verificationLink: body.verificationLink || null,
    });

    return NextResponse.json({ success: true, profile: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID manquant." }, { status: 400 });
    }

    const updated = await updateAutomatedProfile(body.id, body.updates || {});
    return NextResponse.json({ success: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID manquant." }, { status: 400 });
    }

    const deleted = await deleteAutomatedProfile(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

