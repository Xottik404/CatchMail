"use client";

import React from "react";
import { Mail, Bot, Server, ExternalLink, Github, ArrowUpRight } from "lucide-react";

export default function HubPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between font-sans selection:bg-zinc-800 selection:text-white px-6 py-12 sm:py-20">
      <div className="max-w-2xl mx-auto w-full space-y-12">
        {/* Header simple & épuré */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-white text-sm">
                H
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">Hebertik</h1>
                <p className="text-xs text-zinc-400">Portail personnel & services</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>VPS en ligne</span>
            </div>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed pt-2">
            Services hébergés sur mon serveur personnel. Accès direct aux applications et outils en ligne.
          </p>
        </header>

        {/* Liste des vrais services */}
        <main className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-1">
            Services actifs
          </h2>

          <div className="space-y-3">
            {/* 1. CatchMail */}
            <a
              href="https://mail.hebertik.fr"
              className="group block p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">
                        CatchMail
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-800">
                        mail.hebertik.fr
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Boîte de messagerie temporaire catch-all avec détection automatique des codes de confirmation (Discord, Epic, Steam...).
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
              </div>
            </a>

            {/* 2. RagyBot */}
            <a
              href="https://141.11.103.100.nip.io"
              target="_blank"
              rel="noreferrer"
              className="group block p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm group-hover:text-violet-400 transition-colors">
                        RagyBot
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-800">
                        Bot Discord
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Interface et gestion du bot Discord hébergé sur le VPS.
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
              </div>
            </a>
          </div>
        </main>

        {/* Détails techniques simples & réels */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-1">
            Infrastructure
          </h2>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-xs font-mono text-zinc-300 space-y-2">
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-400">Serveur</span>
              <span className="text-white">VPS Linux (Debian)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-400">IP Publique</span>
              <span className="text-white">141.11.103.100</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-400">Web / Proxy</span>
              <span className="text-white">Nginx + SSL Let&apos;s Encrypt</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Process Manager</span>
              <span className="text-white">PM2 (catchmail-hub & ragybot)</span>
            </div>
          </div>
        </section>
      </div>

      {/* Footer minimaliste */}
      <footer className="max-w-2xl mx-auto w-full pt-12 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
        <span>© {new Date().getFullYear()} Hebertik</span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Xottik404/CatchMail"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
