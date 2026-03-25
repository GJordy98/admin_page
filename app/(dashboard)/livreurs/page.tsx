"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { livreursApi } from "@/lib/api";
import { Livreur, PaginatedResponse } from "@/types";
import { Loader2 } from "lucide-react";

const ONBOARDING_LABELS: Record<string, string> = {
  PENDING:     "En attente",
  IN_PROGRESS: "En cours",
  COMPLETED:   "Complété",
  REJECTED:    "Rejeté",
};

function onboardingBadge(s?: string) {
  if (s === "COMPLETED")   return "text-green-600 bg-green-50 border border-green-200";
  if (s === "REJECTED")    return "text-red-500 bg-red-50 border border-red-200";
  if (s === "IN_PROGRESS") return "text-blue-600 bg-blue-50 border border-blue-200";
  return "text-orange-500 bg-orange-50 border border-orange-200";
}

export default function LivreursPage() {
  const router = useRouter();
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLivreurs = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const res = await livreursApi.list(1) as PaginatedResponse<Livreur> | Livreur[];
      if (signal?.aborted) return;
      const data = Array.isArray(res)
        ? res
        : ('results' in res ? res.results : []);
      setLivreurs(data);
    } catch (err: any) {
      if (signal?.aborted) return;
      setError(err.message || "Failed to load livreurs.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchLivreurs(controller.signal);
    return () => controller.abort();
  }, []);

  const handleActivate = async (id: string) => {
    try {
      await livreursApi.activate(id);
      await fetchLivreurs();
    } catch (err: any) {
      alert("Failed to activate driver: " + err.message);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await livreursApi.deactivate(id);
      await fetchLivreurs();
    } catch (err: any) {
      alert("Failed to deactivate driver: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2f2b3d]">Livreurs</h2>
      </div>

      <Card className="rounded-2xl border border-gray-100 shadow-[0_4px_18px_0_rgba(47,43,61,0.05)] bg-white overflow-hidden">
        <CardContent className="p-0 pb-4 pt-2">
          {error && <div className="p-4 text-red-500 font-medium">Error: {error}</div>}

          <div className="overflow-x-auto mt-2 min-h-[300px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50 text-gray-500 text-[13px] font-semibold uppercase tracking-wider">
                  <th className="text-left px-6 py-4">Nom</th>
                  <th className="text-left px-6 py-4">Livraisons</th>
                  <th className="text-left px-6 py-4">Inscrit le</th>
                  <th className="text-left px-6 py-4">Statut Validation</th>
                  <th className="text-left px-6 py-4">Statut Compte</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      <Loader2 className="animate-spin mx-auto text-[#8c57ff]" size={32} />
                    </td>
                  </tr>
                ) : livreurs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      Aucun livreur trouvé.
                    </td>
                  </tr>
                ) : livreurs.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-gray-900 whitespace-pre-line">{l.user?.first_name} {l.user?.last_name}</td>
                    <td className="px-6 py-5 font-medium text-gray-600">{l.total_deliveries ?? l.deliveries_count ?? l.missions_count ?? l.livraisons_total ?? "—"}</td>
                    <td className="px-6 py-5 font-medium text-gray-600">
                      {(l.created_at || l.user?.created_at)
                        ? new Date(l.created_at ?? l.user?.created_at ?? "").toLocaleDateString("fr-FR")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${onboardingBadge(l.onboarding_status)}`}>
                        {ONBOARDING_LABELS[l.onboarding_status as string] ?? l.onboarding_status ?? "En attente"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[13px] font-semibold ${l.user?.is_active ? 'text-green-600' : 'text-red-500'}`}>
                        {l.user?.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => router.push(`/livreurs/${l.id}`)}
                          className="rounded-xl border-gray-200 text-[#2f2b3d] hover:bg-gray-50 h-10 px-5 text-[13px] font-medium"
                        >
                          Voir
                        </Button>
                        {!l.user?.is_active ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleActivate(l.id)}
                            className="rounded-xl border-green-200 text-green-600 hover:bg-green-50 h-10 px-5 text-[13px] font-medium"
                          >
                            Activer
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeactivate(l.id)}
                            className="rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50 h-10 px-5 text-[13px] font-medium"
                          >
                            Suspendre
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
