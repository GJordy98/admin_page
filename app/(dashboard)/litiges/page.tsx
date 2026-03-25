"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// TODO: Replace with real API data
const litiges: any[] = [];

export default function LitigesPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2f2b3d]">Gestion des Litiges</h2>
        <p className="text-sm text-gray-500 mt-1">Traitez les réclamations et problèmes de livraison.</p>
      </div>

      <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50 text-gray-500 text-[13px] font-semibold uppercase tracking-wider">
                  <th className="text-left px-6 py-4">Commande</th>
                  <th className="text-left px-6 py-4">Patient</th>
                  <th className="text-left px-6 py-4">Motif</th>
                  <th className="text-left px-6 py-4">Priorité</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {litiges.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Aucun litige en cours.
                    </td>
                  </tr>
                ) : litiges.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-mono font-bold text-[#8c57ff]">{l.commande_id}</td>
                    <td className="px-6 py-5 font-semibold text-gray-900">{l.patient}</td>
                    <td className="px-6 py-5 font-medium text-gray-600">{l.motif}</td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        l.priorite === "Haute" ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"
                      }`}>
                        {l.priorite}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => router.push(`/litiges/${l.id}`)}
                        className="rounded-xl border-gray-200 text-[#2f2b3d] hover:bg-gray-50 h-10 px-5 text-[13px] font-medium"
                      >
                        Traiter
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
