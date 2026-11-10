import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { Email, CreateEmailInput } from "../types/email";
import { MailAccount, CreateAccountInput } from "../types/account";
import { extractVerificationCode, extractVerificationLink, generateStrongPassword } from "./utils";
import { analyzeEmailSecurity } from "./security";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "emails.json");
const ACCOUNTS_FILE = path.join(DATA_DIR, "accounts.json");

const DEFAULT_ACCOUNTS: MailAccount[] = [
  {
    id: "admin-root",
    name: "Administrateur Principal",
    address: "admin@mail.hebertik.fr",
    password: "HJGughfybched@@àbu9è'-9273!!",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "admin-test",
    name: "Admin Test",
    address: "test@mail.hebertik.fr",
    password: "UGHiusdyjk@cnn8674788!",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "account-discord",
    name: "Compte Discord & Jeux",
    address: "discord@mail.hebertik.fr",
    password: generateStrongPassword(16),
    role: "user",
    createdAt: new Date().toISOString(),
  },
];

const SEED_EMAILS: Email[] = [
  {
    id: "seed-discord-001",
    from: "Discord Security <noreply@discord.com>",
    to: "user-alpha@catchmail.local",
    subject: "Votre code de vérification Discord",
    text: "Bonjour !\n\nVoici votre code de sécurité Discord : 482910\nCe code est valable pendant 10 minutes.\nSi vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.\n\nCordialement,\nL'équipe Discord",
    date: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    extractedCode: "482910",
    read: false,
  },
  {
    id: "seed-epic-002",
    from: "Epic Games Support <help@epicgames.com>",
    to: "gamer99@catchmail.local",
    subject: "Code de sécurité du compte Epic Games",
    text: "Bonjour gamer99,\n\nMerci de vous être connecté à votre compte Epic Games.\n\nVotre code d'authentification à deux facteurs est : 739104\n\nN'indiquez jamais ce code à qui que ce soit. Nos employés ne vous le demanderont jamais.",
    date: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    extractedCode: "739104",
    read: true,
  },
  {
    id: "seed-generic-003",
    from: "GitHub Notifications <no-reply@github.com>",
    to: "dev@catchmail.local",
    subject: "[GitHub] Please verify your device",
    text: "A sign-in attempt from a new device requires verification.\n\nEnter this one-time code to authorize the device: 82913456\n\nLocation: Paris, France\nIP: 192.168.1.1\n\nThanks,\nThe GitHub Team",
    date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    extractedCode: "82913456",
    read: true,
  },
];

async function ensureDbInitialized(): Promise<Email[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const data = await fs.readFile(DB_FILE, "utf-8");
      return JSON.parse(data);
    } catch {
      // File doesn't exist yet, seed with sample data
      await fs.writeFile(DB_FILE, JSON.stringify(SEED_EMAILS, null, 2), "utf-8");
      return SEED_EMAILS;
    }
  } catch (error) {
    console.error("Error reading email database:", error);
    return [];
  }
}

export async function getEmails(filterAddress?: string | null): Promise<Email[]> {
  const emails = await ensureDbInitialized();
  const sorted = emails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (!filterAddress || filterAddress === "all") {
    return sorted;
  }

  const cleanTarget = filterAddress.trim().toLowerCase();
  return sorted.filter((email) => {
    return email.to.toLowerCase().includes(cleanTarget);
  });
}

async function ensureAccountsInitialized(): Promise<MailAccount[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const data = await fs.readFile(ACCOUNTS_FILE, "utf-8");
      const list: MailAccount[] = JSON.parse(data);
      let modified = false;
      for (const acc of list) {
        if (!acc.password) {
          acc.password = generateStrongPassword(16);
          modified = true;
        }
      }
      if (modified) {
        await fs.writeFile(ACCOUNTS_FILE, JSON.stringify(list, null, 2), "utf-8");
      }
      return list;
    } catch {
      await fs.writeFile(ACCOUNTS_FILE, JSON.stringify(DEFAULT_ACCOUNTS, null, 2), "utf-8");
      return DEFAULT_ACCOUNTS;
    }
  } catch (error) {
    console.error("Error reading accounts database:", error);
    return DEFAULT_ACCOUNTS;
  }
}

export async function getAccounts(): Promise<MailAccount[]> {
  return await ensureAccountsInitialized();
}

export async function authenticateAccount(email: string, password: string): Promise<MailAccount | null> {
  const accounts = await ensureAccountsInitialized();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  const found = accounts.find(
    (a) => a.address.toLowerCase() === cleanEmail && a.password === cleanPass
  );

  return found || null;
}

export async function createAccount(input: CreateAccountInput): Promise<MailAccount> {
  const accounts = await ensureAccountsInitialized();

  // Normalize address (ensure it has @ if not present or lowercase)
  let address = input.address.trim().toLowerCase();
  if (!address.includes("@")) {
    address = `${address}@mail.hebertik.fr`;
  }

  // Check if exists
  const existing = accounts.find((a) => a.address === address);
  if (existing) {
    throw new Error(`Le compte ${address} existe déjà.`);
  }

  const newAccount: MailAccount = {
    id: crypto.randomUUID(),
    name: input.name.trim() || address.split("@")[0],
    address,
    password: input.password?.trim() || generateStrongPassword(16),
    role: input.role || "user",
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  await fs.writeFile(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), "utf-8");
  return newAccount;
}

const ADJECTIVES = ["swift", "dark", "neon", "cyber", "shadow", "silent", "iron", "quick", "storm", "wild", "hyper", "solar", "frost", "vortex"];
const NOUNS = ["fox", "wolf", "falcon", "hawk", "tiger", "otter", "viper", "bear", "eagle", "raven", "lynx", "panda", "ghost", "sniper"];

export async function createRandomAccount(): Promise<MailAccount> {
  const accounts = await ensureAccountsInitialized();
  const existingAddresses = new Set(accounts.map((a) => a.address.toLowerCase()));

  let attempts = 0;
  let candidateAddress = "";
  let candidateName = "";

  // Generate unique address avoiding duplicates
  while (attempts < 50) {
    attempts++;
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(100 + Math.random() * 900); // 3 digits
    const prefix = `${adj}-${noun}-${num}`;
    const testAddr = `${prefix}@mail.hebertik.fr`;

    if (!existingAddresses.has(testAddr)) {
      candidateAddress = testAddr;
      candidateName = `${adj.charAt(0).toUpperCase() + adj.slice(1)} ${noun.charAt(0).toUpperCase() + noun.slice(1)} #${num}`;
      break;
    }
  }

  // Fallback if somehow word combos collide
  if (!candidateAddress) {
    const randomHex = crypto.randomBytes(4).toString("hex");
    candidateAddress = `temp-${randomHex}@mail.hebertik.fr`;
    candidateName = `Boîte ${randomHex}`;
  }

  const newAccount: MailAccount = {
    id: crypto.randomUUID(),
    name: candidateName,
    address: candidateAddress,
    password: generateStrongPassword(16),
    role: "user",
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  await fs.writeFile(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), "utf-8");
  return newAccount;
}

export async function createBatchAccounts(count = 10): Promise<MailAccount[]> {
  const accounts = await ensureAccountsInitialized();
  const existingAddresses = new Set(accounts.map((a) => a.address.toLowerCase()));
  const created: MailAccount[] = [];

  const max = Math.min(Math.max(count, 1), 100);

  for (let i = 0; i < max; i++) {
    let candidateAddress = "";
    let candidateName = "";
    let attempts = 0;

    while (attempts < 60) {
      attempts++;
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
      const num = Math.floor(100 + Math.random() * 900);
      const testAddr = `${adj}-${noun}-${num}@mail.hebertik.fr`;

      if (!existingAddresses.has(testAddr)) {
        candidateAddress = testAddr;
        candidateName = `${adj.charAt(0).toUpperCase() + adj.slice(1)} ${noun.charAt(0).toUpperCase() + noun.slice(1)} #${num}`;
        existingAddresses.add(testAddr);
        break;
      }
    }

    if (!candidateAddress) {
      const hex = crypto.randomBytes(4).toString("hex");
      candidateAddress = `temp-${hex}@mail.hebertik.fr`;
      candidateName = `Boîte ${hex}`;
      existingAddresses.add(candidateAddress);
    }

    const newAcc: MailAccount = {
      id: crypto.randomUUID(),
      name: candidateName,
      address: candidateAddress,
      password: generateStrongPassword(16),
      role: "user",
      createdAt: new Date().toISOString(),
    };

    created.push(newAcc);
    accounts.push(newAcc);
  }

  await fs.writeFile(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), "utf-8");
  return created;
}

export async function deleteAccount(id: string): Promise<boolean> {
  const accounts = await ensureAccountsInitialized();
  const filtered = accounts.filter((a) => a.id !== id);
  if (filtered.length === accounts.length) return false;

  await fs.writeFile(ACCOUNTS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export async function getEmailById(id: string): Promise<Email | null> {
  const emails = await ensureDbInitialized();
  return emails.find((e) => e.id === id) || null;
}

export async function saveEmail(input: CreateEmailInput): Promise<Email> {
  const emails = await ensureDbInitialized();

  const codeMatch = extractVerificationCode(input.text || input.subject || "");
  const linkMatch = extractVerificationLink(input.text || "", input.html);
  const security = input.security || analyzeEmailSecurity(input.from, input.subject, input.text);

  const newEmail: Email = {
    id: input.id || crypto.randomUUID(),
    from: input.from || "Inconnu <unknown@unknown.com>",
    to: input.to || "catchall@local",
    subject: input.subject || "(Sans objet)",
    text: input.text || "",
    html: input.html || undefined,
    date: input.date || new Date().toISOString(),
    extractedCode: input.extractedCode ?? (codeMatch ? codeMatch.code : null),
    extractedLink: input.extractedLink ?? linkMatch,
    security,
    read: false,
  };

  emails.unshift(newEmail);
  await fs.writeFile(DB_FILE, JSON.stringify(emails, null, 2), "utf-8");
  return newEmail;
}

export async function deleteEmail(id: string): Promise<boolean> {
  const emails = await ensureDbInitialized();
  const filtered = emails.filter((e) => e.id !== id);
  if (filtered.length === emails.length) return false;

  await fs.writeFile(DB_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export async function clearAllEmails(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), "utf-8");
}

export async function markAsRead(id: string): Promise<void> {
  const emails = await ensureDbInitialized();
  const target = emails.find((e) => e.id === id);
  if (target && !target.read) {
    target.read = true;
    await fs.writeFile(DB_FILE, JSON.stringify(emails, null, 2), "utf-8");
  }
}

