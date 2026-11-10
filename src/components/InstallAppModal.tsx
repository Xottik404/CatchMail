"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  Smartphone,
  Monitor,
  Chrome,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Laptop,
} from "lucide-react";

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  canInstallNative: boolean;
  onTriggerInstall: () => void;
}

export function InstallAppModal({
  isOpen,
  onClose,
  canInstallNative,
  onTriggerInstall,
}: InstallAppModalProps) {
  const [activeTab, setActiveTab] = useState<"pwa" | "extension">("pwa");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Installer CatchMail</h3>
              <p className="text-xs text-zinc-400">
                Application Bureau (Windows/Mac), Mobile & Extension
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

        {/* Tab switch */}
        <div className="flex border-b border-zinc-800 mb-5 gap-3 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("pwa")}
            className={`pb-2.5 px-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "pwa"
                ? "border-blue-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>Application PWA (Windows / Mobile)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("extension")}
            className={`pb-2.5 px-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "extension"
                ? "border-blue-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Chrome className="h-4 w-4" />
            <span>Extension Chrome / Edge</span>
          </button>
        </div>

        {activeTab === "pwa" ? (
          <div className="space-y-4">
            {/* 1-Click Install Button if supported */}
            {canInstallNative && (
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-blue-200">Installation Instantanée</h4>
                  <p className="text-xs text-zinc-400">Installez CatchMail comme une vraie application sur votre PC</p>
                </div>
                <button
                  onClick={onTriggerInstall}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Installer maintenant</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Windows / Mac */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Laptop className="h-4 w-4 text-blue-400" />
                  <span>Sur Windows / Mac</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Dans la barre d&apos;adresse de Chrome / Edge ou Brave, cliquez sur l&apos;icône <strong>⊕ « Installer CatchMail »</strong> située tout à droite, puis validez.
                </p>
              </div>

              {/* Android / iOS */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Smartphone className="h-4 w-4 text-emerald-400" />
                  <span>Sur Mobile (iOS & Android)</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Sur iPhone (Safari) : Bouton <strong>Partager</strong> → <strong>« Sur l&apos;écran d&apos;accueil »</strong>.<br />
                  Sur Android : Menu ⋮ → <strong>« Installer l&apos;application »</strong>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Chrome className="h-4 w-4 text-amber-400" />
                <span>CatchMail Companion</span>
              </h4>
              <p className="text-zinc-400 leading-relaxed">
                L&apos;extension de navigateur vous permet de consulter vos derniers codes OTP et de copier vos emails directement depuis n&apos;importe quel onglet sans devoir garder la page ouverte.
              </p>
              <div className="pt-2">
                <p className="font-semibold text-zinc-300 mb-1">Comment l&apos;installer :</p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-400 text-[11px]">
                  <li>Ouvrez <code>chrome://extensions</code> ou <code>edge://extensions</code></li>
                  <li>Activez le <strong>« Mode développeur »</strong> en haut à droite</li>
                  <li>Cliquez sur <strong>« Charger l&apos;extension non empaquetée »</strong></li>
                  <li>Sélectionnez le dossier <code>extension/</code> du projet</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

