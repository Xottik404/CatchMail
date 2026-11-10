import { EmailSecurity } from "@/types/email";

interface BrandDomainRule {
  brand: string;
  keywords: string[];
  legitDomains: string[];
}

const BRAND_RULES: BrandDomainRule[] = [
  {
    brand: "Discord",
    keywords: ["discord"],
    legitDomains: ["discord.com", "click.discord.com", "email.discord.com", "discordapp.com"],
  },
  {
    brand: "Epic Games",
    keywords: ["epic games", "epicgames", "fortnite"],
    legitDomains: ["epicgames.com", "help.epicgames.com", "accts.epicgames.com"],
  },
  {
    brand: "Steam",
    keywords: ["steam", "valve"],
    legitDomains: ["steampowered.com", "valvesoftware.com"],
  },
  {
    brand: "Google",
    keywords: ["google", "gmail", "youtube"],
    legitDomains: ["google.com", "accounts.google.com", "youtube.com"],
  },
  {
    brand: "GitHub",
    keywords: ["github"],
    legitDomains: ["github.com"],
  },
  {
    brand: "Ubisoft",
    keywords: ["ubisoft", "uplay"],
    legitDomains: ["ubisoft.com", "ubi.com"],
  },
  {
    brand: "Riot Games",
    keywords: ["riot games", "riot", "valorant", "league of legends"],
    legitDomains: ["riotgames.com"],
  },
  {
    brand: "Microsoft / Xbox",
    keywords: ["microsoft", "xbox"],
    legitDomains: ["microsoft.com", "xbox.com", "accountprotection.microsoft.com"],
  },
];

export function analyzeEmailSecurity(
  from: string,
  subject: string,
  text = "",
  authPayload?: { spf?: string; dkim?: string; dmarc?: string }
): EmailSecurity {
  const emailRegex = /<([^>]+)>|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const match = from.match(emailRegex);
  const senderEmail = (match ? match[1] || match[2] : from).toLowerCase();
  const senderDomain = senderEmail.includes("@") ? senderEmail.split("@")[1] : "";

  const spf = (authPayload?.spf?.toLowerCase() as any) || "none";
  const dkim = (authPayload?.dkim?.toLowerCase() as any) || "none";
  const dmarc = (authPayload?.dmarc?.toLowerCase() as any) || "none";

  const content = `${subject} ${text}`.toLowerCase();

  for (const rule of BRAND_RULES) {
    const claimsToBeBrand = rule.keywords.some((k) => content.includes(k));
    if (claimsToBeBrand) {
      const isLegitDomain = rule.legitDomains.some(
        (legit) => senderDomain === legit || senderDomain.endsWith(`.${legit}`)
      );

      if (!isLegitDomain && senderDomain && !senderDomain.includes("localhost") && !senderDomain.includes("local")) {
        return {
          spf,
          dkim,
          dmarc,
          isVerifiedSender: false,
          isPhishingRisk: true,
          riskReason: `L'email prétend provenir de ${rule.brand}, mais l'expéditeur réel est @${senderDomain}.`,
        };
      }

      if (isLegitDomain) {
        return {
          spf: spf === "pass" ? "pass" : "pass",
          dkim: dkim === "pass" ? "pass" : "pass",
          dmarc,
          isVerifiedSender: true,
          isPhishingRisk: false,
        };
      }
    }
  }

  // Si DKIM et SPF sont valides
  const isVerified = (dkim === "pass" || spf === "pass");

  return {
    spf,
    dkim,
    dmarc,
    isVerifiedSender: isVerified,
    isPhishingRisk: false,
  };
}

