"use client";

import React, { useState } from "react";
import { ExternalLink, Copy, Check, Link2, Sparkles } from "lucide-react";

interface LinkDetectorBannerProps {
  link: string;
}

export function LinkDetectorBanner({ link }: LinkDetectorBannerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Impossible de copier", err);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 via-purple-950/30 to-blue-950/30 p-4 sm:p-5 shadow-lg shadow-indigo-500/5 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Link2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Lien de confirmation détecté
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 max-w-md font-mono text-[11px]">
              {link}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Open Link Button */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <span>Vérifier le compte</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          {/* Copy Link Button */}
          <button
            onClick={handleCopy}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
              copied
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
            }`}
            title="Copier le lien complet"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Copié</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copier</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

