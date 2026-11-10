import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CatchMail — Inbound Catch-all & Détecteur OTP",
  description: "Mini-application de boîte de réception Inbound catch-all pour emails transactionnels et codes de vérification.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
