"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Mission, PaginatedResponse, PickupStatus } from "@/types";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Loader2 } from "lucide-react";
import { missionsApi } from "@/lib/api";

const periodes = [
  { value: "tous",  label: "Toutes les dates" },
  { value: "hour",  label: "Dernière heure" },
  { value: "day",   label: "Aujourd'hui" },
  { value: "week",  label: "Cette semaine" },
  { value: "month", label: "Ce mois" },
  { value: "year",  label: "Cette année" },
  { value: "custom",label: "Personnalisé" }
];

const statuses = [
  { value: "tous", label: "Tous les statuts" },
  { value: "PENDING", label: "En attente" },
  { value: "ASSIGNED", label: "Assigné" },
  { value: "ACCEPTED", label: "Accepté" },
  { value: "EN_ROUTE", label: "En route" },
  { value: "ARRIVED", label: "Arrivé" },
  { value: "CONFIRMED", label: "Confirmé" },
  { value: "PICKED_UP", label: "Ramassé" },
  { value: "DELIVERED", label: "Livré" },
  { value: "CANCELLED", label: "Annulé" },
  { value: "TIMEOUT", label: "Expiré" },
];

function statusColor(status: string) {
  switch (status) {
    case "PENDING": return "bg-gray-100 text-gray-700";
    case "ASSIGNED": return "bg-blue-100 text-blue-700";
    case "ACCEPTED": return "bg-indigo-100 text-indigo-700";
    case "EN_ROUTE": return "bg-yellow-100 text-yellow-700";
    case "ARRIVED": return "bg-orange-100 text-orange-700";
    case "CONFIRMED":
    case "PICKED_UP": return "bg-purple-100 text-purple-700";
    case "DELIVERED": return "bg-green-100 text-green-700";
    case "CANCELLED":
    case "TIMEOUT": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

function MissionsContent() {
  const router = useRouter();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch]   = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filtre, setFiltre]   = useState<string>("tous");
  const [periode, setPeriode] = useState("tous");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage]       = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchMissions();
  }, [page, filtre, debouncedSearch, periode, startDate, endDate]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);

      let params = `page=${page}`;
      if (filtre !== "tous") params += `&status=${filtre}`;
      
      if (periode === "custom" && startDate && endDate) {
         params += `&start=${startDate}&end=${endDate}`;
      } else if (periode !== "tous" && periode !== "custom") {
         params += `&period=${periode}`;
      }
      
      if (debouncedSearch) params += `&search=${encodeURIComponent(debouncedSearch)}`;

      const res = await missionsApi.filter(params) as PaginatedResponse<Mission> | Mission[];
      let data = 'results' in res ? res.results : res;
      const count = 'count' in res ? res.count : data.length;

      if (debouncedSearch) {
        data = data.filter(m => 
          m.id.toString().includes(debouncedSearch) ||
          m.driver?.user?.first_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          m.driver?.user?.last_name?.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }

      setMissions(data);
      setTotalCount(count);

    } catch (err: any) {
      setError(err.message || "Failed to load missions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2f2b3d]">Pôle Missions</h2>
        <p className="text-sm text-gray-500 mt-1">
          Suivez et gérez l'ensemble des missions assignées aux livreurs.
        </p>
      </div>

      <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-50 mb-4 bg-gray-50/20">
          <CardTitle className="text-[17px] font-semibold text-[#2f2b3d] flex items-center gap-2">
            <Filter size={18} /> Filtres Avancés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6 items-end">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Rechercher livreur ou N°..."
                     className="pl-9 h-11 rounded-lg border-gray-200 focus-visible:ring-[#8c57ff]" 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)} />
            </div>
            
            <Select value={filtre} onValueChange={(v) => { setFiltre(v ?? filtre); setPage(1); }}>
              <SelectTrigger className="w-44 h-11 rounded-lg border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                {statuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={periode} onValueChange={(v) => { setPeriode(v ?? periode); setPage(1); }}>
              <SelectTrigger className="w-44 h-11 rounded-lg border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                {periodes.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
              </SelectContent>
            </Select>

            {periode === "custom" && (
              <div className="flex items-center gap-2">
                <Input type="date" value={startDate} onChange={e => {setStartDate(e.target.value); setPage(1);}} className="h-11 rounded-lg border-gray-200" />
                <span className="text-gray-400">à</span>
                <Input type="date" value={endDate} onChange={e => {setEndDate(e.target.value); setPage(1);}} className="h-11 rounded-lg border-gray-200" />
              </div>
            )}
            
            {(filtre !== "tous" || periode !== "tous" || search !== "") && (
              <Button 
                variant="ghost" 
                onClick={() => { setFiltre("tous"); setPeriode("tous"); setSearch(""); setStartDate(""); setEndDate(""); setPage(1); }}
                className="text-gray-500 hover:text-red-500 h-11 shrink-0"
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
                  <th className="text-left px-4 py-3 font-medium rounded-tl-lg">N° Mission</th>
                  <th className="text-left px-4 py-3 font-medium">Livreur</th>
                  <th className="text-left px-4 py-3 font-medium">Date (Création)</th>
                  <th className="text-left px-4 py-3 font-medium rounded-tr-lg">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10">
                      <Loader2 className="animate-spin mx-auto text-[#8c57ff]" size={32} />
                    </td>
                  </tr>
                ) : missions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                      Aucune mission trouvée.
                    </td>
                  </tr>
                ) : missions.map((m: any) => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-[#8c57ff]">#{m.id}</td>
                    <td className="px-4 py-4 font-medium text-[#2f2b3d]">
                      {m.driver?.user?.first_name ? `${m.driver.user.first_name} ${m.driver.user.last_name || ''}` : "Non assigné"}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {(m.created_at || m.date_creation) ? new Date(m.created_at || m.date_creation).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "N/A"}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${statusColor(m.status)}`}>
                        {statuses.find(s => s.value === m.status)?.label || m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {!loading && missions.length > 0 && totalCount > 10 && (
            <div className="mt-4">
              <PaginationControls page={page} count={totalCount} onPageChange={setPage} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function MissionsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#8c57ff]" size={40} /></div>}>
      <MissionsContent />
    </Suspense>
  );
}
