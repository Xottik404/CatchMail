"use client";

import React, { useState } from "react";
import { MailAccount } from "@/types/account";
import { X, Layers, Download, Copy, Check, Sparkles, FileText, FileSpreadsheet } from "lucide-react";

interface BatchGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshAccounts: () => void;
}

export function BatchGeneratorModal({
  isOpen,
  onClose,
  onRefreshAccounts,
}: BatchGeneratorModalProps) {
  const [count, setCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAccounts, setGeneratedAccounts] = useState<MailAccount[]>([]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch: count }),
      });
      const data = await res.json();
      if (res.ok && data.accounts) {
        setGeneratedAccounts(data.accounts);
        onRefreshAccounts();
      }
    } catch (err) {
      console.error("Erreur génération en masse:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCombos = () => {
    if (generatedAccounts.length === 0) return;
    const text = generatedAccounts.map((a) => `${a.address}:${a.password}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (generatedAccounts.length === 0) return;
    const text = generatedAccounts.map((a) => `${a.address}:${a.password}`).join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comptes-batch-${generatedAccounts.length}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    if (generatedAccounts.length === 0) return;
    const header = "Nom,Email,MotDePasse,Date\n";
    const rows = generatedAccounts
      .map((a) => `"${a.name}","${a.address}","${a.password}","${a.createdAt}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comptes-batch-${generatedAccounts.length}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-6 relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Générateur en Masse (Batch)</h3>
              <p className="text-xs text-zinc-400">Générez 5 à 100 comptes avec mots de passe en 1 clic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quantité selector */}
        <div className="space-y-3 mb-4">
          <label className="text-xs font-semibold text-zinc-300 block">
            Nombre de boîtes à générer :
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[5, 10, 25, 50, 100].map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => setCount(qty)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  count === qty
                    ? "bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/20"
                    : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {qty}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 active:scale-95 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-amber-400/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? "Génération des boîtes..." : `Générer ${count} boîtes mails`}</span>
          </button>
        </div>

        {/* Results Area */}
        {generatedAccounts.length > 0 && (
          <div className="flex-1 overflow-hidden flex flex-col space-y-2 border-t border-zinc-800 pt-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-white">
                {generatedAccounts.length} boîtes prêtes :
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyCombos}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
                  title="Copier au format email:pass"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? "Copié !" : "Copier"}</span>
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
                  title="Télécharger format texte"
                >
                  <FileText className="h-3 w-3" />
                  <span>.TXT</span>
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
                  title="Télécharger format CSV"
                >
                  <FileSpreadsheet className="h-3 w-3" />
                  <span>.CSV</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-zinc-950 p-3 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-1 divide-y divide-zinc-900 max-h-48">
              {generatedAccounts.map((acc, i) => (
                <div key={acc.id} className="pt-1 flex items-center justify-between">
                  <span className="text-zinc-200 select-all">{acc.address}</span>
                  <span className="text-amber-400 select-all">{acc.password}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

