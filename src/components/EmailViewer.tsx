"use client";

import React, { useState, useEffect } from "react";
import { Email } from "@/types/email";
import { CodeDetectorBanner } from "./CodeDetectorBanner";
import { LinkDetectorBanner } from "./LinkDetectorBanner";
import { detectService } from "@/lib/services";
import { ServiceBadge } from "./ServiceBadge";
import {
  Mail,
  Calendar,
  User,
  AtSign,
  Copy,
  Check,
  Code,
  FileText,
  Trash2,
  QrCode,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface EmailViewerProps {
  email: Email | null;
  onDeleteEmail: (id: string) => void;
  onOpenQRCode: (email: Email) => void;
}

export function EmailViewer({ email, onDeleteEmail, onOpenQRCode }: EmailViewerProps) {
  // Par défaut, si l'email a du HTML (ex: Discord), on l'affiche en mode HTML pour avoir le beau bouton
  const [viewMode, setViewMode] = useState<"text" | "html">("text");
  const [copiedBody, setCopiedBody] = useState(false);

  useEffect(() => {
    if (email?.html) {
      setViewMode("html");
    } else {
      setViewMode("text");
    }
  }, [email?.id, email?.html]);

  if (!email) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-zinc-950/20">
        <div className="h-16 w-16 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-center text-zinc-600 mb-4">
          <Mail className="h-8 w-8" />
        </div>
        <h3 className="text-base font-semibold text-zinc-300">
          Aucun email sélectionné
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1">
          Sélectionnez un email pour afficher son contenu, son code ou son lien de confirmation.
        </p>
      </div>
    );
  }

  const service = detectService(email.from, email.subject, email.text);

  const handleCopyBody = async () => {
    try {
      await navigator.clipboard.writeText(email.text);
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const formattedDate = new Date(email.date).toLocaleString("fr-FR", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  // Transforme automatiquement les URLs du texte brut en liens cliquables
  const renderClickableText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s"'<>\)]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline font-semibold break-all inline-flex items-center gap-0.5"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Sécurise et prépare le HTML pour que tous les liens s'ouvrent dans un nouvel onglet
  const safeHtml = email.html
    ? email.html.replace(/<a\s+(?!.*?target=)/gi, '<a target="_blank" rel="noopener noreferrer" ')
    : "";

  return (
    <div className="h-full flex flex-col bg-zinc-950/30 overflow-y-auto">
      {/* 1. Bannière de code OTP si détecté */}
      {email.extractedCode && (
        <div className="p-4 sm:p-6 pb-0">
          <CodeDetectorBanner code={email.extractedCode} />
        </div>
      )}

      {/* 2. Bannière de lien de confirmation (Discord, etc.) si détecté */}
      {email.extractedLink && (
        <div className="p-4 sm:p-6 pb-0">
          <LinkDetectorBanner link={email.extractedLink} />
        </div>
      )}

      {/* 3. Bannière de Sécurité / Phishing */}
      {email.security?.isPhishingRisk ? (
        <div className="mx-4 sm:mx-6 mt-4 p-3.5 bg-rose-950/40 border border-rose-600/50 rounded-xl flex items-start gap-3 text-xs text-rose-200">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-300">Alerte de Sécurité / Suspicion d'usurpation</p>
            <p className="text-[11px] text-rose-400 mt-0.5">{email.security.riskReason}</p>
          </div>
        </div>
      ) : email.security?.isVerifiedSender ? (
        <div className="mx-4 sm:mx-6 mt-4 p-2.5 bg-emerald-950/30 border border-emerald-600/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Expéditeur authentifié et certifié (Signatures DKIM / SPF conformes)</span>
        </div>
      ) : null}

      {/* Meta Card */}
      <div className="p-4 sm:p-6 border-b border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {service && <ServiceBadge service={service} />}
            <h2 className="text-xl font-bold text-white tracking-tight break-words">
              {email.subject}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Bouton QR Code Mobile */}
            <button
              onClick={() => onOpenQRCode(email)}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-all"
              title="Afficher le QR code pour scanner sur mobile"
            >
              <QrCode className="h-3.5 w-3.5 text-blue-400" />
              <span className="hidden md:inline">QR Code</span>
            </button>

            {email.html && (
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("html")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                    viewMode === "html"
                      ? "bg-zinc-800 text-white font-medium"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Code className="h-3 w-3" />
                  <span>HTML</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("text")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                    viewMode === "text"
                      ? "bg-zinc-800 text-white font-medium"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <FileText className="h-3 w-3" />
                  <span>Texte</span>
                </button>
              </div>
            )}

            <button
              onClick={handleCopyBody}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-all"
              title="Copier le texte"
            >
              {copiedBody ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copié</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Copier</span>
                </>
              )}
            </button>

            <button
              onClick={() => onDeleteEmail(email.id)}
              type="button"
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 rounded-lg transition-all"
              title="Supprimer cet email"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Détails De / À / Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-400 pt-1">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span className="text-zinc-500">De :</span>
            <span className="text-zinc-200 font-medium truncate">{email.from}</span>
          </div>

          <div className="flex items-center gap-2">
            <AtSign className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span className="text-zinc-500">À :</span>
            <span className="text-zinc-200 font-mono text-[11px] truncate">{email.to}</span>
          </div>

          <div className="flex items-center gap-2 md:col-span-2">
            <Calendar className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span className="text-zinc-500">Date :</span>
            <span className="text-zinc-300">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Contenu du message */}
      <div className="p-4 sm:p-6 flex-1">
        {viewMode === "html" && safeHtml ? (
          <div className="rounded-xl border border-zinc-800 bg-[#313338] p-4 text-zinc-100 overflow-x-auto shadow-sm min-h-[300px]">
            <div
              dangerouslySetInnerHTML={{ __html: safeHtml }}
              className="prose prose-invert max-w-none text-sm [&_a]:text-blue-400 [&_a]:underline"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 font-mono text-xs sm:text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed selection:bg-blue-500/30 selection:text-white">
            {renderClickableText(email.text || "(Corps d'email vide)")}
          </div>
        )}
      </div>
    </div>
  );
}
