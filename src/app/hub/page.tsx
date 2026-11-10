"use client";

import React from "react";
import {
  Mail,
  Zap,
  Server,
  Shield,
  ExternalLink,
  ChevronRight,
  Terminal,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function HubPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">Hebertik</span>
              <span className="text-xs text-blue-400 font-mono ml-1.5 px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-800/40">
                HUB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Système en ligne</span>
            </div>

            <a
              href="https://mail.hebertik.fr"
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/25"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>CatchMail</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-6 py-12 w-full flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-400 font-mono">
            <Terminal className="h-3.5 w-3.5 text-blue-400" />
            <span>vps.hebertik.fr — Ubuntu / Linux</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Portail Central{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Hebertik
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Plateforme d&apos;hébergement de micro-services, boîtes de réception transactional
            et outils d&apos;automatisation déployés sur VPS Linux.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {/* Service 1: CatchMail (Featured) */}
          <div className="group relative md:col-span-2 lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-950 border border-zinc-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-blue-500/15 transition-all" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        CatchMail
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          mail.hebertik.fr
                        </span>
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono">Boîte Transactionnelle & OTP</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En production
                  </span>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  Boîte de réception catch-all ultra-rapide connectée à <strong>mail.hebertik.fr</strong>.
                  Détecte automatiquement les codes de vérification (Discord, Epic Games, Steam...) avec copie
                  en 1-clic, générateur de profils et création de boîtes aléatoires.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-zinc-400 font-mono">
                  <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Auto-Copie OTP</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Multi-Comptes</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>Automatisation</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500">
                  https://mail.hebertik.fr
                </span>
                <a
                  href="https://mail.hebertik.fr"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/30 group-hover:translate-x-0.5"
                >
                  <span>Ouvrir la boîte</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Service 2: Automatisation & Bots */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-violet-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Intégré
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">Automatisation Comptes</h3>
              <p className="text-xs text-zinc-400 font-mono mb-3">Discord & Epic Games</p>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Assistant de création de comptes gamer avec génération de profils, mots de passe robustes et écoute en direct des emails d&apos;activation.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800 mt-6">
              <a
                href="https://mail.hebertik.fr"
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-violet-300 bg-violet-950/40 hover:bg-violet-900/60 border border-violet-800/40 rounded-xl transition-all"
              >
                <span>Accéder via CatchMail</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Service 3: Serveur & Infrastructure */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Server className="h-5 w-5" />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VPS Linux
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">Infrastructure</h3>
              <p className="text-xs text-zinc-400 font-mono mb-3">Nginx • PM2 • Node.js</p>

              <div className="space-y-2 text-xs text-zinc-300">
                <div className="flex items-center justify-between py-1 border-b border-zinc-800/80">
                  <span className="text-zinc-400">Reverse Proxy</span>
                  <span className="font-mono text-white">Nginx + SSL</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-zinc-800/80">
                  <span className="text-zinc-400">Certificats</span>
                  <span className="font-mono text-emerald-400">Let&apos;s Encrypt</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-zinc-400">Inbound Mail</span>
                  <span className="font-mono text-white">Resend MX</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 mt-6 flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <CheckCircle2 className="h-4 w-4" />
              <span>Services opérationnels</span>
            </div>
          </div>

          {/* Service 4: Extension & Outils */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Cpu className="h-5 w-5" />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Chrome / Edge
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">CatchMail Companion</h3>
              <p className="text-xs text-zinc-400 font-mono mb-3">Extension Navigateur</p>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Extension de navigateur pour recevoir les notifications et copier les codes OTP directement sans quitter votre page web.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800 mt-6">
              <a
                href="https://mail.hebertik.fr"
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all"
              >
                <span>Voir les détails</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Service 5: Slot Projet Futur */}
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 border-dashed flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-zinc-800 text-zinc-500 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-zinc-800 text-zinc-400">
                  Bientôt
                </span>
              </div>

              <h3 className="text-base font-bold text-zinc-400 mb-1">Nouveaux Services</h3>
              <p className="text-xs text-zinc-500 font-mono mb-3">Emplacement réservé</p>

              <p className="text-xs text-zinc-500 leading-relaxed">
                Connectez vos prochains projets, bots Discord ou tableaux de bord sur le domaine hebertik.fr.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/60 mt-6 text-center text-xs text-zinc-600 font-mono">
              En développement
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/80 bg-zinc-950 px-6 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Hebertik. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <a href="https://mail.hebertik.fr" className="hover:text-white transition-colors">
              mail.hebertik.fr
            </a>
            <span>•</span>
            <span className="text-zinc-600">VPS Linux Hosted</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

