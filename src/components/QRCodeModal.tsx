"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Email } from "@/types/email";
import { X, QrCode, KeyRound, ExternalLink, Copy, Check, Smartphone } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: Email | null;
}

export function QRCodeModal({ isOpen, onClose, email }: QRCodeModalProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [targetType, setTargetType] = useState<"code" | "link" | "text">("code");

  useEffect(() => {
    if (!email) return;

    // Pick best default
    if (email.extractedCode) {
      setTargetType("code");
    } else if (email.extractedLink) {
      setTargetType("link");
    } else {
      setTargetType("text");
    }
  }, [email]);

  useEffect(() => {
    if (!email || !isOpen) return;

    let payload = "";
    if (targetType === "code" && email.extractedCode) {
      payload = email.extractedCode;
    } else if (targetType === "link" && email.extractedLink) {
      payload = email.extractedLink;
    } else {
      payload = email.text.slice(0, 500); // keep reasonable for QR code density
    }

    QRCode.toDataURL(payload || "CatchMail", {
      width: 280,
      margin: 1.5,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error("Erreur génération QR Code:", err));
  }, [email, isOpen, targetType]);

  if (!isOpen || !email) return null;

  const currentPayload =
    targetType === "code"
      ? email.extractedCode || ""
      : targetType === "link"
      ? email.extractedLink || ""
      : email.text;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Scanner sur Mobile</h3>
              <p className="text-[11px] text-zinc-400">Ouvrez l'appareil photo de votre smartphone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab switchers if multiple types available */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 mb-4 text-xs">
          {email.extractedCode && (
            <button
              onClick={() => setTargetType("code")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 ${
                targetType === "code"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <KeyRound className="h-3 w-3" />
              <span>Code OTP</span>
            </button>
          )}

          {email.extractedLink && (
            <button
              onClick={() => setTargetType("link")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 ${
                targetType === "link"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <ExternalLink className="h-3 w-3" />
              <span>Lien</span>
            </button>
          )}

          <button
            onClick={() => setTargetType("text")}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors ${
              targetType === "text"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>Message</span>
          </button>
        </div>

        {/* QR Code Canvas */}
        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-inner mb-4">
          {dataUrl ? (
            <img src={dataUrl} alt="QR Code" className="w-56 h-56 rounded-lg select-none" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-zinc-400">
              Génération...
            </div>
          )}
        </div>

        {/* Value preview & copy */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 mb-3 flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-zinc-300 truncate select-all">
            {targetType === "code" ? (
              <strong className="text-blue-400 text-sm tracking-widest">{email.extractedCode}</strong>
            ) : (
              currentPayload
            )}
          </span>
          <button
            onClick={handleCopy}
            className="shrink-0 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            title="Copier"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

