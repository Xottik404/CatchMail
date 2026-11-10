"use client";

import React, { useState } from "react";
import { Mail, Key, Eye, EyeOff, LogIn, Sparkles, Shield, AlertCircle } from "lucide-react";
import { AuthenticatedUser } from "@/types/account";

interface LoginModalProps {
  isOpen: boolean;
  onSuccess: (user: AuthenticatedUser) => void;
  onClose?: () => void;
  isMandatory?: boolean; // Si true, l'utilisateur ne peut pas fermer sans se connecter
}

export function LoginModal({ isOpen, onSuccess, onClose, isMandatory = false }: LoginModalProps) {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Détection automatique si l'utilisateur colle un combo email:pass
  const handleEmailChange = (val: string) => {
    if (val.includes(":") && !passwordInput) {
      const parts = val.split(":");
      setEmailInput(parts[0].trim());
      setPasswordInput(parts.slice(1).join(":").trim());
      setError(null);
    } else {
      setEmailInput(val);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Identifiants invalides");
      }

      onSuccess(data.user);
      if (onClose) onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 sm:p-7 relative">
        {/* Glow decoration */}
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Connexion à votre Boîte</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">
            Connectez-vous avec l'adresse email et le mot de passe qui vous ont été transmis.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs text-rose-300 bg-rose-950/50 border border-rose-900/50 rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email input */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5 flex items-center justify-between">
              <span>Adresse Email</span>
              <span className="text-[10px] text-zinc-500">ou collez email:pass</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="ex: wild-otter-385@mail.hebertik.fr"
                value={emailInput}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5">
              Mot de passe
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-zinc-400 hover:text-zinc-200"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Helper tip */}
          <div className="p-2.5 bg-blue-950/30 border border-blue-900/30 rounded-xl flex items-start gap-2 text-[11px] text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Astuce :</strong> Vous pouvez coller directement votre format combo <code className="bg-blue-900/40 px-1 py-0.5 rounded text-blue-200">email:mdp</code> dans le champ email pour remplir les deux d'un coup !
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20"
          >
            <LogIn className="h-4 w-4" />
            <span>{isLoading ? "Vérification..." : "Accéder à ma boîte mail"}</span>
          </button>
        </form>

        {!isMandatory && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-xs text-zinc-500 hover:text-zinc-400 mt-4 transition-colors"
          >
            Fermer
          </button>
        )}
      </div>
    </div>
  );
}

