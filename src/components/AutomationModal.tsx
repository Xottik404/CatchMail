"use client";

import React, { useState, useEffect } from "react";
import { MailAccount, AutomationService, AutomatedProfile } from "@/types/account";
import { Email } from "@/types/email";
import {
  X,
  Zap,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Dices,
  Key,
  User,
  Calendar,
  Sparkles,
  Shield,
  Download,
  Trash2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { ServiceIcon } from "./ServiceBadge";
import { generateRandomUsername, generateRandomDOB, generateStrongPassword } from "@/lib/utils";

interface AutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: MailAccount[];
  emails: Email[];
  onRefreshAccounts: () => void;
}

const SERVICES_CONFIG: Record<
  AutomationService,
  {
    id: AutomationService;
    name: string;
    color: string;
    badgeBg: string;
    badgeBorder: string;
    textColor: string;
    registerUrl: string;
    description: string;
  }
> = {
  discord: {
    id: "discord",
    name: "Discord Account",
    color: "#5865F2",
    badgeBg: "bg-[#5865F2]/20",
    badgeBorder: "border-[#5865F2]/50",
    textColor: "text-[#8891f2]",
    registerUrl: "https://discord.com/register",
    description: "Inscription Discord avec écoute automatique du mail de vérification ou du lien d'activation.",
  },
  epic: {
    id: "epic",
    name: "Epic Games Account",
    color: "#3b82f6",
    badgeBg: "bg-zinc-800",
    badgeBorder: "border-zinc-700",
    textColor: "text-zinc-200",
    registerUrl: "https://www.epicgames.com/id/register",
    description: "Inscription Epic Games (Fortnite, Unreal) avec détection instantanée du code 2FA à 6 chiffres.",
  },
  steam: {
    id: "steam",
    name: "Steam Account",
    color: "#1b2838",
    badgeBg: "bg-[#1b2838]",
    badgeBorder: "border-[#66c0f4]/40",
    textColor: "text-[#66c0f4]",
    registerUrl: "https://store.steampowered.com/join/",
    description: "Inscription Steam (Valve) avec lien de confirmation par email.",
  },
};

export function AutomationModal({
  isOpen,
  onClose,
  accounts,
  emails,
  onRefreshAccounts,
}: AutomationModalProps) {
  const [selectedService, setSelectedService] = useState<AutomationService>("discord");
  const [activeTab, setActiveTab] = useState<"create" | "history">("create");

  // Profile Form state
  const [mailSource, setMailSource] = useState<"new" | "existing">("new");
  const [selectedExistingAddress, setSelectedExistingAddress] = useState<string>("");
  const [username, setUsername] = useState(() => generateRandomUsername());
  const [password, setPassword] = useState(() => generateStrongPassword(16));
  const [dob, setDob] = useState(() => generateRandomDOB());
  const [isCreatingMail, setIsCreatingMail] = useState(false);

  // Active automation session
  const [activeEmail, setActiveEmail] = useState<string>("");
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [detectedLink, setDetectedLink] = useState<string | null>(null);

  // History state
  const [historyProfiles, setHistoryProfiles] = useState<AutomatedProfile[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load history
  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/automations");
      if (res.ok) {
        const data = await res.json();
        setHistoryProfiles(data.profiles || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    if (accounts.length > 0 && !selectedExistingAddress) {
      setSelectedExistingAddress(accounts[0].address);
    }
  }, [accounts, selectedExistingAddress]);

  // Listener en temps réel pour le mail de confirmation
  useEffect(() => {
    if (!isListening || !activeEmail) return;

    // Cherche si un email récent correspond à activeEmail
    const targetEmail = emails.find(
      (e) =>
        e.to.toLowerCase().includes(activeEmail.toLowerCase()) &&
        (selectedService === "discord"
          ? e.from.toLowerCase().includes("discord") || e.subject.toLowerCase().includes("discord")
          : e.from.toLowerCase().includes("epic") || e.subject.toLowerCase().includes("epic"))
    );

    if (targetEmail) {
      if (targetEmail.extractedCode) {
        setDetectedCode(targetEmail.extractedCode);
      }
      if (targetEmail.extractedLink) {
        setDetectedLink(targetEmail.extractedLink);
      }

      // Update profile status in database
      if (activeProfileId) {
        fetch("/api/automations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: activeProfileId,
            updates: {
              status: "completed",
              verificationCode: targetEmail.extractedCode || null,
              verificationLink: targetEmail.extractedLink || null,
            },
          }),
        }).then(() => fetchHistory());
      }
    }
  }, [isListening, activeEmail, emails, selectedService, activeProfileId]);

  if (!isOpen) return null;

  const currentServiceConfig = SERVICES_CONFIG[selectedService];

  const handleRegenerateProfile = () => {
    setUsername(generateRandomUsername());
    setPassword(generateStrongPassword(16));
    setDob(generateRandomDOB());
  };

  const handleStartAutomation = async () => {
    let emailToUse = "";
    let passToUse = password;

    if (mailSource === "new") {
      setIsCreatingMail(true);
      try {
        const res = await fetch("/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ random: true }),
        });
        const data = await res.json();
        if (res.ok && data.account) {
          emailToUse = data.account.address;
          passToUse = data.account.password;
          onRefreshAccounts();
        } else {
          throw new Error("Erreur création boîte");
        }
      } catch (err) {
        alert("Impossible de créer la boîte");
        setIsCreatingMail(false);
        return;
      } finally {
        setIsCreatingMail(false);
      }
    } else {
      emailToUse = selectedExistingAddress;
      const found = accounts.find((a) => a.address === selectedExistingAddress);
      if (found) passToUse = found.password;
    }

    setActiveEmail(emailToUse);
    setPassword(passToUse);
    setDetectedCode(null);
    setDetectedLink(null);
    setIsListening(true);

    // Save profile to database
    try {
      const res = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: selectedService,
          email: emailToUse,
          username,
          password: passToUse,
          dateOfBirth: dob,
          status: "pending",
        }),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        setActiveProfileId(data.profile.id);
        fetchHistory();
      }
    } catch (e) {
      console.error(e);
    }

    // Auto copy credentials combo to clipboard
    navigator.clipboard.writeText(`${emailToUse}:${passToUse}`);

    // Open register page in new tab
    window.open(currentServiceConfig.registerUrl, "_blank");
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      await fetch(`/api/automations?id=${id}`, { method: "DELETE" });
      fetchHistory();
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportHistory = () => {
    if (historyProfiles.length === 0) return;
    const lines = historyProfiles.map(
      (p) => `${p.service.toUpperCase()} | ${p.username} | ${p.email} | ${p.password} | DOB: ${p.dateOfBirth} | Code: ${p.verificationCode || "N/A"}`
    );
    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comptes-automatises-catchmail.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Zap className="h-5 w-5 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Centre d'Automatisation de Comptes</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Créez et vérifiez vos comptes en quelques clics avec interception en temps réel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher: Create vs History */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-4 pt-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all ${
              activeTab === "create"
                ? "border-blue-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            ⚡ Assistant de Création
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("history");
              fetchHistory();
            }}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "history"
                ? "border-blue-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>Historique des comptes créés</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-zinc-300">
              {historyProfiles.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Create Account */}
        {activeTab === "create" ? (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
            {/* 1. Service Selection */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-2">
                1. Choisissez le service à automatiser :
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Discord */}
                <button
                  type="button"
                  onClick={() => setSelectedService("discord")}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all text-left ${
                    selectedService === "discord"
                      ? "bg-[#5865F2]/20 border-[#5865F2] shadow-lg shadow-[#5865F2]/10"
                      : "bg-zinc-950 border-zinc-800 hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="h-10 w-10 rounded-lg bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center shrink-0">
                    <ServiceIcon id="discord" className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Discord</h4>
                    <p className="text-[11px] text-zinc-400">Compte avec lien d'activation</p>
                  </div>
                </button>

                {/* Epic Games */}
                <button
                  type="button"
                  onClick={() => setSelectedService("epic")}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all text-left ${
                    selectedService === "epic"
                      ? "bg-zinc-800 border-zinc-500 shadow-lg"
                      : "bg-zinc-950 border-zinc-800 hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="h-10 w-10 rounded-lg bg-zinc-800 text-white flex items-center justify-center shrink-0">
                    <ServiceIcon id="epic" className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Epic Games</h4>
                    <p className="text-[11px] text-zinc-400">Fortnite / Code OTP à 6 chiffres</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Mailbox Source */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-2">
                2. Adresse email pour le compte :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label
                  onClick={() => setMailSource("new")}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    mailSource === "new"
                      ? "bg-blue-950/40 border-blue-500 text-white"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="mailSource"
                    checked={mailSource === "new"}
                    onChange={() => setMailSource("new")}
                    className="accent-blue-500"
                  />
                  <div>
                    <p className="font-semibold text-zinc-200">Générer une nouvelle boîte</p>
                    <p className="text-[10px] text-zinc-400">Adresse aléatoire créée à la volée</p>
                  </div>
                </label>

                <label
                  onClick={() => setMailSource("existing")}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    mailSource === "existing"
                      ? "bg-blue-950/40 border-blue-500 text-white"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="mailSource"
                    checked={mailSource === "existing"}
                    onChange={() => setMailSource("existing")}
                    className="accent-blue-500"
                  />
                  <div>
                    <p className="font-semibold text-zinc-200">Utiliser une boîte existante</p>
                    <p className="text-[10px] text-zinc-400">Choisir dans votre liste</p>
                  </div>
                </label>
              </div>

              {mailSource === "existing" && (
                <div className="mt-2.5">
                  <select
                    value={selectedExistingAddress}
                    onChange={(e) => setSelectedExistingAddress(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.address}>
                        {acc.address} ({acc.name})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 3. Generated Gamer Profile Details */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  Identifiants générés pour le compte {currentServiceConfig.name}
                </span>
                <button
                  type="button"
                  onClick={handleRegenerateProfile}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Dices className="h-3 w-3" /> Régénérer
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                {/* Username */}
                <div className="p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block mb-0.5">PSEUDO</span>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold truncate">{username}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(username, "u")}
                      className="p-1 text-zinc-500 hover:text-white"
                      title="Copier"
                    >
                      {copiedKey === "u" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block mb-0.5">MOT DE PASSE</span>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 font-semibold truncate">{password}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(password, "p")}
                      className="p-1 text-zinc-500 hover:text-white"
                      title="Copier"
                    >
                      {copiedKey === "p" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block mb-0.5">DATE DE NAISSANCE</span>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">{dob}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(dob, "dob")}
                      className="p-1 text-zinc-500 hover:text-white"
                      title="Copier"
                    >
                      {copiedKey === "dob" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Action Button */}
            <button
              type="button"
              onClick={handleStartAutomation}
              disabled={isCreatingMail}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20"
            >
              <span>Lancer l'inscription {currentServiceConfig.name}</span>
              <ExternalLink className="h-4 w-4" />
            </button>

            {/* Active Session & Live Listener Box */}
            {isListening && (
              <div className="p-4 bg-zinc-950 border border-blue-500/40 rounded-xl space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <RefreshCw className="h-3.5 w-3.5 text-blue-400 animate-spin" />
                    <span className="font-semibold text-white">Écoute en direct activée</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 truncate max-w-xs">
                    {activeEmail}
                  </span>
                </div>

                {detectedCode || detectedLink ? (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl space-y-2 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Email de confirmation reçu !</span>
                    </div>

                    {detectedCode && (
                      <div className="flex items-center justify-between bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                        <div>
                          <span className="text-[10px] text-zinc-400 block">CODE REÇU</span>
                          <span className="font-mono text-xl font-extrabold text-amber-300 tracking-widest select-all">
                            {detectedCode}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(detectedCode, "detected-code")}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-all"
                        >
                          {copiedKey === "detected-code" ? "Copié !" : "Copier le code"}
                        </button>
                      </div>
                    )}

                    {detectedLink && (
                      <a
                        href={detectedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
                      >
                        <span>Ouvrir le lien d'activation Discord</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80">
                    Remplissez la page d'inscription ouverte. Dès que {currentServiceConfig.name} envoie le mail de validation, il s'affichera ici instantanément !
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: History of created profiles */
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                Comptes automatisés enregistrés ({historyProfiles.length})
              </span>
              {historyProfiles.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportHistory}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Exporter la liste (.txt)</span>
                </button>
              )}
            </div>

            {historyProfiles.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                Aucun compte créé via l'automatisation pour le moment.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {historyProfiles.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ServiceIcon id={p.service} className="h-4 w-4" />
                        <span className="text-xs font-bold text-white uppercase">{p.service}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                            p.status === "completed"
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                              : "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                          }`}
                        >
                          {p.status === "completed" ? "Vérifié" : "En attente"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyText(`${p.email}:${p.password}`, `combo-${p.id}`)}
                          className="px-2 py-0.5 text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded"
                          title="Copier combo email:pass"
                        >
                          {copiedKey === `combo-${p.id}` ? "Copié !" : "email:pass"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteHistoryItem(p.id)}
                          className="p-1 text-zinc-500 hover:text-rose-400 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-zinc-400 pt-1">
                      <div>
                        <span className="text-[9px] text-zinc-500 block">PSEUDO</span>
                        <span className="text-zinc-200">{p.username}</span>
                      </div>
                      <div className="sm:col-span-2 truncate">
                        <span className="text-[9px] text-zinc-500 block">EMAIL</span>
                        <span className="text-zinc-200 select-all truncate">{p.email}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 block">MDP</span>
                        <span className="text-amber-300 select-all">{p.password}</span>
                      </div>
                    </div>

                    {p.verificationCode && (
                      <div className="pt-1 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                        <span className="text-zinc-500">Code vérifié :</span>
                        <span className="font-bold select-all">{p.verificationCode}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
