"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Email } from "@/types/email";
import { MailAccount, AuthenticatedUser } from "@/types/account";
import { Header } from "@/components/Header";
import { EmailList } from "@/components/EmailList";
import { EmailViewer } from "@/components/EmailViewer";
import { AccountManagerModal } from "@/components/AccountManagerModal";
import { LoginModal } from "@/components/LoginModal";
import { QRCodeModal } from "@/components/QRCodeModal";
import { BatchGeneratorModal } from "@/components/BatchGeneratorModal";
import { StatsModal } from "@/components/StatsModal";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { AutomationModal } from "@/components/AutomationModal";
import { InstallAppModal } from "@/components/InstallAppModal";
import { playNotificationSound } from "@/lib/sound";
import {
  requestDesktopNotificationPermission,
  sendDesktopNotification,
} from "@/lib/notifications";
import { ArrowLeft, Key, Copy, Check, Download, FileText, X, Zap } from "lucide-react";

export default function Dashboard() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [accounts, setAccounts] = useState<MailAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentAccountAddress, setCurrentAccountAddress] = useState<string>("all");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isMobileViewingEmail, setIsMobileViewingEmail] = useState(false);
  const [isAccountManagerOpen, setIsAccountManagerOpen] = useState(false);
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);
  const [createdAccountNotice, setCreatedAccountNotice] = useState<MailAccount | null>(null);
  const [copiedNoticeAction, setCopiedNoticeAction] = useState<string | null>(null);

  // Nouvelles fonctionnalités demandées
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopNotifEnabled, setDesktopNotifEnabled] = useState(false);
  const [autoCopyEnabled, setAutoCopyEnabled] = useState(true);
  const [autoCopiedNotice, setAutoCopiedNotice] = useState<string | null>(null);
  const [qrCodeEmail, setQrCodeEmail] = useState<Email | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [shortcutFeedback, setShortcutFeedback] = useState<string | null>(null);

  // Enregistrement du Service Worker PWA et écoute du prompt d'installation
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleTriggerNativeInstall = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      try {
        const choice = await deferredInstallPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setDeferredInstallPrompt(null);
          setIsInstallModalOpen(false);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const seenEmailIdsRef = useRef<Set<string>>(new Set());
  const isFirstFetchRef = useRef<boolean>(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("catchmail_user");
      if (saved) {
        const parsed: AuthenticatedUser = JSON.parse(saved);
        setCurrentUser(parsed);
        if (parsed.role === "user") {
          setCurrentAccountAddress(parsed.address);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLoginSuccess = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("catchmail_user", JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }

    if (user.role === "admin") {
      setCurrentAccountAddress("all");
      fetchEmails(false, "all");
    } else {
      setCurrentAccountAddress(user.address);
      fetchEmails(false, user.address);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("catchmail_user");
    } catch (e) {
      console.error(e);
    }
    setCurrentAccountAddress("all");
    setIsLoginModalOpen(true);
  };

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch("/api/accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch (err) {
      console.error("Erreur récupération comptes:", err);
    }
  }, []);

  const fetchEmails = useCallback(
    async (quiet = false, targetAccount = currentAccountAddress) => {
      if (!quiet) setIsLoading(true);
      try {
        // Sécurité côté client : si utilisateur normal, forcer son adresse
        const effectiveAccount =
          currentUser?.role === "user" ? currentUser.address : targetAccount;

        const url =
          effectiveAccount && effectiveAccount !== "all"
            ? `/api/emails?account=${encodeURIComponent(effectiveAccount)}`
            : "/api/emails";

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const incomingList: Email[] = data.emails || [];

          // Détection des nouveaux emails arrivés en direct
          if (!isFirstFetchRef.current && incomingList.length > 0) {
            const newlyArrived = incomingList.filter((e) => !seenEmailIdsRef.current.has(e.id));

            if (newlyArrived.length > 0) {
              const newest = newlyArrived[0];

              // 1. Bruitage sonore "Ding !"
              if (soundEnabled) {
                playNotificationSound();
              }

              // 2. Notification Bureau Windows/Navigateur
              if (desktopNotifEnabled) {
                if (newest.extractedCode) {
                  sendDesktopNotification(
                    `Code détecté : ${newest.extractedCode}`,
                    `${newest.subject} (${newest.from})`,
                    () => setSelectedEmailId(newest.id)
                  );
                } else {
                  sendDesktopNotification(
                    `Nouvel email : ${newest.subject}`,
                    newest.from,
                    () => setSelectedEmailId(newest.id)
                  );
                }
              }

              // 3. Auto-copie du code OTP dans le presse-papier
              if (autoCopyEnabled && newest.extractedCode) {
                navigator.clipboard.writeText(newest.extractedCode).catch(() => {});
                setAutoCopiedNotice(
                  `⚡ Code ${newest.extractedCode} copié automatiquement dans le presse-papier !`
                );
                setTimeout(() => setAutoCopiedNotice(null), 4000);
              }
            }
          }

          // Mettre à jour la liste des IDs vus
          const updatedSet = new Set<string>();
          for (const item of incomingList) {
            updatedSet.add(item.id);
          }
          seenEmailIdsRef.current = updatedSet;
          isFirstFetchRef.current = false;

          setEmails(incomingList);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des emails:", error);
      } finally {
        if (!quiet) setIsLoading(false);
      }
    },
    [currentAccountAddress, currentUser, soundEnabled, desktopNotifEnabled, autoCopyEnabled]
  );

  // Initial load
  useEffect(() => {
    fetchAccounts();
    fetchEmails(false, currentAccountAddress);
  }, [fetchAccounts, fetchEmails, currentAccountAddress]);

  // Set default selection when emails load or update
  useEffect(() => {
    if (emails.length > 0) {
      const exists = emails.some((e) => e.id === selectedEmailId);
      if (!exists) {
        setSelectedEmailId(emails[0].id);
      }
    } else {
      setSelectedEmailId(null);
    }
  }, [emails, selectedEmailId]);

  // Auto-refresh polling every 3.5 seconds
  useEffect(() => {
    if (autoRefresh) {
      autoRefreshTimerRef.current = setInterval(() => {
        fetchEmails(true, currentAccountAddress);
      }, 3500);
    } else {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
      }
    }

    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
      }
    };
  }, [autoRefresh, fetchEmails, currentAccountAddress]);

  // Power-User Keyboard Shortcuts Listener (Mode Gamer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si l'utilisateur est en train de taper dans un champ
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      const key = e.key.toLowerCase();

      // C : Copier le code OTP de l'email sélectionné
      if (key === "c") {
        const cur = emails.find((item) => item.id === selectedEmailId);
        if (cur?.extractedCode) {
          navigator.clipboard.writeText(cur.extractedCode);
          setShortcutFeedback(`Code ${cur.extractedCode} copié (Touche C)`);
          setTimeout(() => setShortcutFeedback(null), 2000);
        }
      }

      // E : Copier combo email:pass du compte sélectionné
      if (key === "e") {
        const targetAcc = accounts.find((a) => a.address === currentAccountAddress) || accounts[0];
        if (targetAcc) {
          navigator.clipboard.writeText(`${targetAcc.address}:${targetAcc.password}`);
          setShortcutFeedback(`Combo ${targetAcc.address} copié (Touche E)`);
          setTimeout(() => setShortcutFeedback(null), 2000);
        }
      }

      // R : Rafraîchir
      if (key === "r") {
        e.preventDefault();
        fetchEmails(false);
        setShortcutFeedback("Boîte rafraîchie (Touche R)");
        setTimeout(() => setShortcutFeedback(null), 1800);
      }

      // J ou Flèche Bas : Email suivant
      if (key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const idx = emails.findIndex((item) => item.id === selectedEmailId);
        if (idx >= 0 && idx < emails.length - 1) {
          setSelectedEmailId(emails[idx + 1].id);
        }
      }

      // K ou Flèche Haut : Email précédent
      if (key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx = emails.findIndex((item) => item.id === selectedEmailId);
        if (idx > 0) {
          setSelectedEmailId(emails[idx - 1].id);
        }
      }

      // Suppr : Supprimer l'email sélectionné
      if (e.key === "Delete") {
        if (selectedEmailId) {
          handleDeleteEmail(selectedEmailId);
          setShortcutFeedback("Email supprimé (Touche Suppr)");
          setTimeout(() => setShortcutFeedback(null), 1800);
        }
      }

      // ? : Afficher l'aide des raccourcis
      if (e.key === "?") {
        setIsShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emails, selectedEmailId, accounts, currentAccountAddress, fetchEmails]);

  const handleSelectEmail = async (email: Email) => {
    setSelectedEmailId(email.id);
    setIsMobileViewingEmail(true);

    if (!email.read) {
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, read: true } : e))
      );
      try {
        await fetch(`/api/emails?id=${email.id}`, { method: "PATCH" });
      } catch (err) {
        console.error("Erreur lors de la mise à jour de lecture:", err);
      }
    }
  };

  const handleDeleteEmail = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/emails?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEmails((prev) => prev.filter((item) => item.id !== id));
        if (selectedEmailId === id) {
          const remaining = emails.filter((item) => item.id !== id);
          setSelectedEmailId(remaining.length > 0 ? remaining[0].id : null);
          setIsMobileViewingEmail(false);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'email:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch("/api/emails?action=clear-all", { method: "DELETE" });
      if (res.ok) {
        setEmails([]);
        setSelectedEmailId(null);
        setIsMobileViewingEmail(false);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de tous les emails:", err);
    }
  };

  const handleSelectAccount = (address: string) => {
    setCurrentAccountAddress(address);
    fetchEmails(false, address);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      playNotificationSound();
    }
  };

  const handleToggleDesktopNotif = async () => {
    if (!desktopNotifEnabled) {
      const granted = await requestDesktopNotificationPermission();
      if (granted) {
        setDesktopNotifEnabled(true);
        sendDesktopNotification("CatchMail", "Les notifications bureau sont bien activées !");
      } else {
        alert("Veuillez autoriser les notifications dans les paramètres de votre navigateur.");
      }
    } else {
      setDesktopNotifEnabled(false);
    }
  };

  const handleToggleAutoCopy = () => {
    setAutoCopyEnabled((prev) => !prev);
  };

  const handleGenerateRandomAccount = async () => {
    setIsGeneratingRandom(true);
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ random: true }),
      });

      const data = await res.json();
      if (res.ok && data.account) {
        // Copie automatiquement le combo email:password
        const combo = `${data.account.address}:${data.account.password}`;
        await navigator.clipboard.writeText(combo);

        await fetchAccounts();
        handleSelectAccount(data.account.address);

        setCreatedAccountNotice(data.account);
        setCopiedNoticeAction("combo");
        setTimeout(() => setCopiedNoticeAction(null), 2500);
      }
    } catch (err) {
      console.error("Erreur génération boîte aléatoire:", err);
    } finally {
      setIsGeneratingRandom(false);
    }
  };

  const downloadNoticeCredentials = (acc: MailAccount) => {
    const content = `${acc.address}:${acc.password}
------------------------------------------
Email : ${acc.address}
Password : ${acc.password}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `identifiants-${acc.address.split("@")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || null;

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 antialiased overflow-hidden selection:bg-blue-600/30">
      {/* Top Bar with Account Switcher & Auth */}
      <Header
        emailCount={emails.length}
        isLoading={isLoading}
        autoRefresh={autoRefresh}
        currentAccountAddress={currentAccountAddress}
        accounts={accounts}
        currentUser={currentUser}
        isGeneratingRandom={isGeneratingRandom}
        soundEnabled={soundEnabled}
        desktopNotifEnabled={desktopNotifEnabled}
        autoCopyEnabled={autoCopyEnabled}
        onRefresh={() => fetchEmails(false, currentAccountAddress)}
        onToggleAutoRefresh={() => setAutoRefresh((prev) => !prev)}
        onToggleSound={handleToggleSound}
        onToggleDesktopNotif={handleToggleDesktopNotif}
        onToggleAutoCopy={handleToggleAutoCopy}
        onClearAll={handleClearAll}
        onOpenAccountManager={() => setIsAccountManagerOpen(true)}
        onOpenBatchModal={() => setIsBatchModalOpen(true)}
        onOpenStatsModal={() => setIsStatsModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        onOpenAutomationModal={() => setIsAutomationModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onSelectAccount={handleSelectAccount}
        onGenerateRandomAccount={handleGenerateRandomAccount}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Keyboard Shortcut Action Toast Notification */}
      {shortcutFeedback && (
        <div className="bg-zinc-900 border-b border-indigo-500/40 px-4 py-2 text-xs text-indigo-300 font-mono flex items-center justify-between shadow-md animate-in slide-in-from-top duration-150">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">⌨️ Raccourci :</span>
            <span>{shortcutFeedback}</span>
          </div>
          <button
            onClick={() => setShortcutFeedback(null)}
            className="text-zinc-500 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Auto-Copied OTP Toast Notification */}
      {autoCopiedNotice && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black px-4 py-2 text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 fill-black" />
            <span>{autoCopiedNotice}</span>
          </div>
          <button
            onClick={() => setAutoCopiedNotice(null)}
            className="text-black/80 hover:text-black font-semibold text-xs ml-4"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Random Creation Rich Toast Notification */}
      {createdAccountNotice && (
        <div className="bg-gradient-to-r from-amber-950/95 via-zinc-900 to-amber-950/90 border-b border-amber-600/40 px-4 py-2.5 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top duration-200 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <span>🎲</span> Boîte créée :
            </span>
            <span className="font-mono font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              {createdAccountNotice.address}
            </span>
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
              <Key className="h-3 w-3 text-amber-400" />
              <span>{createdAccountNotice.password}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Copy Combo */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${createdAccountNotice.address}:${createdAccountNotice.password}`);
                setCopiedNoticeAction("combo");
                setTimeout(() => setCopiedNoticeAction(null), 1800);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg transition-all"
              title="Copier au format email:password"
            >
              {copiedNoticeAction === "combo" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copiedNoticeAction === "combo" ? "Copié !" : "email:pass"}</span>
            </button>

            {/* Copy Template */}
            <button
              onClick={() => {
                const txt = `${createdAccountNotice.address}:${createdAccountNotice.password}
------------------------------------------
Email : ${createdAccountNotice.address}
Password : ${createdAccountNotice.password}`;
                navigator.clipboard.writeText(txt);
                setCopiedNoticeAction("template");
                setTimeout(() => setCopiedNoticeAction(null), 1800);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg transition-all"
              title="Copier la fiche complète"
            >
              {copiedNoticeAction === "template" ? <Check className="h-3 w-3 text-emerald-400" /> : <FileText className="h-3 w-3" />}
              <span>Fiche</span>
            </button>

            {/* Download .txt */}
            <button
              onClick={() => downloadNoticeCredentials(createdAccountNotice)}
              className="p-1 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 rounded-lg transition-colors"
              title="Télécharger (.txt)"
            >
              <Download className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => setCreatedAccountNotice(null)}
              className="text-zinc-500 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors ml-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Inbox View */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Back Button */}
        {isMobileViewingEmail && (
          <div className="md:hidden absolute top-3 left-3 z-20">
            <button
              onClick={() => setIsMobileViewingEmail(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-xs font-medium text-white rounded-lg shadow-md"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Retour à la boîte</span>
            </button>
          </div>
        )}

        {/* Left Column: Email List */}
        <div
          className={`w-full md:w-[380px] lg:w-[440px] shrink-0 h-full ${
            isMobileViewingEmail ? "hidden md:block" : "block"
          }`}
        >
          <EmailList
            emails={emails}
            selectedEmailId={selectedEmailId}
            onSelectEmail={handleSelectEmail}
            onDeleteEmail={handleDeleteEmail}
          />
        </div>

        {/* Right Column: Email Viewer */}
        <div
          className={`flex-1 h-full overflow-hidden ${
            !isMobileViewingEmail ? "hidden md:block" : "block"
          }`}
        >
          <EmailViewer
            email={selectedEmail}
            onDeleteEmail={handleDeleteEmail}
            onOpenQRCode={(e) => setQrCodeEmail(e)}
          />
        </div>
      </div>

      {/* Account Manager & Creator Modal (Admin Only) */}
      <AccountManagerModal
        isOpen={isAccountManagerOpen}
        onClose={() => setIsAccountManagerOpen(false)}
        accounts={accounts}
        currentAccountAddress={currentAccountAddress}
        onSelectAccount={handleSelectAccount}
        onRefreshAccounts={fetchAccounts}
        onGenerateRandom={handleGenerateRandomAccount}
      />

      {/* Login Modal for users / admins */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onSuccess={handleLoginSuccess}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* QR Code Modal for mobile scan */}
      <QRCodeModal
        isOpen={!!qrCodeEmail}
        email={qrCodeEmail}
        onClose={() => setQrCodeEmail(null)}
      />

      {/* Batch Mailbox Generator Modal (Admin Only) */}
      <BatchGeneratorModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onRefreshAccounts={fetchAccounts}
      />

      {/* Stats & Activity Modal */}
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        emails={emails}
        accounts={accounts}
      />

      {/* Keyboard Gamer Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Account Creation Automation Modal (Admin Only) */}
      <AutomationModal
        isOpen={isAutomationModalOpen}
        onClose={() => setIsAutomationModalOpen(false)}
        accounts={accounts}
        emails={emails}
        onRefreshAccounts={fetchAccounts}
      />

      {/* Install App & Extension Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        canInstallNative={!!deferredInstallPrompt}
        onTriggerInstall={handleTriggerNativeInstall}
      />
    </div>
  );
}
