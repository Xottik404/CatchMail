"use client";

import React, { useState } from "react";
import { Email } from "@/types/email";
import { Search, Inbox, KeyRound, Trash2, Check, Copy, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { detectService } from "@/lib/services";
import { ServiceBadge, ServiceIcon } from "./ServiceBadge";

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (email: Email) => void;
  onDeleteEmail: (id: string, e: React.MouseEvent) => void;
}

export function EmailList({
  emails,
  selectedEmailId,
  onSelectEmail,
  onDeleteEmail,
}: EmailListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const filteredEmails = emails.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.subject.toLowerCase().includes(term) ||
      item.from.toLowerCase().includes(term) ||
      item.to.toLowerCase().includes(term) ||
      (item.extractedCode && item.extractedCode.toLowerCase().includes(term))
    );
  });

  const handleQuickCopyCode = (code: string, emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(emailId);
    setTimeout(() => setCopiedCodeId(null), 1800);
  };

  const formatEmailDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return formatDistanceToNow(d, { addSuffix: true, locale: fr });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-zinc-800 bg-zinc-950/50">
      {/* Search Bar */}
      <div className="p-3 border-b border-zinc-800">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher (sujet, expéditeur, code...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* List Header */}
      <div className="px-4 py-2 border-b border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
        <span>Boîte de réception ({filteredEmails.length})</span>
        <span className="text-[11px]">Du plus récent au plus ancien</span>
      </div>

      {/* Email List Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
        {filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 mb-3">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-zinc-300">Aucun email reçu</p>
            <p className="text-xs text-zinc-500 max-w-xs mt-1">
              Les emails envoyés sur votre webhook apparaîtront ici instantanément.
            </p>
          </div>
        ) : (
          filteredEmails.map((email) => {
            const isSelected = email.id === selectedEmailId;
            const service = detectService(email.from, email.subject, email.text);

            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className={`group relative p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-zinc-900/90 border-l-2 border-blue-500"
                    : "hover:bg-zinc-900/40 border-l-2 border-transparent"
                }`}
              >
                {/* Header row: From + Service Badge + Date */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {!email.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                    {service && <ServiceBadge service={service} />}
                    <span
                      className={`text-xs font-semibold truncate ${
                        !email.read ? "text-white" : "text-zinc-300"
                      }`}
                    >
                      {email.from.replace(/<.*?>/, "").trim() || email.from}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatEmailDate(email.date)}
                  </span>
                </div>

                {/* Subject */}
                <h3
                  className={`text-sm truncate mb-1.5 ${
                    !email.read ? "font-semibold text-zinc-100" : "font-medium text-zinc-300"
                  }`}
                >
                  {email.subject}
                </h3>

                {/* Snippet */}
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-2.5">
                  {email.text}
                </p>

                {/* Footer row: Recipient tag & Verification Code Quick Copy */}
                <div className="flex items-center justify-between gap-2 mt-auto">
                  <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800/80 truncate max-w-[150px]">
                    À: {email.to}
                  </span>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {/* Quick Code Badge */}
                    {email.extractedCode && (
                      <button
                        onClick={(e) => handleQuickCopyCode(email.extractedCode!, email.id, e)}
                        className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded border transition-all ${
                          copiedCodeId === email.id
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                            : "bg-blue-950/50 text-blue-400 border-blue-600/30 hover:bg-blue-900/60 hover:text-blue-300"
                        }`}
                        title="Cliquer pour copier le code rapidement"
                      >
                        <KeyRound className="h-3 w-3" />
                        <span>{email.extractedCode}</span>
                        {copiedCodeId === email.id ? (
                          <Check className="h-3 w-3 ml-0.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3 ml-0.5 opacity-60 group-hover:opacity-100" />
                        )}
                      </button>
                    )}

                    {/* Quick Link Badge (Discord confirmation, etc.) */}
                    {!email.extractedCode && email.extractedLink && (
                      <a
                        href={email.extractedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border bg-indigo-950/60 text-indigo-300 border-indigo-500/40 hover:bg-indigo-900/80 hover:text-white transition-all shadow-sm"
                        title="Ouvrir le lien de confirmation directement"
                      >
                        <span>Vérifier</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={(e) => onDeleteEmail(email.id, e)}
                      title="Supprimer cet email"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

