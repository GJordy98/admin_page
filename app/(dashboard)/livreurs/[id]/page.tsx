"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Truck, Phone, Mail, User, CalendarDays,
  ShieldCheck, ShieldAlert, Clock, CheckCircle2, XCircle,
  Loader2, BadgeCheck, Activity, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { livreursApi } from "@/lib/api";
import { Livreur } from "@/types";

// ── helpers ───────────────────────────────────────────────────────────────────
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

const ONBOARDING_LABELS: Record<string, string> = {
  PENDING:     "En attente",
  IN_PROGRESS: "En cours",
  COMPLETED:   "Complété",
  REJECTED:    "Rejeté",
};

const DRIVER_STATUS_LABELS: Record<string, string> = {
  IS_FREE: "Disponible",
  IS_BUSY: "En mission",
  OFFLINE: "Hors ligne",
};

function onboardingColor(s?: string) {
  if (s === "COMPLETED")   return "text-green-600 bg-green-50 border-green-200";
  if (s === "REJECTED")    return "text-red-500 bg-red-50 border-red-200";
  if (s === "IN_PROGRESS") return "text-blue-600 bg-blue-50 border-blue-200";
  return "text-orange-500 bg-orange-50 border-orange-200";
}

function driverStatusColor(s?: string) {
  if (s === "IS_FREE") return "text-green-600 bg-green-50 border-green-200";
  if (s === "IS_BUSY") return "text-blue-600 bg-blue-50 border-blue-200";
  return "text-gray-500 bg-gray-50 border-gray-200";
}

// ── sub-components ────────────────────────────────────────────────────────────
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

// ── page ──────────────────────────────────────────────────────────────────────
export default function LivreurDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [livreur, setLivreur]               = useState<Livreur | null>(null);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [actionLoading, setActionLoading]   = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason]     = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await livreursApi.get(id) as Livreur;
      setLivreur(data);
    } catch (err: any) {
      setError(err.message || "Impossible de charger les données du livreur.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!livreur) return;
    try {
      setActionLoading(true);
      livreur.user.is_active
        ? await livreursApi.deactivate(id)
        : await livreursApi.activate(id);
      await fetchData();
    } catch (err: any) {
      alert("Échec de la mise à jour : " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await livreursApi.approve(id);
      await fetchData();
    } catch (err: any) {
      alert("Erreur lors de l'approbation : " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await livreursApi.reject(id, rejectReason.trim() || undefined);
      setShowRejectModal(false);
      setRejectReason("");
      await fetchData();
    } catch (err: any) {
      alert("Erreur lors du rejet : " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await livreursApi.delete(id);
      router.push('/livreurs');
    } catch (err: any) {
      alert("Erreur lors de la suppression : " + err.message);
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#8c57ff]" size={40} />
      </div>
    );
  }

  if (error || !livreur) {
    return (
      <div className="p-6 text-red-500 font-medium">
        Erreur : {error || "Livreur introuvable."}
      </div>
    );
  }

  const u = livreur.user;
  const isActive = u?.is_active ?? false;
  const isPending   = livreur.onboarding_status === "PENDING";
  const isRejected  = livreur.onboarding_status === "REJECTED";
  const isCompleted = livreur.onboarding_status === "COMPLETED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-gray-100 rounded-full text-gray-600"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#2f2b3d]">
            {u?.first_name} {u?.last_name}
          </h2>
          <p className="text-sm text-gray-500">Profil livreur · ID : {livreur.id}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold ${
          isActive
            ? "text-green-600 bg-green-50 border-green-200"
            : "text-red-500 bg-red-50 border-red-200"
        }`}>
          {isActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
          {isActive ? "Compte actif" : "Compte inactif"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ── Left column ───────────────────────────────────────── */}
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
                <InfoRow label="Nom complet"       icon={<User size={15} className="text-gray-400" />}        value={`${u?.first_name ?? ""} ${u?.last_name ?? ""}`.trim() || "N/A"} />
                <InfoRow label="Téléphone"          icon={<Phone size={15} className="text-gray-400" />}       value={u?.telephone || "N/A"} />
                <InfoRow label="Email"              icon={<Mail size={15} className="text-gray-400" />}        value={u?.email || "N/A"} />
                <InfoRow label="Date de naissance"  icon={<CalendarDays size={15} className="text-gray-400" />} value={fmt(livreur.birthdate)} />
                <InfoRow label="Rôle système"       icon={<BadgeCheck size={15} className="text-gray-400" />}  value={u?.role || "N/A"} />
                <InfoRow label="Membre depuis"      icon={<Clock size={15} className="text-gray-400" />}       value={fmtDateTime(u?.created_at || livreur.created_at)} />
              </div>
            </CardContent>
          </Card>

          {/* Statut & Validation */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#2f2b3d]">
                <ShieldCheck size={20} className="text-[#8c57ff]" />
                Statut & Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <div className="space-y-1">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Onboarding</p>
                  <span className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold ${onboardingColor(livreur.onboarding_status)}`}>
                    {ONBOARDING_LABELS[livreur.onboarding_status as string] ?? livreur.onboarding_status ?? "N/A"}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Disponibilité</p>
                  <span className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold ${driverStatusColor(livreur.status)}`}>
                    <Activity size={12} />
                    {DRIVER_STATUS_LABELS[livreur.status as string] ?? livreur.status ?? "N/A"}
                  </span>
                </div>

                <InfoRow label="Validé le"  icon={<CheckCircle2 size={15} className="text-gray-400" />} value={fmtDateTime(livreur.validated_at)} />
                <InfoRow label="Inscrit le" icon={<Clock size={15} className="text-gray-400" />}        value={fmtDateTime(livreur.created_at)} />

                {livreur.rejection_reason && (
                  <div className="sm:col-span-2 space-y-1">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Motif de rejet</p>
                    <div className="flex items-start gap-2 text-red-500">
                      <XCircle size={15} className="mt-0.5 shrink-0" />
                      <span className="text-sm font-medium">{livreur.rejection_reason}</span>
                    </div>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>

        </div>

        {/* ── Right column ──────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Accès & Permissions */}
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

            {/* Approuver — si PENDING ou REJECTED */}
            {(isPending || isRejected) && (
              <Button
                onClick={handleApprove}
                disabled={actionLoading}
                className="w-full h-11 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
              >
                {actionLoading
                  ? <Loader2 size={16} className="animate-spin mr-2" />
                  : <CheckCircle2 size={18} className="mr-2" />}
                Approuver le livreur
              </Button>
            )}

            {/* Rejeter — uniquement si pas déjà rejeté NI complété */}
            {!isRejected && !isCompleted && (
              <Button
                onClick={() => setShowRejectModal(true)}
                disabled={actionLoading}
                variant="outline"
                className="w-full h-11 rounded-xl font-semibold border-red-200 text-red-500 hover:bg-red-50"
              >
                <XCircle size={18} className="mr-2" />
                Rejeter le livreur
              </Button>
            )}

            {/* Suspendre / Activer le compte */}
            <Button
              onClick={handleToggleStatus}
              disabled={actionLoading}
              variant="outline"
              className={`w-full h-11 rounded-xl font-semibold ${
                isActive
                  ? "border-orange-200 text-orange-500 hover:bg-orange-50"
                  : "border-green-200 text-green-600 hover:bg-green-50"
              }`}
            >
              <ShieldAlert size={18} className="mr-2" />
              {isActive ? "Suspendre le compte" : "Activer le compte"}
            </Button>

            {/* Supprimer — toujours visible */}
            <Button
              onClick={() => setShowDeleteModal(true)}
              disabled={actionLoading}
              variant="outline"
              className="w-full h-11 rounded-xl font-semibold border-red-300 text-red-600 hover:bg-red-50 mt-2"
            >
              <Trash2 size={18} className="mr-2" />
              Supprimer ce livreur
            </Button>

          </div>
        </div>
      </div>

      {/* ── Modal de rejet ────────────────────────────────────────────────── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 space-y-4">
            <h3 className="text-lg font-bold text-[#2f2b3d]">Motif de rejet</h3>
            <p className="text-sm text-gray-500">Indiquez la raison du rejet (optionnel).</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ex : Documents incomplets, photo floue…"
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#8c57ff]/30"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => { setShowRejectModal(false); setRejectReason(""); }}
                className="flex-1 rounded-xl border-gray-200 text-gray-600"
              >
                Annuler
              </Button>
              <Button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white"
              >
                {actionLoading
                  ? <Loader2 size={16} className="animate-spin mr-2" />
                  : <XCircle size={16} className="mr-2" />}
                Confirmer le rejet
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal de suppression ───────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2f2b3d]">Supprimer ce livreur ?</h3>
                <p className="text-sm text-gray-500">Cette action est irréversible.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
              Le compte de <span className="font-semibold">{u?.first_name} {u?.last_name}</span> sera définitivement supprimé.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl border-gray-200 text-gray-600"
                disabled={actionLoading}
              >
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white"
              >
                {actionLoading
                  ? <Loader2 size={16} className="animate-spin mr-2" />
                  : <Trash2 size={16} className="mr-2" />}
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
