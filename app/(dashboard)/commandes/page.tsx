"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OrderStatus, Commande, KPI, PaginatedResponse } from "@/types";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommandeBadge } from "@/components/ui/status-badge";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Filter, CheckCircle, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { commandesApi } from "@/lib/api";

const periodes = [
  { value: "tous",  label: "Toutes les dates" },
  { value: "hour",  label: "Dernière heure" },
  { value: "day",   label: "Aujourd'hui" },
  { value: "week",  label: "Cette semaine" },
  { value: "month", label: "Ce mois" },
  { value: "year",  label: "Cette année" },
];

import { Suspense } from "react";

function CommandesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPatientId = searchParams.get('patientId');
  const defaultOfficineId = searchParams.get('officineId');

  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch]   = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filtre, setFiltre]   = useState<OrderStatus | "tous">("tous");
  const [periode, setPeriode] = useState("tous");
  const [page, setPage]       = useState(1);

  useEffect(() => {
    fetchKpi();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchCommandes();
  }, [page, filtre, debouncedSearch, periode, defaultPatientId, defaultOfficineId]);

  const fetchKpi = async () => {
    try {
      const data = await commandesApi.kpi() as KPI;
      setKpi(data);
    } catch (e) {
      console.warn("Erreur chargement KPI", e);
    }
  };

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Commande[] = [];
      let count = 0;

      // Use specific endpoints if filtering by relation, otherwise use list/filter
      if (defaultPatientId) {
        const res = await commandesApi.byPatient(defaultPatientId) as PaginatedResponse<Commande> | Commande[];
        data = 'results' in res ? res.results : res;
        count = 'count' in res ? res.count : data.length;
      } else if (defaultOfficineId) {
        const res = await commandesApi.byOfficine(defaultOfficineId) as PaginatedResponse<Commande> | Commande[];
        data = 'results' in res ? res.results : res;
        count = 'count' in res ? res.count : data.length;
      } else {
        // Build filter params
        let params = `page=${page}`;
        if (filtre !== "tous") params += `&status=${filtre}`;
        if (periode !== "tous") params += `&period=${periode}`;
        if (debouncedSearch) params += `&search=${encodeURIComponent(debouncedSearch)}`; // Assumes backend supports "?search=" or similar

        const res = await commandesApi.filter(params) as PaginatedResponse<Commande> | Commande[];
        data = 'results' in res ? res.results : res;
        count = 'count' in res ? res.count : data.length;
      }

      // Fallback local filtering if backend search isn't fully implemented
      if (debouncedSearch && !defaultPatientId && !defaultOfficineId) {
        data = data.filter(c => 
          c.patient?.first_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
          c.patient?.last_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          c.id.toString().includes(debouncedSearch)
        );
      }

      setCommandes(data);
      setTotalCount(count);

    } catch (err: any) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2f2b3d]">Pôle Commandes</h2>
        <p className="text-sm text-gray-500 mt-1">
          {defaultPatientId ? `Commandes du patient #${defaultPatientId}` : 
           defaultOfficineId ? `Commandes de l'officine #${defaultOfficineId}` : 
           "Gérez, filtrez et suivez toutes les commandes de la plateforme."}
        </p>
      </div>

      {!defaultPatientId && !defaultOfficineId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total Commandes" value={kpi?.total_commandes || 0}
            icon={CheckCircle} color="green" />
          <StatsCard title="Gain Total (Hors Liv.)" value={`${(kpi?.gain_total || 0).toLocaleString()} F`}
            icon={TrendingUp} color="purple" />
          <StatsCard title="Pharmacies Actives" value={kpi?.par_officine?.length || 0}
            icon={AlertCircle} color="orange" />
        </div>
      )}

      <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-50 mb-4 bg-gray-50/20">
          <CardTitle className="text-[17px] font-semibold text-[#2f2b3d] flex items-center gap-2">
            <Filter size={18} /> Filtres Avancés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Rechercher patient ou N°..."
                     className="pl-9 h-11 rounded-lg border-gray-200 focus-visible:ring-[#8c57ff]" 
                     value={search}
                     onChange={(e) => {
                       setSearch(e.target.value);
                       setPage(1); // Reset page on search input change
                     }} />
            </div>
            
            {!defaultPatientId && !defaultOfficineId && (
              <>
                <Select value={filtre} onValueChange={(v) => { setFiltre(v as OrderStatus | "tous"); setPage(1); }}>
                  <SelectTrigger className="w-48 h-11 rounded-lg border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="PENDING">En attente (Créée)</SelectItem>
                    <SelectItem value="PARTIAL_VALIDATION">Validation partielle</SelectItem>
                    <SelectItem value="VALIDATED">Validée</SelectItem>
                    <SelectItem value="IN_PICKUP">En ramassage</SelectItem>
                    <SelectItem value="IN_TRANSIT">En transit</SelectItem>
                    <SelectItem value="PAYMENT_PENDING">En attente paiement</SelectItem>
                    <SelectItem value="COMPLETED">Terminée</SelectItem>
                    <SelectItem value="DELIVERED">Livrée</SelectItem>
                    <SelectItem value="CANCELLED">Annulée</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={periode} onValueChange={(v) => { setPeriode(v as string); setPage(1); }}>
                  <SelectTrigger className="w-44 h-11 rounded-lg border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {periodes.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </>
            )}
            
            {(filtre !== "tous" || periode !== "tous" || search !== "") && (
              <Button 
                variant="ghost" 
                onClick={() => { setFiltre("tous"); setPeriode("tous"); setSearch(""); setPage(1); }}
                className="text-gray-500 hover:text-red-500"
              >
                Effacer
              </Button>
            )}
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {error && <div className="p-4 mb-4 bg-red-50 text-red-500 rounded-lg font-medium text-sm">{error}</div>}
            
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50 text-gray-500 text-[13px] uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium rounded-tl-lg">N°</th>
                  <th className="text-left px-4 py-3 font-medium">Patient</th>
                  <th className="text-left px-4 py-3 font-medium">Montant Total</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Statut</th>
                  <th className="text-right px-4 py-3 font-medium rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      <Loader2 className="animate-spin mx-auto text-[#8c57ff]" size={32} />
                    </td>
                  </tr>
                ) : commandes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      Aucune commande trouvée.
                    </td>
                  </tr>
                ) : commandes.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-[#8c57ff]">#{c.id}</td>
                    <td className="px-4 py-4 font-medium text-[#2f2b3d]">
                      {c.patient?.first_name} {c.patient?.last_name}
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-900">
                      {(Number(c.total_amount ?? c.montant_total ?? c.cart?.total_amount ?? 0) + Number(c.delivery_fee ?? c.amount ?? 0)).toLocaleString()} FCFA
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {(c.created_at || c.date_creation) ? new Date(c.created_at || c.date_creation!).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "N/A"}
                    </td>
                    <td className="px-4 py-4"><CommandeBadge statut={c.status} /></td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/commandes/${c.id}`)} className="hover:bg-purple-50 hover:text-[#8c57ff] rounded-lg">
                        <Eye size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {!loading && commandes.length > 0 && totalCount > 10 && (
            <div className="mt-4">
               {/* Using the pagination controls implicitly handles counting. totalCount / 10 conceptually */}
              <PaginationControls page={page} count={totalCount} onPageChange={setPage} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CommandesPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#8c57ff]" size={40} /></div>}>
      <CommandesContent />
    </Suspense>
  );
}
