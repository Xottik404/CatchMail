export type UserRole = "admin" | "user";

export interface MailAccount {
  id: string;
  name: string;
  address: string; // ex: "thimeo@mail.hebertik.fr"
  password: string; // Mot de passe robuste bloc-notes
  role: UserRole;
  createdAt: string;
}

export type CreateAccountInput = Omit<MailAccount, "id" | "createdAt"> & {
  password?: string;
};

export type AuthenticatedUser = Omit<MailAccount, "password">;

export type AutomationService = "discord" | "epic" | "steam";

export interface AutomatedProfile {
  id: string;
  service: AutomationService;
  username: string;
  email: string;
  password: string;
  dateOfBirth: string;
  status: "pending" | "email_received" | "completed";
  verificationCode?: string | null;
  verificationLink?: string | null;
  createdAt: string;
}
