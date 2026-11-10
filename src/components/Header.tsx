"use client";

import React, { useState } from "react";
import {
  Mail,
  RefreshCw,
  Trash2,
  Radio,
  Check,
  Copy,
  Users,
  ChevronDown,
  Shield,
  Dices,
  LogIn,
  LogOut,
  User,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Zap,
  BarChart3,
  Layers,
  Keyboard,
  Download,
} from "lucide-react";
import { MailAccount, AuthenticatedUser } from "@/types/account";

interface HeaderProps {
  emailCount: number;
  isLoading: boolean;
  autoRefresh: boolean;
  currentAccountAddress: string;
  accounts: MailAccount[];
  currentUser: AuthenticatedUser | null;
  isGeneratingRandom?: boolean;
  soundEnabled: boolean;
  desktopNotifEnabled: boolean;
  autoCopyEnabled: boolean;
  onRefresh: () => void;
  onToggleAutoRefresh: () => void;
  onToggleSound: () => void;
  onToggleDesktopNotif: () => void;
  onToggleAutoCopy: () => void;
  onClearAll: () => void;
  onOpenAccountManager: () => void;
  onOpenBatchModal: () => void;
  onOpenStatsModal: () => void;
  onOpenShortcutsModal: () => void;
  onOpenAutomationModal: () => void;
  onOpenInstallModal: () => void;
  onSelectAccount: (address: string) => void;
  onGenerateRandomAccount: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export function Header({
  emailCount,
  isLoading,
  autoRefresh,
  currentAccountAddress,
  accounts,
  currentUser,
  isGeneratingRandom,
  soundEnabled,
  desktopNotifEnabled,
  autoCopyEnabled,
  onRefresh,
  onToggleAutoRefresh,
  onToggleSound,
  onToggleDesktopNotif,
  onToggleAutoCopy,
  onClearAll,
  onOpenAccountManager,
  onOpenBatchModal,
  onOpenStatsModal,
  onOpenShortcutsModal,
  onOpenAutomationModal,
  onOpenInstallModal,
  onSelectAccount,
  onGenerateRandomAccount,
  onOpenLogin,
  onLogout,
}: HeaderProps) {
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const copyWebhookUrl = () => {
    const fullUrl = `${window.location.origin}/api/webhooks/inbound`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const currentAccount = accounts.find((a) => a.address === currentAccountAddress);
  const isGlobalAdminView = currentAccountAddress === "all";
  const isAdmin = currentUser?.role === "admin";

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight">CatchMail</h1>
              <span className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Inbound actif
              </span>
              <a
                href="https://hebertik.fr"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-0.5 rounded-lg hover:bg-zinc-800/80 border border-zinc-800 transition-colors"
                title="Aller sur le Hub principal Hebertik"
              >
                <span>← Hub</span>
              </a>
            </div>
            <p className="text-xs text-zinc-400">
              Boîte multi-comptes & Détecteur OTP
            </p>
          </div>
        </div>

        {/* Center: Account Controls depending on User Role */}
        <div className="flex items-center gap-2">
          {/* CAS 1: Non connecté -> Bouton Connexion + Bouton Installer */}
          {!currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                type="button"
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-xl transition-all shadow-md shadow-blue-600/20"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Connexion (Email & MDP)</span>
              </button>

              <button
                onClick={onOpenInstallModal}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 rounded-xl transition-all shadow-sm"
                title="Installer CatchMail sur Windows / Mac / Mobile ou extension"
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                <span>Installer l&apos;App</span>
              </button>
            </div>
          ) : isAdmin ? (
            /* CAS 2: Administrateur -> Tous les privilèges (switcher, gérer, boîte aléatoire) */
            <>
              {/* Account Switcher */}
              <div className="relative">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 shadow-sm">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-xs font-medium text-white"
                  >
                    {isGlobalAdminView ? (
                      <>
                        <span className="text-amber-400 font-bold">👑</span>
                        <span>Vue Admin (Tous les mails)</span>
                      </>
                    ) : (
                      <>
                        <span className="h-2 w-2 rounded-full bg-blue-400" />
                        <span className="font-mono text-zinc-200 truncate max-w-[140px] sm:max-w-[180px]">
                          {currentAccount?.name || currentAccountAddress}
                        </span>
                      </>
                    )}
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-400 ml-1" />
                  </button>

                  <button
                    onClick={onOpenAccountManager}
                    className="px-2.5 py-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 border-l border-zinc-800 rounded-r-lg transition-colors flex items-center gap-1"
                    title="Gérer les boîtes mails"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Gérer</span>
                  </button>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1.5 z-50 divide-y divide-zinc-800"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className="p-1.5">
                      <button
                        onClick={() => onSelectAccount("all")}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                          isGlobalAdminView
                            ? "bg-blue-600 text-white font-semibold"
                            : "text-zinc-200 hover:bg-zinc-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>👑</span>
                          <div className="text-left">
                            <p>Vue Globale Admin</p>
                            <p className="text-[10px] text-zinc-400">Tous les emails du domaine</p>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="p-1.5 max-h-52 overflow-y-auto space-y-0.5">
                      <p className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 px-2 py-1">
                        Boîtes individuelles
                      </p>
                      {accounts.map((acc) => (
                        <button
                          key={acc.id}
                          onClick={() => onSelectAccount(acc.address)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                            currentAccountAddress === acc.address
                              ? "bg-blue-600 text-white font-medium"
                              : "text-zinc-300 hover:bg-zinc-800"
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="font-medium truncate">{acc.name}</p>
                            <p className="font-mono text-[10px] text-zinc-400 truncate">{acc.address}</p>
                          </div>
                          {acc.role === "admin" && (
                            <Shield className="h-3 w-3 text-amber-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="p-1.5 space-y-1">
                      <button
                        onClick={onGenerateRandomAccount}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 rounded-lg font-medium transition-colors"
                      >
                        <Dices className="h-3.5 w-3.5" />
                        <span>Générer une boîte aléatoire</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenAutomationModal();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-950/30 rounded-lg font-medium transition-colors"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        <span>⚡ Automatisation (Discord, Epic...)</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenInstallModal();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 rounded-lg font-medium transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>📥 Installer l&apos;App / Extension</span>
                      </button>
                      <button
                        onClick={onOpenAccountManager}
                        className="w-full text-center py-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
                      >
                        + Créer une boîte personnalisée
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Random Mailbox Generator Button (Admin Only) */}
              <button
                onClick={onGenerateRandomAccount}
                disabled={isGeneratingRandom}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 active:scale-95 disabled:opacity-50 border border-amber-800/40 rounded-xl transition-all shadow-sm"
                title="Générer instantanément une adresse email aléatoire sans doublon et la copier"
              >
                <Dices className={`h-3.5 w-3.5 text-amber-400 ${isGeneratingRandom ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Boîte Aléatoire</span>
                <span className="text-[10px] bg-amber-500/20 px-1 py-0.2 rounded text-amber-300 border border-amber-500/30">
                  Admin
                </span>
              </button>

              {/* Batch Creator Button (Admin Only) */}
              <button
                onClick={onOpenBatchModal}
                type="button"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all shadow-sm"
                title="Générateur de comptes en masse (5 à 100 boîtes)"
              >
                <Layers className="h-3.5 w-3.5 text-amber-400" />
                <span>En masse</span>
              </button>

              {/* Automation Button (Admin Only) */}
              <button
                onClick={onOpenAutomationModal}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-300 bg-violet-950/40 hover:bg-violet-900/60 active:scale-95 border border-violet-800/40 rounded-xl transition-all shadow-sm shadow-violet-950/30"
                title="Automatisation de création de comptes (Discord, Epic Games...)"
              >
                <Zap className="h-3.5 w-3.5 text-violet-400" />
                <span>Automatisation</span>
                <span className="text-[10px] bg-violet-500/20 px-1 py-0.2 rounded text-violet-300 border border-violet-500/30">
                  Admin
                </span>
              </button>
            </>
          ) : (
            /* CAS 3: Utilisateur standard connecté -> Uniquement sa propre boîte */
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl shadow-sm">
              <User className="h-3.5 w-3.5 text-blue-400" />
              <div className="text-left font-mono text-xs">
                <span className="text-white font-medium">{currentUser.name}</span>
                <span className="text-zinc-400 hidden sm:inline ml-1.5 text-[11px]">
                  ({currentUser.address})
                </span>
              </div>
            </div>
          )}

          {/* Bouton Déconnexion si connecté */}
          {currentUser && (
            <button
              onClick={onLogout}
              type="button"
              className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 border border-zinc-800 hover:border-rose-900/40 rounded-xl transition-all"
              title="Se déconnecter"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right Controls: Auto-copie, Sound, Notif, Refresh, Clear */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          {/* Auto-Copie Switch */}
          <button
            onClick={onToggleAutoCopy}
            type="button"
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-all ${
              autoCopyEnabled
                ? "bg-amber-950/40 border-amber-500/40 text-amber-300 shadow-sm"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
            title="Copier automatiquement le code OTP dans le presse-papier dès réception d'un mail"
          >
            <Zap className={`h-3.5 w-3.5 ${autoCopyEnabled ? "text-amber-400 fill-amber-400" : "text-zinc-500"}`} />
            <span className="hidden lg:inline text-[11px] font-medium">Auto-Copie</span>
          </button>

          {/* Sound Switch */}
          <button
            onClick={onToggleSound}
            type="button"
            className={`p-1.5 text-xs rounded-lg border transition-all ${
              soundEnabled
                ? "bg-blue-950/40 border-blue-500/40 text-blue-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
            title={soundEnabled ? "Bruitage 'Ding !' activé" : "Bruitage désactivé (cliquer pour activer)"}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>

          {/* Desktop Notification Switch */}
          <button
            onClick={onToggleDesktopNotif}
            type="button"
            className={`p-1.5 text-xs rounded-lg border transition-all ${
              desktopNotifEnabled
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
            title={
              desktopNotifEnabled
                ? "Notifications bureau actives"
                : "Activer les notifications Windows/bureau"
            }
          >
            {desktopNotifEnabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
          </button>

          {/* Stats Modal Button */}
          <button
            onClick={onOpenStatsModal}
            type="button"
            className="p-1.5 text-xs rounded-lg border bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 transition-all"
            title="Statistiques & Répartition des services"
          >
            <BarChart3 className="h-3.5 w-3.5" />
          </button>

          {/* Install App / Extension Button */}
          <button
            onClick={onOpenInstallModal}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 rounded-xl transition-all shadow-sm"
            title="Installer CatchMail (Application Windows / Mobile / Extension)"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Installer l&apos;App</span>
          </button>

          {/* Keyboard Shortcuts Button */}
          <button
            onClick={onOpenShortcutsModal}
            type="button"
            className="p-1.5 text-xs rounded-lg border bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 transition-all"
            title="Raccourcis clavier gamer (Touche ?)"
          >
            <Keyboard className="h-3.5 w-3.5" />
          </button>

          {/* Auto Refresh Switch */}
          <button
            onClick={onToggleAutoRefresh}
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-all ${
              autoRefresh
                ? "bg-blue-950/40 border-blue-500/40 text-blue-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
            title="Rafraîchissement automatique toutes les 3 secondes"
          >
            <Radio className={`h-3.5 w-3.5 ${autoRefresh ? "text-blue-400 animate-pulse" : "text-zinc-500"}`} />
            <span className="hidden sm:inline">Auto</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-800 hover:bg-zinc-700 active:scale-95 disabled:opacity-50 rounded-lg border border-zinc-700 transition-all shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
            <span className="hidden sm:inline">Rafraîchir</span>
          </button>

          {/* Clear All Button */}
          {emailCount > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir vider cette boîte mail ?")) {
                  onClearAll();
                }
              }}
              type="button"
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 rounded-lg transition-all"
              title="Vider la boîte"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
