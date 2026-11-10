import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Génère un mot de passe robuste (majuscules, minuscules, chiffres, symboles).
 */
export function generateStrongPassword(length = 16): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // sans I, O pour éviter la confusion
  const lower = "abcdefghijkmnopqrstuvwxyz"; // sans l
  const numbers = "23456789"; // sans 0, 1
  const symbols = "!@#$%^&*()_+-=";

  const all = upper + lower + numbers + symbols;
  let pwd = "";

  // Assurer au moins un caractère de chaque type
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += numbers[Math.floor(Math.random() * numbers.length)];
  pwd += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 4; i < length; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }

  // Mélanger les caractères
  return pwd
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

/**
 * Formate les identifiants d'une boîte selon le format demandé par l'utilisateur.
 */
export function formatCredentials(email: string, pass: string): string {
  return `${email}:${pass}
------------------------------------------
Email : ${email}
Password : ${pass}`;
}

/**
 * Extrait un code de vérification (4, 6 ou 8 chiffres) d'un texte.
 */
export function extractVerificationCode(text: string): { code: string; context?: string } | null {
  if (!text) return null;

  const contextPatterns = [
    /(?:code|verification|vérification|pin|otp|security|sécurité|confirmez|confirmation|token)[\s\w,.'":-]{0,35}?\b(\d{4}|\d{6}|\d{8})\b/i,
    /\b(\d{4}|\d{6}|\d{8})\b[\s\w,.'":-]{0,25}?(?:is your code|est votre code|is your verification code|est votre code de confirmation)/i
  ];

  for (const regex of contextPatterns) {
    const match = text.match(regex);
    if (match && match[1]) {
      return { code: match[1], context: match[0].trim() };
    }
  }

  const sixDigit = text.match(/\b([0-9]{6})\b/);
  if (sixDigit) return { code: sixDigit[1] };

  const eightDigit = text.match(/\b([0-9]{8})\b/);
  if (eightDigit) return { code: eightDigit[1] };

  const fourDigit = text.match(/\b([0-9]{4})\b/);
  if (fourDigit) {
    const num = parseInt(fourDigit[1], 10);
    if (num < 1990 || num > 2030) {
      return { code: fourDigit[1] };
    }
  }

  return null;
}

/**
 * Génère un pseudo de joueur crédible et unique.
 */
const USERNAME_PREFIXES = [
  "Shadow", "Vortex", "Cyber", "Swift", "Neon", "Hyper", "Frost", "Iron", "Storm",
  "Silent", "Wild", "Solar", "Echo", "Apex", "Nova", "Titan", "Phantom"
];

const USERNAME_SUFFIXES = [
  "Fox", "Wolf", "Falcon", "Hawk", "Hunter", "Sniper", "Raven", "Knight", "Ranger",
  "Ghost", "Viper", "Tiger", "Lynx", "Strike", "Blade", "Runner"
];

export function generateRandomUsername(): string {
  const pre = USERNAME_PREFIXES[Math.floor(Math.random() * USERNAME_PREFIXES.length)];
  const suf = USERNAME_SUFFIXES[Math.floor(Math.random() * USERNAME_SUFFIXES.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${pre}${suf}${num}`;
}

/**
 * Génère une date de naissance valide (âge 20-27 ans).
 */
export function generateRandomDOB(): string {
  const year = Math.floor(1997 + Math.random() * 8);
  const month = String(Math.floor(1 + Math.random() * 12)).padStart(2, "0");
  const day = String(Math.floor(1 + Math.random() * 28)).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Extrait le lien principal de vérification / confirmation (ex: bouton Discord, lien d'activation).
 */
export function extractVerificationLink(text: string, html?: string): string | null {
  // 1. Recherche dans le HTML si disponible
  if (html) {
    // Chercher les balises <a> dont le texte ou href contient des mots clés de confirmation
    const linkMatches = Array.from(html.matchAll(/<a\s+[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi));
    
    // Priorité 1 : lien dont le texte du bouton contient "vérifi", "confirm", "activate", etc.
    for (const match of linkMatches) {
      const href = match[1];
      const linkText = match[2];
      if (/v[ée]rifi|confirm|activ|discord\.com|click\.discord/i.test(linkText) || /v[ée]rifi|confirm|token|activ/i.test(href)) {
        if (!/unsubscribe|d[ée]sabonner|privacy|terms/i.test(href)) {
          return href;
        }
      }
    }

    // Priorité 2 : premier lien non-désinscription
    for (const match of linkMatches) {
      const href = match[1];
      if (!/unsubscribe|d[ée]sabonner|privacy|terms|help|twitter|facebook/i.test(href)) {
        return href;
      }
    }
  }

  // 2. Recherche dans le texte brut
  if (text) {
    const urlRegex = /(https?:\/\/[^\s"'<>\)]+)/gi;
    const matches = Array.from(text.matchAll(urlRegex));
    for (const match of matches) {
      const url = match[1];
      if (/v[ée]rifi|confirm|token|activ|discord/i.test(url) && !/unsubscribe|d[ée]sabonner/i.test(url)) {
        return url;
      }
    }
    if (matches.length > 0) {
      return matches[0][1];
    }
  }

  return null;
}
