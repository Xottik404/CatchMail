"use client";

import React from "react";
import { Mail, Bot, ArrowRight, Github, ExternalLink, Code2, Terminal, Users, Sparkles } from "lucide-react";

// Official Discord SVG icon
function DiscordIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function HubPage() {
  return (
    <div className="min-h-screen bg-[#070908] text-zinc-100 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-black relative overflow-hidden">
      {/* Subtle organic green ambient glow in background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-20 -right-20 w-[450px] h-[450px] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_20%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-3xl mx-auto w-full px-6 py-12 sm:py-20 flex-1 flex flex-col justify-center space-y-10">
        {/* Header: Name, description & Action buttons */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
          {/* Brand info */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 font-extrabold text-xl shadow-xl shadow-black/40">
              H
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">Hebertik</h1>
              <p className="text-sm text-zinc-400">Hub personnel & projets en ligne</p>
            </div>
          </div>

          {/* Social & Community Links */}
          <div className="flex items-center gap-2.5">
            {/* Discord Noctambulia Button */}
            <a
              href="https://discord.gg/noctambulia"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#5865F2]/20 hover:bg-[#5865F2] border border-[#5865F2]/40 hover:border-[#5865F2] rounded-xl transition-all duration-300 shadow-lg shadow-[#5865F2]/10 active:scale-95 group"
            >
              <DiscordIcon className="h-4 w-4 text-[#8891f2] group-hover:text-white transition-colors" />
              <span>Discord Noctambulia</span>
              <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
            </a>

            {/* GitHub Button */}
            <a
              href="https://github.com/Xottik404/CatchMail"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all duration-200"
              title="Voir sur GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </header>

        {/* Section: Grosses Boxes de Services */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
              Services & Applications
            </h2>
            <span className="text-xs font-mono text-zinc-600">2 projets actifs</span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* 1. CatchMail (Grande Box) */}
            <a
              href="https://mail.hebertik.fr"
              className="group relative block p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900/80 via-zinc-900/40 to-zinc-950/90 border border-zinc-800/90 hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.14)] transition-all duration-300 overflow-hidden"
            >
              {/* Subtle hover background highlight */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-all duration-300 pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  {/* Large Icon Box */}
                  <div className="h-16 w-16 rounded-2xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-emerald-500/50 group-hover:bg-emerald-950/60 transition-all duration-300 shadow-lg shadow-black/30">
                    <Mail className="h-8 w-8" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors tracking-tight">
                        CatchMail
                      </h3>
                      <span className="text-xs font-mono text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/40">
                        mail.hebertik.fr
                      </span>
                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                      Boîte de réception catch-all ultra-rapide. Détecte instantanément les codes OTP de vérification (Discord, Epic Games, Steam...) avec injection directe dans le presse-papier et automatisation de création de comptes.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-zinc-500">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800">Catch-All</span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800">Auto-Copie OTP</span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800">PWA Windows/Mobile</span>
                    </div>
                  </div>
                </div>

                {/* Big Action Arrow */}
                <div className="self-end sm:self-center h-11 w-11 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-400 transition-all duration-300 shadow-md">
                  <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </div>
            </a>

            {/* 2. RagyBot (Grande Box) */}
            <a
              href="https://141.11.103.100.nip.io"
              target="_blank"
              rel="noreferrer"
              className="group relative block p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900/80 via-zinc-900/40 to-zinc-950/90 border border-zinc-800/90 hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.14)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-all duration-300 pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  {/* Large Icon Box */}
                  <div className="h-16 w-16 rounded-2xl bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:text-emerald-400 group-hover:border-emerald-800/50 group-hover:bg-zinc-800/80 transition-all duration-300 shadow-lg shadow-black/30">
                    <Bot className="h-8 w-8" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors tracking-tight">
                        RagyBot
                      </h3>
                      <span className="text-xs font-mono text-zinc-400 px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700/60">
                        Bot Discord
                      </span>
                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                      Interface et gestion du bot Discord hébergé sur le serveur. Commandes, intégrations et fonctionnalités pour serveurs Discord.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-zinc-500">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800">Discord API</span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800">Dashboard Web</span>
                    </div>
                  </div>
                </div>

                {/* Big Action Arrow */}
                <div className="self-end sm:self-center h-11 w-11 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-400 transition-all duration-300 shadow-md">
                  <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* Section Infos / À propos (Non-personnel, pseudo & stack) */}
        <section className="p-6 sm:p-7 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span>À propos du projet</span>
          </div>

          <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
            <p>
              Développé par <strong className="text-white">Hebertik</strong> (<span className="font-mono text-zinc-400">@Xottik_Suix</span>). Cet espace sert de point d&apos;entrée pour héberger mes micro-services web, mes outils d&apos;automatisation et les projets liés à la communauté Discord <strong>Noctambulia</strong>.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-zinc-400">
              <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800/80">Next.js & React</span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800/80">Node.js & TypeScript</span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800/80">Tailwind CSS</span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800/80">Discord API</span>
            </div>
          </div>
        </section>
      </div>

      {/* Clean Footer */}
      <footer className="relative z-10 max-w-3xl mx-auto w-full px-6 py-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <span className="font-mono">hebertik.fr • Hub personnel</span>

        <div className="flex items-center gap-5 text-zinc-400">
          <a
            href="https://discord.gg/noctambulia"
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-400 transition-colors"
          >
            Discord Noctambulia
          </a>
          <span>•</span>
          <a
            href="https://github.com/Xottik404/CatchMail"
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
