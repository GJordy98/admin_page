"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Mail, User, Phone, CalendarDays, Briefcase,
  MapPin, ShieldAlert, ShoppingBag, CreditCard, Loader2,
  CheckCircle2, XCircle, BadgeCheck, Home, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patientsApi, commandesApi } from "@/lib/api";
import { Patient, Commande, PaginatedResponse } from "@/types";

// ── helpers ────────────────────────────────────────────────────────────────
function fmt(dateStr?: string | null) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function fmtDateTime(dateStr?: string | null) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── page ────────────────────────────────────────────────────────────────────
export default function PatientDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params.id as string;

  const [patient,   setPatient]   = useState<Patient | null>(null);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const patData = await patientsApi.get(id) as Patient;
      setPatient(patData);

      try {
        const cmdRes = await commandesApi.byPatient(id) as PaginatedResponse<Commande> | Commande[];
        const cmdData = "results" in cmdRes ? cmdRes.results : cmdRes;
        setCommandes(cmdData);
      } catch {
        // orders are optional
      }
    } catch (err: any) {
      setError(err.message || "Impossible de charger les données du patient.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!patient) return;
    try {
      await patientsApi.update(id, { user: { is_active: !patient.user.is_active } });
      fetchData();
    } catch (err: any) {
      alert("Échec de la mise à jour : " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#8c57ff]" size={40} />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-6 text-red-500 font-medium">
        Erreur : {error || "Patient introuvable."}
      </div>
    );
  }

  const u          = patient.user;
  const isActive   = u?.is_active ?? false;
  const fullName   = `${patient.first_name ?? u?.first_name ?? ""} ${patient.last_name ?? u?.last_name ?? ""}`.trim();
  const totalSpent = commandes.reduce((acc, c) => acc + Number(c.montant_total || 0), 0);

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-gray-100 rounded-full text-gray-600"
        >
          <ArrowLeft size={20} />
        </Button>

        <div className="flex items-center gap-4 flex-1">
          {patient.profile_image ? (
            <img
              src={patient.profile_image}
              alt={fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#8c57ff]/20"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#8c57ff]/10 flex items-center justify-center">
              <User size={22} className="text-[#8c57ff]" />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-[#2f2b3d]">{fullName || "—"}</h2>
            <p className="text-sm text-gray-500">Profil patient · ID : {patient.id}</p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold ${
            isActive
              ? "text-green-600 bg-green-50 border-green-200"
              : "text-red-500 bg-red-50 border-red-200"
          }`}
        >
          {isActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
          {isActive ? "Compte actif" : "Compte bloqué"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ── Left column ───────────────────────────────────────────────── */}
        <div className="md:col-span-2 space-y-6">

          {/* Informations personnelles */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#2f2b3d]">
                <User size={20} className="text-[#8c57ff]" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoRow label="Nom complet"       icon={<User size={15} className="text-gray-400" />}        value={fullName || "N/A"} />
                <InfoRow label="Téléphone"          icon={<Phone size={15} className="text-gray-400" />}       value={u?.telephone || "N/A"} />
                <InfoRow label="Email"              icon={<Mail size={15} className="text-gray-400" />}        value={u?.email || "N/A"} />
                <InfoRow label="Date de naissance"  icon={<CalendarDays size={15} className="text-gray-400" />} value={fmt(patient.birthdate)} />
                <InfoRow label="Sexe"               icon={<User size={15} className="text-gray-400" />}        value={patient.sexe || "N/A"} />
                <InfoRow label="Profession"         icon={<Briefcase size={15} className="text-gray-400" />}   value={patient.profession || "N/A"} />
                <InfoRow label="Rôle système"       icon={<BadgeCheck size={15} className="text-gray-400" />}  value={u?.role || "N/A"} />
                <InfoRow label="Inscrit le"         icon={<CalendarDays size={15} className="text-gray-400" />} value={fmtDateTime(patient.created_at || u?.created_at)} />
              </div>
            </CardContent>
          </Card>

          {/* Adresse */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#2f2b3d]">
                <MapPin size={20} className="text-[#8c57ff]" />
                Adresse
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {patient.adresse ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoRow label="Ville"      icon={<Home size={15} className="text-gray-400" />}   value={patient.adresse.city    || "N/A"} />
                  <InfoRow label="Rue"        icon={<MapPin size={15} className="text-gray-400" />}  value={patient.adresse.rue     || "N/A"} />
                  <InfoRow label="Quartier"   icon={<MapPin size={15} className="text-gray-400" />}  value={patient.adresse.quater  || "N/A"} />
                  <InfoRow label="BP"         icon={<Home size={15} className="text-gray-400" />}    value={patient.adresse.bp      || "N/A"} />
                  <InfoRow label="Téléphone"  icon={<Phone size={15} className="text-gray-400" />}   value={patient.adresse.telephone || "N/A"} />
                  <InfoRow label="Pays (ID)"  icon={<Globe size={15} className="text-gray-400" />}   value={patient.adresse.country != null ? String(patient.adresse.country) : "N/A"} />
                  {(patient.adresse.latitude != null || patient.adresse.longitude != null) && (
                    <InfoRow
                      label="Coordonnées GPS"
                      icon={<Globe size={15} className="text-gray-400" />}
                      value={`${patient.adresse.latitude ?? "—"}, ${patient.adresse.longitude ?? "—"}`}
                    />
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Aucune adresse renseignée.</p>
              )}
            </CardContent>
          </Card>

        </div>

        {/* ── Right column ──────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Activité */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Aperçu Activité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ShoppingBag size={16} /> Total commandes
                </div>
                <span className="text-2xl font-bold text-gray-900">{commandes.length}</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CreditCard size={16} /> Dépenses totales
                </div>
                <span className="text-xl font-bold text-[#8c57ff]">
                  {totalSpent.toLocaleString("fr-FR")} XAF
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Accès & permissions */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Accès & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <FlagRow label="Compte actif"   value={u?.is_active} />
              <FlagRow label="Actif (legacy)" value={u?.active} />
              <FlagRow label="Staff"          value={u?.is_staff} />
              <FlagRow label="Admin"          value={u?.is_admin} />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push(`/commandes?patientId=${id}`)}
              className="w-full bg-[#8c57ff] hover:bg-[#7a49e6] text-white h-11 rounded-xl font-semibold shadow-lg shadow-[#8c57ff]/20"
            >
              Voir historique commandes
            </Button>
            <Button
              onClick={handleToggleStatus}
              variant="outline"
              className={`w-full h-11 rounded-xl font-semibold ${
                isActive
                  ? "border-red-200 text-red-500 hover:bg-red-50"
                  : "border-green-200 text-green-600 hover:bg-green-50"
              }`}
            >
              <ShieldAlert size={18} className="mr-2" />
              {isActive ? "Bloquer le patient" : "Débloquer le patient"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── sub-components ──────────────────────────────────────────────────────────
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
      <span
        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-semibold border ${
          isTrue
            ? "text-green-600 bg-green-50 border-green-200"
            : "text-gray-400 bg-gray-50 border-gray-200"
        }`}
      >
        {isTrue ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
        {value === undefined ? "N/A" : isTrue ? "Oui" : "Non"}
      </span>
    </div>
  );
}
