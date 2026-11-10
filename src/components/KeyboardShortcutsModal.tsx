"use client";

import React from "react";
import { X, Keyboard, Command } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: "C", desc: "Copier le code de vérification OTP de l'email actif" },
  { key: "E", desc: "Copier le combo email:motdepasse du compte" },
  { key: "R", desc: "Rafraîchir manuellement les emails reçus" },
  { key: "J / ↓", desc: "Passer à l'email suivant dans la liste" },
  { key: "K / ↑", desc: "Passer à l'email précédent dans la liste" },
  { key: "Suppr", desc: "Supprimer l'email actuellement ouvert" },
  { key: "?", desc: "Ouvrir ou fermer ce panneau des raccourcis" },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Keyboard className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Raccourcis Clavier Gamer</h3>
              <p className="text-[11px] text-zinc-400">Contrôlez CatchMail sans toucher la souris</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs"
            >
              <span className="text-zinc-300">{s.desc}</span>
              <kbd className="px-2 py-1 font-mono text-[11px] font-bold text-amber-300 bg-zinc-900 border border-zinc-700 rounded-md shadow-inner">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2 text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

