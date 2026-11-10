export interface ServiceInfo {
  id: string;
  name: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
}

export function detectService(from: string, subject = "", text = ""): ServiceInfo | null {
  const combined = `${from} ${subject} ${text}`.toLowerCase();

  if (combined.includes("discord")) {
    return {
      id: "discord",
      name: "Discord",
      badgeBg: "bg-[#5865F2]/20",
      badgeBorder: "border-[#5865F2]/50",
      textColor: "text-[#8891f2]",
    };
  }

  if (combined.includes("epicgames") || combined.includes("epic games") || combined.includes("fortnite")) {
    return {
      id: "epic",
      name: "Epic Games",
      badgeBg: "bg-zinc-800",
      badgeBorder: "border-zinc-600",
      textColor: "text-zinc-200",
    };
  }

  if (combined.includes("steampowered") || combined.includes("steam guard") || combined.includes("valve")) {
    return {
      id: "steam",
      name: "Steam",
      badgeBg: "bg-[#171a21]",
      badgeBorder: "border-[#66c0f4]/40",
      textColor: "text-[#66c0f4]",
    };
  }

  if (combined.includes("github")) {
    return {
      id: "github",
      name: "GitHub",
      badgeBg: "bg-zinc-900",
      badgeBorder: "border-zinc-700",
      textColor: "text-zinc-100",
    };
  }

  if (combined.includes("google") || combined.includes("gmail") || combined.includes("youtube")) {
    return {
      id: "google",
      name: "Google",
      badgeBg: "bg-red-950/30",
      badgeBorder: "border-red-500/40",
      textColor: "text-red-400",
    };
  }

  if (combined.includes("ubisoft") || combined.includes("ubi.com")) {
    return {
      id: "ubisoft",
      name: "Ubisoft",
      badgeBg: "bg-blue-950/30",
      badgeBorder: "border-blue-400/40",
      textColor: "text-blue-300",
    };
  }

  if (combined.includes("riotgames") || combined.includes("valorant") || combined.includes("league of legends")) {
    return {
      id: "riot",
      name: "Riot Games",
      badgeBg: "bg-red-950/40",
      badgeBorder: "border-red-600/50",
      textColor: "text-red-400",
    };
  }

  if (combined.includes("xbox") || combined.includes("microsoft")) {
    return {
      id: "microsoft",
      name: "Microsoft / Xbox",
      badgeBg: "bg-emerald-950/30",
      badgeBorder: "border-emerald-500/40",
      textColor: "text-emerald-400",
    };
  }

  if (combined.includes("twitch")) {
    return {
      id: "twitch",
      name: "Twitch",
      badgeBg: "bg-purple-950/40",
      badgeBorder: "border-purple-500/40",
      textColor: "text-purple-300",
    };
  }

  if (combined.includes("roblox")) {
    return {
      id: "roblox",
      name: "Roblox",
      badgeBg: "bg-zinc-900",
      badgeBorder: "border-red-500/40",
      textColor: "text-red-400",
    };
  }

  if (combined.includes("amazon")) {
    return {
      id: "amazon",
      name: "Amazon",
      badgeBg: "bg-amber-950/30",
      badgeBorder: "border-amber-500/40",
      textColor: "text-amber-400",
    };
  }

  if (combined.includes("netflix")) {
    return {
      id: "netflix",
      name: "Netflix",
      badgeBg: "bg-red-950/50",
      badgeBorder: "border-red-600/50",
      textColor: "text-red-500",
    };
  }

  return null;
}

