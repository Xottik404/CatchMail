"use client";

import React, { useState } from "react";
import { Mail, Bot, ArrowRight, Github, Sparkles, Copy, Check } from "lucide-react";

export default function HubPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@hebertik.fr");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070908] text-zinc-100 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-black relative overflow-hidden">
      {/* Subtle organic green ambient glow in the background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full" />
        {/* Soft grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-xl mx-auto w-full px-6 py-16 sm:py-24 flex-1 flex flex-col justify-center">
        {/* Profile / Intro Header */}
        <header className="space-y-4 mb-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="flex items-center justify-between">
            {/* Avatar & Name */}
            <div className="flex items-center gap-3.5">
              <div className="relative group">
                <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-lg group-hover:border-emerald-500/50 transition-all duration-300">
                  <span>H</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#070908]" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Hebertik</span>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    online
                  </span>
                </h1>
                <p className="text-xs text-zinc-400">Hub personnel & projets</p>
              </div>
            </div>

            {/* Quick Contact Pill */}
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-emerald-300 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-emerald-500/30 rounded-xl transition-all duration-200 active:scale-95"
              title="Copier mon email de contact"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Contact</span>
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed pt-1">
            Bienvenue sur mon espace. Retrouvez ici l&apos;accès direct à mes applications et services en ligne.
          </p>
        </header>

        {/* Services Cards */}
        <main className="space-y-3.5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
              Services
            </span>
            <span className="text-[11px] font-mono text-zinc-600">2 disponibles</span>
          </div>

          {/* 1. CatchMail Card */}
          <a
            href="https://mail.hebertik.fr"
            className="group relative block p-5 rounded-2xl bg-gradient-to-b from-zinc-900/70 to-zinc-900/30 border border-zinc-800/80 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] transition-all duration-300 overflow-hidden"
          >
            {/* Soft inner glow on hover */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 blur-2xl rounded-full group-hover:bg-emerald-500/10 transition-all duration-300 pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 group-hover:border-emerald-500/50 transition-all duration-300">
                  <Mail className="h-5 w-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                      CatchMail
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400/90 px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-800/30">
                      mail.hebertik.fr
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed pr-2">
                    Boîte de messagerie catch-all avec détection automatique et copie instantanée des codes de confirmation (Discord, Epic Games, Steam...).
                  </p>
                </div>
              </div>

              {/* Animated arrow */}
              <div className="h-8 w-8 rounded-lg bg-zinc-800/50 border border-zinc-700/40 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-400 transition-all duration-300">
                <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </div>
          </a>

          {/* 2. RagyBot Card */}
          <a
            href="https://141.11.103.100.nip.io"
            target="_blank"
            rel="noreferrer"
            className="group relative block p-5 rounded-2xl bg-gradient-to-b from-zinc-900/70 to-zinc-900/30 border border-zinc-800/80 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 blur-2xl rounded-full group-hover:bg-emerald-500/10 transition-all duration-300 pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 group-hover:text-emerald-400 group-hover:border-emerald-800/40 transition-all duration-300">
                  <Bot className="h-5 w-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                      RagyBot
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700/50">
                      Discord
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed pr-2">
                    Interface web et gestion du bot Discord personnel.
                  </p>
                </div>
              </div>

              {/* Animated arrow */}
              <div className="h-8 w-8 rounded-lg bg-zinc-800/50 border border-zinc-700/40 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-400 transition-all duration-300">
                <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </div>
          </a>
        </main>
      </div>

      {/* Clean & Discreet Footer */}
      <footer className="relative z-10 max-w-xl mx-auto w-full px-6 py-8 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>hebertik.fr</span>
        </div>

        <a
          href="https://github.com/Xottik404/CatchMail"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <Github className="h-3.5 w-3.5" />
          <span>GitHub</span>
        </a>
      </footer>
    </div>
  );
}
