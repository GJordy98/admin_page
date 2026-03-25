"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Clock, RefreshCw, Loader2, TrendingUp } from "lucide-react";
import { walletApi } from "@/lib/api";
import type { Wallet as WalletType } from "@/types";

function fmtDateTime(d?: string | null) {
  if (!d) return "N/A";
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatBalance(raw?: string | null) {
  if (!raw) return { integer: "—", decimal: "" };
  const num = parseFloat(raw);
  if (isNaN(num)) return { integer: raw, decimal: "" };
  const [int, dec] = num.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(",");
  return { integer: int, decimal: dec ? `,${dec}` : "" };
}

export default function WalletPage() {
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => { fetchWallets(); }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await walletApi.list() as WalletType[] | { results: WalletType[] };
      setWallets(Array.isArray(res) ? res : res.results ?? []);
    } catch (err: any) {
      setError(err.message || "Impossible de charger le wallet.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="animate-spin text-[#8c57ff]" size={40} />
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-50 text-red-500 rounded-xl font-medium text-sm">
      Erreur : {error}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2f2b3d]">eDoctor Wallet</h2>
          <p className="text-sm text-gray-500">Solde et informations du compte financier</p>
        </div>
        <button
          onClick={fetchWallets}
          className="flex items-center gap-2 text-sm text-[#8c57ff] font-semibold hover:underline"
        >
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {wallets.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Aucun wallet trouvé.</div>
      ) : wallets.map((w) => {
        const { integer, decimal } = formatBalance(w.balance);
        return (
          <div key={w.id} className="space-y-6">

            {/* ── Hero balance card ─────────────────────────────── */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#8c57ff] to-[#a379ff] p-8 shadow-xl shadow-[#8c57ff]/30">
              {/* decorative circles */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/10" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <Wallet size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-1">Solde actuel</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">{integer}</span>
                    <span className="text-2xl font-bold text-white/70">{decimal}</span>
                    <span className="ml-2 text-lg font-bold text-white/60">XAF</span>
                  </div>
                </div>
                <div className="md:ml-auto flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                  <TrendingUp size={16} className="text-white/80" />
                  <span className="text-sm font-semibold text-white">Actif</span>
                </div>
              </div>
            </div>

            {/* ── Detail cards ──────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* ID */}
              <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white col-span-1 md:col-span-3">
                <CardContent className="p-5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Identifiant</p>
                  <p className="font-mono text-sm text-gray-600 break-all">{w.id}</p>
                </CardContent>
              </Card>

              {/* Created at */}
              <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <Clock size={17} className="text-[#8c57ff]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Créé le</p>
                    <p className="text-sm font-semibold text-gray-800">{fmtDateTime(w.created_at)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Updated at */}
              <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <RefreshCw size={17} className="text-[#8c57ff]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Dernière mise à jour</p>
                    <p className="text-sm font-semibold text-gray-800">{fmtDateTime(w.updated_at)}</p>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        );
      })}
    </div>
  );
}
