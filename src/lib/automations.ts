import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { AutomatedProfile, AutomationService } from "@/types/account";
import { generateStrongPassword, generateRandomUsername, generateRandomDOB } from "./utils";

export { generateRandomUsername, generateRandomDOB };

const DATA_DIR = path.join(process.cwd(), "data");
const AUTOMATIONS_FILE = path.join(DATA_DIR, "automations.json");

async function ensureAutomationsInitialized(): Promise<AutomatedProfile[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const data = await fs.readFile(AUTOMATIONS_FILE, "utf-8");
      return JSON.parse(data);
    } catch {
      await fs.writeFile(AUTOMATIONS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
  } catch (error) {
    console.error("Error reading automations database:", error);
    return [];
  }
}

export async function getAutomatedProfiles(): Promise<AutomatedProfile[]> {
  const list = await ensureAutomationsInitialized();
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveAutomatedProfile(profile: Omit<AutomatedProfile, "id" | "createdAt">): Promise<AutomatedProfile> {
  const list = await ensureAutomationsInitialized();

  const newProfile: AutomatedProfile = {
    ...profile,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  list.unshift(newProfile);
  await fs.writeFile(AUTOMATIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  return newProfile;
}

export async function updateAutomatedProfile(
  id: string,
  updates: Partial<AutomatedProfile>
): Promise<boolean> {
  const list = await ensureAutomationsInitialized();
  const target = list.find((p) => p.id === id);
  if (!target) return false;

  Object.assign(target, updates);
  await fs.writeFile(AUTOMATIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  return true;
}

export async function deleteAutomatedProfile(id: string): Promise<boolean> {
  const list = await ensureAutomationsInitialized();
  const filtered = list.filter((p) => p.id !== id);
  if (filtered.length === list.length) return false;

  await fs.writeFile(AUTOMATIONS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

