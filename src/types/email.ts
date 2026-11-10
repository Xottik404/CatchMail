export interface EmailSecurity {
  spf?: "pass" | "fail" | "none";
  dkim?: "pass" | "fail" | "none";
  dmarc?: "pass" | "fail" | "none";
  isVerifiedSender?: boolean;
  isPhishingRisk?: boolean;
  riskReason?: string;
}

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  date: string;
  extractedCode?: string | null;
  extractedLink?: string | null;
  security?: EmailSecurity;
  read?: boolean;
}

export type CreateEmailInput = Omit<Email, "id"> & { id?: string };

