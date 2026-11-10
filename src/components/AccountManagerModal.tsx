"use client";

import React, { useState } from "react";
import { MailAccount } from "@/types/account";
import {
  X,
  Plus,
  Shield,
  User,
  Trash2,
  Copy,
  Check,
  Dices,
  Key,
  Eye,
  EyeOff,
  Download,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { generateStrongPassword, formatCredentials } from "@/lib/utils";

interface AccountManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: MailAccount[];
  currentAccountAddress: string; // "all" or specific address
  onSelectAccount: (address: string) => void;
  onRefreshAccounts: () => void;
  onGenerateRandom?: () => void;
}

export function AccountManagerModal({
  isOpen,
  onClose,
  accounts,
  currentAccountAddress,
  onSelectAccount,
  onRefreshAccounts,
  onGenerateRandom,
}: AccountManagerModalProps) {
  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [password, setPassword] = useState(() => generateStrongPassword(16));
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Per-account UI state
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedActionId, setCopiedActionId] = useState<string | null>(null);

  if (!isOpen) return null;

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPrefix = prefix.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
    if (!cleanPrefix) {
      setError("Veuillez saisir un préfixe d'adresse valide (ex: discord, alex, etc.)");
      return;
    }

    const fullAddress = `${cleanPrefix}@mail.hebertik.fr`;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || cleanPrefix,
          address: fullAddress,
          password: password.trim() || generateStrongPassword(16),
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Impossible de créer le compte");
      }

      setName("");
      setPrefix("");
      setPassword(generateStrongPassword(16));
      onRefreshAccounts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async (id: string, address: string) => {
    if (!window.confirm(`Supprimer la boîte mail ${address} ?`)) return;

    try {
      const res = await fetch(`/api/accounts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        if (currentAccountAddress === address) {
          onSelectAccount("all");
        }
        onRefreshAccounts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyText = (text: string, actionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedActionId(actionKey);
    setTimeout(() => setCopiedActionId(null), 1800);
  };

  const handleDownloadSingle = (acc: MailAccount) => {
    const content = formatCredentials(acc.address, acc.password);
    const prefixName = acc.address.split("@")[0];
    downloadTextFile(`identifiants-${prefixName}.txt`, content);
  };

  const handleExportAll = () => {
    if (accounts.length === 0) return;

    const sections = accounts.map((acc) => {
      return formatCredentials(acc.address, acc.password);
    });

    const header = `══════════════════════════════════════════════════════════
CATCHMAIL — EXPORT DE TOUTES LES BOÎTES MAILS (${accounts.length})
Généré le : ${new Date().toLocaleString("fr-FR")}
══════════════════════════════════════════════════════════\n\n`;

    const fullContent = header + sections.join("\n\n==========================================\n\n");
    downloadTextFile(`comptes-catchmail-export.txt`, fullContent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Gestion des Boîtes & Mots de Passe</h2>
              <p className="text-xs text-zinc-400">
                Bloc-notes intégré avec mots de passe robustes et export 1-clic
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

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Form: Add Account */}
          <form onSubmit={handleCreateAccount} className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <Plus className="h-4 w-4 text-blue-400" />
                <span>Créer une nouvelle boîte mail</span>
              </div>

              {onGenerateRandom && (
                <button
                  type="button"
                  onClick={() => {
                    onGenerateRandom();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40 rounded-lg transition-colors"
                  title="Générer instantanément une adresse et un mot de passe aléatoire"
                >
                  <Dices className="h-3 w-3 text-amber-400" />
                  <span>Boîte Aléatoire (1-clic)</span>
                </button>
              )}
            </div>

            {error && (
              <div className="p-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/40 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Nom / Label</label>
                <input
                  type="text"
                  placeholder="Ex: Discord Bot, Alex..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Adresse email</label>
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden focus-within:border-blue-500">
                  <input
                    type="text"
                    placeholder="pseudo"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="w-full bg-transparent px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <span className="text-[11px] font-mono text-zinc-500 pr-2 select-none">
                    @mail.hebertik.fr
                  </span>
                </div>
              </div>

              {/* Password field with random generator */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Key className="h-3 w-3 text-amber-400" /> Mot de passe bloc-notes (robuste)
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassword(generateStrongPassword(16))}
                    className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Dices className="h-3 w-3" /> Régénérer
                  </button>
                </div>

                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden focus-within:border-blue-500">
                  <input
                    type={showPasswordInput ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent px-3 py-1.5 font-mono text-xs text-amber-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInput(!showPasswordInput)}
                    className="px-2.5 text-zinc-400 hover:text-zinc-200"
                    title={showPasswordInput ? "Masquer" : "Afficher"}
                  >
                    {showPasswordInput ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>Rôle :</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={() => setRole("user")}
                    className="accent-blue-500"
                  />
                  <span className={role === "user" ? "text-white" : ""}>Utilisateur</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={() => setRole("admin")}
                    className="accent-blue-500"
                  />
                  <span className={role === "admin" ? "text-white" : ""}>Admin</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg transition-all"
              >
                {isSubmitting ? "Création..." : "Ajouter la boîte"}
              </button>
            </div>
          </form>

          {/* List of Accounts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
              <span>Boîtes mails enregistrées ({accounts.length})</span>
              
              {accounts.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportAll}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 rounded-lg transition-all"
                  title="Télécharger tous les identifiants au format texte"
                >
                  <Download className="h-3 w-3 text-emerald-400" />
                  <span>Exporter tous les comptes (.txt)</span>
                </button>
              )}
            </div>

            {/* Special Entry: All inboxes (Super Admin Catch-All) */}
            <div
              onClick={() => {
                onSelectAccount("all");
                onClose();
              }}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                currentAccountAddress === "all"
                  ? "bg-blue-950/40 border-blue-500/50 shadow-md shadow-blue-500/5"
                  : "bg-zinc-950/40 border-zinc-800/80 hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Vue Globale Admin (Catch-All)</span>
                    <span className="text-[10px] font-medium text-amber-400 bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-800/30">
                      Tous les mails
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Affiche les emails reçus sur n'importe quelle adresse du domaine
                  </p>
                </div>
              </div>
              <span className="text-xs text-blue-400 font-medium">Activer</span>
            </div>

            {/* Individual Accounts with password & combo buttons */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {accounts.map((acc) => {
                const isSelected = currentAccountAddress === acc.address;
                const isPasswordVisible = !!visiblePasswords[acc.id];
                const comboString = `${acc.address}:${acc.password}`;
                const fullTemplate = formatCredentials(acc.address, acc.password);

                return (
                  <div
                    key={acc.id}
                    onClick={() => {
                      onSelectAccount(acc.address);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-950/30 border-blue-500/40"
                        : "bg-zinc-950/40 border-zinc-800/80 hover:bg-zinc-800/40"
                    }`}
                  >
                    {/* Left: Info & Password */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {acc.name}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-semibold ${
                            acc.role === "admin"
                              ? "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {acc.role}
                        </span>
                      </div>

                      {/* Email Address */}
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300">
                        <span className="truncate">{acc.address}</span>
                      </div>

                      {/* Password pill */}
                      <div
                        className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 bg-zinc-900/90 px-2.5 py-1 rounded-lg border border-zinc-800 w-fit"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Key className="h-3 w-3 text-amber-400 shrink-0" />
                        <span className="text-amber-200 font-semibold select-all">
                          {isPasswordVisible ? acc.password : "••••••••••••••••"}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(acc.id)}
                          className="text-zinc-500 hover:text-zinc-300 ml-1"
                          title={isPasswordVisible ? "Masquer" : "Afficher"}
                        >
                          {isPasswordVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>

                    {/* Right: Quick Copy / Download actions */}
                    <div
                      className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap pt-1 sm:pt-0 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Button: Copy Combo (email:password) */}
                      <button
                        type="button"
                        onClick={() => handleCopyText(comboString, `combo-${acc.id}`)}
                        className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                          copiedActionId === `combo-${acc.id}`
                            ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        }`}
                        title="Copier le combo email:password"
                      >
                        {copiedActionId === `combo-${acc.id}` ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-zinc-400" />
                        )}
                        <span>email:pass</span>
                      </button>

                      {/* Button: Copy Full Format */}
                      <button
                        type="button"
                        onClick={() => handleCopyText(fullTemplate, `full-${acc.id}`)}
                        className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg border transition-all ${
                          copiedActionId === `full-${acc.id}`
                            ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        }`}
                        title="Copier la fiche complète formatée"
                      >
                        {copiedActionId === `full-${acc.id}` ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <FileText className="h-3 w-3 text-zinc-400" />
                        )}
                        <span>Fiche</span>
                      </button>

                      {/* Button: Download Single .txt */}
                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(acc)}
                        className="p-1.5 text-zinc-400 hover:text-emerald-400 rounded-lg hover:bg-zinc-800 transition-colors"
                        title="Télécharger les identifiants (.txt)"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete button (except root admin) */}
                      {acc.id !== "admin-root" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAccount(acc.id, acc.address)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/20 transition-colors ml-1"
                          title="Supprimer cette boîte"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
