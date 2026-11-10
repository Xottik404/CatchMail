"use client";

import React from "react";
import { Email } from "@/types/email";
import { MailAccount } from "@/types/account";
import { X, BarChart3, Mail, KeyRound, Users, ShieldCheck, Zap } from "lucide-react";
import { detectService } from "@/lib/services";
import { ServiceIcon } from "./ServiceBadge";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: Email[];
  accounts: MailAccount[];
}

export function StatsModal({ isOpen, onClose, emails, accounts }: StatsModalProps) {
  if (!isOpen) return null;

  const totalEmails = emails.length;
  const emailsWithCodes = emails.filter((e) => e.extractedCode).length;
  const emailsWithLinks = emails.filter((e) => e.extractedLink).length;

  // Répartition par service
  const serviceCounts: Record<string, { count: number; name: string }> = {};

  for (const email of emails) {
    const s = detectService(email.from, email.subject, email.text);
    const key = s ? s.id : "autre";
    const name = s ? s.name : "Autres / Inconnu";
    if (!serviceCounts[key]) {
      serviceCounts[key] = { count: 0, name };
    }
    serviceCounts[key].count++;
  }

  const sortedServices = Object.entries(serviceCounts).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-6 relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Statistiques & Activité</h3>
              <p className="text-xs text-zinc-400">Vue d'ensemble des flux d'emails et codes reçus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
              <Mail className="h-4 w-4 text-blue-400" />
              <span>Emails Reçus</span>
            </div>
            <p className="text-2xl font-extrabold text-white">{totalEmails}</p>
          </div>

          <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
              <KeyRound className="h-4 w-4 text-amber-400" />
              <span>Codes OTP</span>
            </div>
            <p className="text-2xl font-extrabold text-amber-400">{emailsWithCodes}</p>
          </div>

          <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
              <Zap className="h-4 w-4 text-indigo-400" />
              <span>Liens Détectés</span>
            </div>
            <p className="text-2xl font-extrabold text-indigo-300">{emailsWithLinks}</p>
          </div>

          <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
              <Users className="h-4 w-4 text-emerald-400" />
              <span>Boîtes Actives</span>
            </div>
            <p className="text-2xl font-extrabold text-emerald-400">{accounts.length}</p>
          </div>
        </div>

        {/* Top Services Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Répartition par Service
          </h4>

          {sortedServices.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4 text-center">Aucune donnée pour le moment.</p>
          ) : (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {sortedServices.map(([key, item]) => {
                const percent = totalEmails > 0 ? Math.round((item.count / totalEmails) * 100) : 0;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <ServiceIcon id={key} className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="font-medium text-zinc-200">{item.name}</span>
                      </div>
                      <span className="text-zinc-400 font-mono text-[11px]">
                        {item.count} ({percent}%)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

