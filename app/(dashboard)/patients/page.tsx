"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { patientsApi } from "@/lib/api";
import { Patient, PaginatedResponse } from "@/types";
import { Loader2 } from "lucide-react";

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await patientsApi.list(1) as PaginatedResponse<Patient> | Patient[];
      // Handling both paginated and non-paginated responses based on the backend structure
      const data = 'results' in res ? res.results : res;
      setPatients(data);
    } catch (err: any) {
      setError(err.message || "Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, isActive: boolean) => {
    try {
      await patientsApi.update(id, { user: { is_active: isActive } });
      await fetchPatients();
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2f2b3d]">Patients</h2>
      </div>

      <Card className="rounded-2xl border border-gray-100 shadow-[0_4px_18px_0_rgba(47,43,61,0.05)] bg-white overflow-hidden">
        <CardContent className="p-0 pb-4 pt-2">
          {error && <div className="p-4 text-red-500 font-medium">Error: {error}</div>}
          
          <div className="overflow-x-auto mt-2 min-h-[300px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50 text-gray-500 text-[13px] font-semibold uppercase tracking-wider">
                  <th className="text-left px-6 py-4">Nom</th>
                  <th className="text-left px-6 py-4">Email</th>
                  <th className="text-left px-6 py-4">Inscrit le</th>
                  <th className="text-left px-6 py-4">Statut</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10">
                      <Loader2 className="animate-spin mx-auto text-[#8c57ff]" size={32} />
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      Aucun patient trouvé.
                    </td>
                  </tr>
                ) : patients.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-gray-900">{p.user?.first_name} {p.user?.last_name}</td>
                    <td className="px-6 py-5 font-medium text-gray-600">{p.user?.email}</td>
                    <td className="px-6 py-5 font-medium text-gray-600">
                      {(p.date_inscription || p.user?.date_joined || p.user?.created_at)
                        ? new Date(p.date_inscription ?? p.user?.date_joined ?? p.user?.created_at ?? "").toLocaleDateString("fr-FR")
                        : "N/A"}

                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[13px] font-semibold ${p.user?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                        {p.user?.is_active ? 'Actif' : 'Bloqué'}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-semibold">
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => router.push(`/patients/${p.id}`)}
                          className="rounded-xl border-gray-200 text-[#2f2b3d] hover:bg-gray-50 h-10 px-5 text-[13px] font-medium"
                        >
                          Voir
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUpdateStatus(p.id, !p.user?.is_active)}
                          className={`rounded-xl h-10 px-5 text-[13px] font-medium ${
                            p.user?.is_active 
                              ? "border-red-200 text-red-500 hover:bg-red-50" 
                              : "border-green-200 text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {p.user?.is_active ? "Bloquer" : "Débloquer"}
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
