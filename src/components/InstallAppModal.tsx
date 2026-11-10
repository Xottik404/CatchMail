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
  FolderArchive,
  ArrowRight,
  ShieldCheck,
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
  const [installClicked, setInstallClicked] = useState(false);

  if (!isOpen) return null;

  const handlePwaClick = () => {
    if (canInstallNative) {
      onTriggerInstall();
    } else {
      setInstallClicked(true);
    }
  };

  const handleDownloadWindowsShortcut = () => {
    const shortcutContent = `[InternetShortcut]\nURL=https://mail.hebertik.fr\nIconIndex=0\n`;
    const blob = new Blob([shortcutContent], { type: "application/internet-shortcut" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CatchMail.url";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Télécharger & Installer CatchMail</h3>
              <p className="text-xs text-zinc-400">
                Application Bureau (Windows/Mac), Mobile (PWA) & Extension Navigateur
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
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "pwa"
                ? "border-emerald-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>Mode Application (Windows & Mobile)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("extension")}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "extension"
                ? "border-amber-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Chrome className="h-4 w-4 text-amber-400" />
            <span>Extension Chrome / Edge (.zip)</span>
          </button>
        </div>

        {activeTab === "pwa" ? (
          <div className="space-y-4">
            {/* Primary Action Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-zinc-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Installer l&apos;App CatchMail</h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    PWA Officielle
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Fonctionne comme un logiciel Windows autonome avec notifications intégrées
                </p>
              </div>

              <button
                onClick={handlePwaClick}
                type="button"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2 shrink-0 active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span>Installer l&apos;Application</span>
              </button>
            </div>

            {/* If user clicked or fallback indicator */}
            {installClicked && (
              <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-200 animate-in fade-in duration-200">
                <p className="font-semibold mb-1">💡 Comment valider l&apos;installation dans votre navigateur :</p>
                <p className="text-[11px] text-zinc-300">
                  Dans la barre d&apos;adresse de Chrome / Edge (tout à droite près de l&apos;étoile des favoris), cliquez sur l&apos;icône <strong>⊕</strong> ou <strong>Écran avec flèche (« Installer CatchMail »)</strong> puis validez.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Windows / Mac */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Laptop className="h-4 w-4 text-blue-400" />
                    <span>Raccourci Bureau Windows</span>
                  </div>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Vous pouvez également télécharger un raccourci direct pour votre bureau Windows (.url) :
                </p>
                <button
                  type="button"
                  onClick={handleDownloadWindowsShortcut}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-blue-300 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/40 rounded-lg transition-colors font-medium"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Télécharger le raccourci (.url)</span>
                </button>
              </div>

              {/* Android / iOS */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Smartphone className="h-4 w-4 text-emerald-400" />
                  <span>Sur Mobile (iOS & Android)</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  <strong>iPhone (Safari) :</strong> Cliquez sur le bouton <strong>Partager</strong> en bas → <strong>« Sur l&apos;écran d&apos;accueil »</strong>.<br />
                  <strong>Android (Chrome) :</strong> Menu ⋮ → <strong>« Installer l&apos;application »</strong>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Extension Tab */
          <div className="space-y-4 text-xs">
            {/* Download Extension Zip Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/50 via-zinc-900 to-zinc-950 border border-amber-500/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <FolderArchive className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Extension CatchMail Companion</h4>
                    <p className="text-[11px] text-zinc-400">Pour Google Chrome, Microsoft Edge & Brave</p>
                  </div>
                </div>
              </div>

              <p className="text-zinc-300 text-xs leading-relaxed">
                Consultez vos derniers codes OTP et copiez vos emails directement depuis n&apos;importe quel onglet sans devoir garder la page ouverte.
              </p>

              <div className="pt-1">
                <a
                  href="/catchmail-extension.zip"
                  download="catchmail-extension.zip"
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <Download className="h-4 w-4" />
                  <span>📥 Télécharger l&apos;Extension (.zip)</span>
                </a>
              </div>
            </div>

            {/* 3 Step Install Guide */}
            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
              <p className="font-semibold text-zinc-200">Comment l&apos;installer en 15 secondes :</p>
              <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 text-[11px]">
                <li>Décompressez le fichier <code>catchmail-extension.zip</code> téléchargé.</li>
                <li>Ouvrez <code>chrome://extensions</code> ou <code>edge://extensions</code> dans votre navigateur.</li>
                <li>Activez le curseur <strong>« Mode développeur »</strong> (en haut à droite).</li>
                <li>Cliquez sur <strong>« Charger l&apos;extension non empaquetée »</strong> et sélectionnez le dossier décompressé.</li>
              </ol>
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
