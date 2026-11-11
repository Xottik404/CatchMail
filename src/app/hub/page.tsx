"use client";

import React, { useState, useEffect } from "react";
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
  Copy,
  Check,
  Bot,
  Key,
  Globe,
  Clock,
  Radio,
  Lock,
  Code2,
  Download,
  Flame,
  Send,
} from "lucide-react";
import { generateStrongPassword } from "@/lib/utils";

export default function HubPage() {
  const [time, setTime] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [generatedPass, setGeneratedPass] = useState(() => generateStrongPassword(16));
  const [activePreviewOtp, setActivePreviewOtp] = useState("482910");
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Digital clock (Paris Time)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Europe/Paris",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === "m") {
        window.location.href = "https://mail.hebertik.fr";
      } else if (e.key.toLowerCase() === "b") {
        window.open("https://141.11.103.100.nip.io", "_blank");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 1800);
  };

  const handleCopyMockOtp = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 1800);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background High-Tech Grid & Cyber Mesh Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-blue-600/20 via-indigo-600/15 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/4 -left-48 w-[400px] h-[400px] bg-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-20 -right-48 w-[450px] h-[450px] bg-blue-600/15 blur-[140px] rounded-full" />
      </div>

      {/* Top Floating Glass Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#07090e]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-white shadow-xl">
                <Layers className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Hebertik
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-800/50">
                  HUB
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-500 hidden sm:block">
                Infrastructure & Services Personnels
              </p>
            </div>
          </div>

          {/* Center Info: Live Clock & System Status */}
          <div className="hidden md:flex items-center gap-3 bg-zinc-950/80 border border-zinc-800/80 rounded-full px-3.5 py-1.5 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              <span>{time || "00:00:00"} CET</span>
            </div>
            <span className="h-3 w-px bg-zinc-800" />
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>VPS 100% Opérationnel</span>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleCopy("141.11.103.100", "vps-ip")}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-400 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all"
              title="Copier l'adresse IP du serveur VPS"
            >
              {copiedText === "vps-ip" ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Terminal className="h-3.5 w-3.5 text-zinc-500" />
              )}
              <span>141.11.103.100</span>
            </button>

            <a
              href="https://mail.hebertik.fr"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-95"
            >
              <Mail className="h-4 w-4" />
              <span>Ouvrir CatchMail</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full flex flex-col justify-center">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-14">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800/90 text-xs font-mono shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300 font-semibold">Production Cloud :</span>
            <span className="text-blue-400">hebertik.fr</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Debian Linux VPS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Centre de Contrôle & <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Services Hebertik
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Plateforme personnelle regroupant boîtes transactionnelles catch-all, automatisation de comptes
            de jeux, assistants IA et micro-services hébergés 24h/24.
          </p>

          {/* Keyboard Quick Navigation Reminder */}
          <div className="flex items-center justify-center gap-3 text-xs text-zinc-500 font-mono pt-1">
            <span>Raccourcis :</span>
            <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]">
              Touche M
            </kbd>
            <span>CatchMail</span>
            <span className="text-zinc-700">•</span>
            <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]">
              Touche B
            </kbd>
            <span>RagyBot</span>
          </div>
        </div>

        {/* Top Flagship Grid: CatchMail (Featured Full Width or 2/3) + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Main Showcase: CatchMail Flagship (8 cols) */}
          <div className="lg:col-span-8 group relative rounded-3xl bg-gradient-to-br from-zinc-900/90 via-[#0d121f] to-zinc-950 border border-zinc-800/90 hover:border-blue-500/50 transition-all duration-300 shadow-2xl overflow-hidden flex flex-col justify-between p-6 sm:p-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-600/25 transition-all" />

            <div>
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Mail className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-white tracking-tight">CatchMail</h3>
                      <span className="px-2.5 py-0.5 text-xs font-bold font-mono rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        mail.hebertik.fr
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      Boîte Inbound Catch-All • Détection OTP • Automatisation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800/50 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    En Ligne & Sécurisé SSL
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                Réceptionnez instantanément tous les emails envoyés à n&apos;importe quelle adresse de votre domaine{" "}
                <strong className="text-white">@mail.hebertik.fr</strong>. Détecte automatiquement les codes de
                vérification (Discord, Epic Games, Steam...) avec injection directe dans le presse-papier et génération de
                profils de joueurs.
              </p>

              {/* Interactive Mock Preview Widget */}
              <div className="p-4 rounded-2xl bg-[#080c14]/90 border border-zinc-800/80 mb-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800/80 font-mono">
                  <div className="flex items-center gap-2">
                    <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                    <span>Dernier email intercepté en direct :</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">Il y a quelques instants</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Discord Support</span>
                      <span className="text-[10px] text-zinc-500 font-mono">notifications@discord.com</span>
                    </div>
                    <p className="text-xs text-zinc-300">Votre code de confirmation Discord</p>
                  </div>

                  <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-1.5">
                    <span className="font-mono text-base font-black tracking-widest text-amber-300">
                      {activePreviewOtp}
                    </span>
                    <button
                      onClick={() => handleCopyMockOtp(activePreviewOtp)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
                      title="Copier le code de vérification"
                    >
                      {copiedOtp ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedOtp ? "Copié !" : "Copier"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature Tags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono text-zinc-300">
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Auto-Copie OTP</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Multi-Comptes</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Discord & Epic</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center gap-2">
                  <Download className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>App Windows PWA</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-zinc-800/80 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Globe className="h-4 w-4 text-blue-400" />
                <span>Accessible sur : </span>
                <a
                  href="https://mail.hebertik.fr"
                  className="text-white hover:underline font-semibold"
                >
                  https://mail.hebertik.fr
                </a>
              </div>

              <a
                href="https://mail.hebertik.fr"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/30 group-hover:translate-x-1"
              >
                <span>Accéder à la boîte de réception</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right Column: RagyBot & Gamer Password Tool (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Service 2: RagyBot */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800/90 hover:border-violet-500/50 transition-all flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">RagyBot</h4>
                      <p className="text-xs text-zinc-400 font-mono">Service Discord & Assistant</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    En Ligne
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                  Application Discord et micro-service actif sur votre VPS, isolé sur son propre port et accessible en
                  permanence.
                </p>

                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-zinc-400">
                    <span>Gestionnaire</span>
                    <span className="text-white">PM2 (ID #0)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Statut</span>
                    <span className="text-emerald-400 font-semibold">Online (9D+)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 mt-5">
                <a
                  href="https://141.11.103.100.nip.io"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-violet-200 bg-violet-950/50 hover:bg-violet-900/60 border border-violet-800/50 rounded-xl transition-all shadow-md shadow-violet-950/30"
                >
                  <span>Ouvrir RagyBot</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Tool: Instant Gamer Password Generator */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900/90 to-zinc-950 border border-zinc-800/90 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Générateur Rapide</h4>
                    <p className="text-[10px] text-zinc-400 font-mono">Mot de passe robuste (16 car.)</p>
                  </div>
                </div>

                <button
                  onClick={() => setGeneratedPass(generateStrongPassword(16))}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Régénérer
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs">
                <span className="text-amber-300 tracking-wider truncate select-all">{generatedPass}</span>
                <button
                  onClick={() => handleCopy(generatedPass, "quick-pass")}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
                  title="Copier le mot de passe"
                >
                  {copiedText === "quick-pass" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Server Infrastructure & Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {/* Card 1: Infrastructure */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Serveur Dédié VPS</h4>
                  <p className="text-xs text-zinc-500 font-mono">Ubuntu / Debian Linux</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono text-zinc-300">
                <div className="flex justify-between py-1 border-b border-zinc-800/80">
                  <span className="text-zinc-500">IP Publique</span>
                  <span className="text-white">141.11.103.100</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/80">
                  <span className="text-zinc-500">Reverse Proxy</span>
                  <span className="text-white">Nginx 1.24+</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Gestionnaire</span>
                  <span className="text-emerald-400">PM2 Service Daemon</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Système actif 24h/24</span>
            </div>
          </div>

          {/* Card 2: Sécurité SSL */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sécurité SSL & Chiffrement</h4>
                  <p className="text-xs text-zinc-500 font-mono">Let&apos;s Encrypt Authority</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono text-zinc-300">
                <div className="flex justify-between py-1 border-b border-zinc-800/80">
                  <span className="text-zinc-500">Chiffrement</span>
                  <span className="text-emerald-400">TLS 1.3 / HTTPS</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/80">
                  <span className="text-zinc-500">Auto-Renew</span>
                  <span className="text-white">Certbot Systemd</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Redirection</span>
                  <span className="text-white">HTTP → HTTPS (301)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Certificats valides</span>
            </div>
          </div>

          {/* Card 3: Réseau & Inbound MX */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Routage Email & MX</h4>
                  <p className="text-xs text-zinc-500 font-mono">Resend Cloud Pipeline</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono text-zinc-300">
                <div className="flex justify-between py-1 border-b border-zinc-800/80">
                  <span className="text-zinc-500">Serveur MX</span>
                  <span className="text-white">rmta.net (Prio 10)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/80">
                  <span className="text-zinc-500">Inbound Webhook</span>
                  <span className="text-purple-300">mail.hebertik.fr</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Catch-All</span>
                  <span className="text-emerald-400">Actif (Tous destinataires)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Flux d&apos;emails en temps réel</span>
            </div>
          </div>
        </div>
      </main>

      {/* Futuristic Clean Footer */}
      <footer className="relative z-10 border-t border-zinc-800/80 bg-[#07090e] px-4 sm:px-8 py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 font-mono font-bold text-xs">
              H
            </div>
            <div>
              <p className="font-semibold text-zinc-300">Hebertik Infrastructure Hub</p>
              <p className="text-[11px] text-zinc-600">Déployé sur VPS Linux • Tous droits réservés</p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-zinc-400">
            <a
              href="https://mail.hebertik.fr"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>CatchMail</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span>•</span>
            <a
              href="https://141.11.103.100.nip.io"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>RagyBot</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span>•</span>
            <a
              href="https://github.com/Xottik404/CatchMail"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
