"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { pharmaciesApi } from "@/lib/api";
import { Pharmacie, PaginatedResponse } from "@/types";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function PharmaciesPage() {
  const router = useRouter();
  const [pharmacies, setPharmacies] = useState<Pharmacie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchPharmacies(); }, []);

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await pharmaciesApi.list(1) as PaginatedResponse<Pharmacie> | Pharmacie[];
      const data = "results" in res ? res.results : res;
      setPharmacies(data);
    } catch (err: any) {
      setError(err.message || "Impossible de charger les pharmacies.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await pharmaciesApi.toggleActivate(id);
      await fetchPharmacies();
    } catch (err: any) {
      alert("Échec : " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2f2b3d]">Pharmacies</h2>
      </div>

      <Card className="rounded-2xl border border-gray-100 shadow-[0_4px_18px_0_rgba(47,43,61,0.05)] bg-white overflow-hidden">
        <CardContent className="p-0">
          {error && <div className="p-4 text-red-500 font-medium">Erreur : {error}</div>}

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50 text-gray-500 text-[13px] font-semibold uppercase tracking-wider">
                  <th className="text-left px-6 py-4">Nom</th>
                  <th className="text-left px-6 py-4">Téléphone</th>
                  <th className="text-left px-6 py-4">Responsable</th>
                  <th className="text-left px-6 py-4">Inscrit le</th>
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
                ) : pharmacies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      Aucune pharmacie trouvée.
                    </td>
                  </tr>
                ) : pharmacies.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-gray-900">{p.name || "Sans nom"}</td>
                    <td className="px-6 py-5 font-medium text-gray-600">{p.telephone || "N/A"}</td>
                    <td className="px-6 py-5 font-medium text-gray-600">
                      {p.pharmacist_holder?.user
                        ? `${p.pharmacist_holder.user.first_name} ${p.pharmacist_holder.user.last_name}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-600">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleDateString("fr-FR")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${p.is_activate ? "text-green-600" : "text-red-500"}`}>
                        {p.is_activate ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {p.is_activate ? "Active" : "Suspendue"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/pharmacies/${p.id}`)}
                          className="rounded-xl border-gray-200 text-[#2f2b3d] hover:bg-gray-50 h-10 px-5 text-[13px] font-medium"
                        >
                          Voir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggle(p.id)}
                          className={`rounded-xl h-10 px-5 text-[13px] font-medium ${
                            p.is_activate
                              ? "border-orange-200 text-orange-600 hover:bg-orange-50"
                              : "border-green-200 text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {p.is_activate ? "Suspendre" : "Réactiver"}
                        </Button>
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
