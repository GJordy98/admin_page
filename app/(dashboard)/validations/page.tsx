"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// TODO: Replace with real API data
const validations: any[] = [];

export default function ValidationsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2f2b3d]">Validations en Attente</h2>
        <p className="text-sm text-gray-500 mt-1">Vérifiez les documents des nouveaux partenaires.</p>
      </div>

      <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50 text-gray-500 text-[13px] font-semibold uppercase tracking-wider">
                  <th className="text-left px-6 py-4">Type</th>
                  <th className="text-left px-6 py-4">Nom / Entité</th>
                  <th className="text-left px-6 py-4">Date de soumission</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {validations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Aucune validation en attente.
                    </td>
                  </tr>
                ) : validations.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <span className={`px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        v.type === "Pharmacie" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                      }`}>
                        {v.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-semibold text-gray-900">{v.nom}</td>
                    <td className="px-6 py-5 text-gray-500">{v.soumis_le}</td>
                    <td className="px-6 py-5">
                      <span className="text-orange-500 font-bold text-[13px]">À vérifier</span>
                    </td>
                    <td className="px-6 py-5">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => router.push(`/validations/${v.id}`)}
                        className="rounded-xl border-gray-200 text-[#2f2b3d] hover:bg-gray-50 h-10 px-5 text-[13px] font-medium"
                      >
                        Voir pièces
                      </Button>
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
