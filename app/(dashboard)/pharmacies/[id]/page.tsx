"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Phone, Mail, User, Building2, CalendarDays,
  CheckCircle2, XCircle, BadgeCheck, Briefcase, Loader2, ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pharmaciesApi } from "@/lib/api";
import { Pharmacie } from "@/types";

function fmt(d?: string | null) {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}
function fmtDateTime(d?: string | null) {
  if (!d) return "N/A";
  return new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function InfoRow({ label, icon, value }: { label: string; icon: React.ReactNode; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-2 text-gray-900">
        {icon}
        <span className="text-sm font-medium break-all">{value}</span>
      </div>
    </div>
  );
}

function FlagRow({ label, value }: { label: string; value?: boolean }) {
  const isTrue = value === true;
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-semibold border ${
        isTrue ? "text-green-600 bg-green-50 border-green-200" : "text-gray-400 bg-gray-50 border-gray-200"
      }`}>
        {isTrue ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
        {value === undefined ? "N/A" : isTrue ? "Oui" : "Non"}
      </span>
    </div>
  );
}

export default function PharmacieDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params.id as string;

  const [pharmacie, setPharmacie] = useState<Pharmacie | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pharmaciesApi.get(id) as Pharmacie;
      setPharmacie(data);
    } catch (err: any) {
      setError(err.message || "Impossible de charger la pharmacie.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!pharmacie) return;
    try {
      await pharmaciesApi.toggleActivate(id);
      fetchData();
    } catch (err: any) {
      alert("Échec : " + err.message);
    }
  };

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="animate-spin text-[#8c57ff]" size={40} />
    </div>
  );

  if (error || !pharmacie) return (
    <div className="p-6 text-red-500 font-medium">Erreur : {error || "Pharmacie introuvable."}</div>
  );

  const holder  = pharmacie.pharmacist_holder;
  const hUser   = holder?.user;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}
          className="hover:bg-gray-100 rounded-full text-gray-600">
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#2f2b3d]">{pharmacie.name || "Sans nom"}</h2>
          <p className="text-sm text-gray-500">Pharmacie · ID : {pharmacie.id}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold ${
          pharmacie.is_activate
            ? "text-green-600 bg-green-50 border-green-200"
            : "text-red-500 bg-red-50 border-red-200"
        }`}>
          {pharmacie.is_activate ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
          {pharmacie.is_activate ? "Active" : "Suspendue"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="md:col-span-2 space-y-6">

          {/* Informations générales */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#2f2b3d]">
                <Building2 size={20} className="text-[#8c57ff]" /> Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoRow label="Nom"        icon={<Building2 size={15} className="text-gray-400" />} value={pharmacie.name || "N/A"} />
                <InfoRow label="Téléphone"  icon={<Phone size={15} className="text-gray-400" />}     value={pharmacie.telephone || "N/A"} />
                <InfoRow label="Inscrit le" icon={<CalendarDays size={15} className="text-gray-400" />} value={fmtDateTime(pharmacie.created_at)} />
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Description</p>
                  <p className="text-sm font-medium text-gray-900">{pharmacie.description || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pharmacien titulaire */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#2f2b3d]">
                <User size={20} className="text-[#8c57ff]" /> Pharmacien titulaire
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {holder ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoRow label="Nom complet" icon={<User size={15} className="text-gray-400" />}
                    value={`${hUser?.first_name ?? ""} ${hUser?.last_name ?? ""}`.trim() || "N/A"} />
                  <InfoRow label="Téléphone" icon={<Phone size={15} className="text-gray-400" />}
                    value={hUser?.telephone || "N/A"} />
                  <InfoRow label="Email" icon={<Mail size={15} className="text-gray-400" />}
                    value={hUser?.email || "N/A"} />
                  <InfoRow label="Rôle" icon={<BadgeCheck size={15} className="text-gray-400" />}
                    value={hUser?.role || "N/A"} />
                  <InfoRow label="Poste" icon={<Briefcase size={15} className="text-gray-400" />}
                    value={holder.poste || "N/A"} />
                  <InfoRow label="Sexe" icon={<User size={15} className="text-gray-400" />}
                    value={holder.sexe || "N/A"} />
                  <InfoRow label="Membre depuis" icon={<CalendarDays size={15} className="text-gray-400" />}
                    value={fmtDateTime(holder.created_at || hUser?.created_at)} />
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Aucun titulaire renseigné.</p>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right col */}
        <div className="space-y-6">

          {/* Statistiques */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                <span className="text-sm text-gray-500">Commandes totales</span>
                <span className="text-sm font-medium text-gray-400 italic">Indisponible</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Revenu généré</span>
                <span className="text-sm font-medium text-gray-400 italic">Indisponible</span>
              </div>
            </CardContent>
          </Card>

          {/* Accès titulaire */}
          {hUser && (
            <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                  Accès titulaire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <FlagRow label="Compte actif"   value={hUser?.is_active} />
                <FlagRow label="Actif (legacy)" value={hUser?.active} />
                <FlagRow label="Staff"          value={hUser?.is_staff} />
                <FlagRow label="Admin"          value={hUser?.is_admin} />
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push(`/commandes?officineId=${id}`)}
              className="w-full bg-[#8c57ff] hover:bg-[#7a49e6] text-white h-11 rounded-xl font-semibold shadow-lg shadow-[#8c57ff]/20"
            >
              Historique des commandes
            </Button>
            <Button
              onClick={handleToggle}
              variant="outline"
              className={`w-full h-11 rounded-xl font-semibold ${
                pharmacie.is_activate
                  ? "border-red-200 text-red-500 hover:bg-red-50"
                  : "border-green-200 text-green-600 hover:bg-green-50"
              }`}
            >
              <ShieldAlert size={18} className="mr-2" />
              {pharmacie.is_activate ? "Suspendre l'officine" : "Activer l'officine"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
