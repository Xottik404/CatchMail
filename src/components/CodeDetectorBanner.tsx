"use client";

import React, { useState } from "react";
import { Check, Copy, KeyRound, Sparkles } from "lucide-react";

interface CodeDetectorBannerProps {
  code: string;
}

export function CodeDetectorBanner({ code }: CodeDetectorBannerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Impossible de copier", err);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-blue-900/20 p-4 sm:p-5 shadow-lg shadow-blue-500/5 backdrop-blur-sm">
      {/* Glow decorative effect */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <KeyRound className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-blue-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Code de vérification détecté
              </span>
              <span className="text-[10px] rounded-full bg-blue-500/20 px-2 py-0.5 font-medium text-blue-300 border border-blue-500/30">
                {code.length} chiffres
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Extrait automatiquement du message pour une saisie rapide.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Big Code Display */}
          <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-white px-4 py-2 bg-zinc-900/90 rounded-lg border border-zinc-800 shadow-inner select-all">
            {code}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 ${
              copied
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                <span>Copié !</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

