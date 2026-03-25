"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, User, ShoppingBag, ShieldAlert, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LitigeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // TODO: Fetch from actual API
  const litige: any = null;

  if (!litige) {
    return (
      <div className="p-6 text-center text-gray-500">
        Chargement ou élément introuvable...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="hover:bg-gray-100 rounded-full text-gray-600"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-[#2f2b3d]">Litige #{litige.id}</h2>
          <p className="text-sm text-gray-500">Commande {litige.commande_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-2xl border border-gray-100 shadow-sm bg-white">
          <CardHeader className="border-b border-gray-50">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#2f2b3d]">
              <AlertCircle size={20} className="text-red-500" />
              Détails du Problème
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Patient</p>
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <User size={16} className="text-gray-300" />
                    {litige.patient}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Priorité</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                    litige.priorite === "Haute" ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"
                  }`}>
                    {litige.priorite}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Motif du litige</p>
                <div className="p-4 bg-gray-50 rounded-xl text-gray-700 font-medium">
                  {litige.motif}
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-50">
              <h3 className="text-sm font-bold text-[#2f2b3d] mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-[#8c57ff]" />
                Fil de discussion & Historique
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">P</div>
                  <div className="flex-1 bg-gray-50 p-3 rounded-2xl rounded-tl-none text-sm text-gray-600">
                    Bonjour, je n'ai toujours pas reçu ma commande alors qu'elle est marquée comme livrée.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Actions de Résolution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-[#8c57ff] hover:bg-[#7a49e6] text-white h-11 rounded-xl font-semibold">
                Contacter le livreur
              </Button>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white h-11 rounded-xl font-semibold">
                Rembourser le patient
              </Button>
              <Button variant="outline" className="w-full border-gray-200 text-[#2f2b3d] hover:bg-gray-50 h-11 rounded-xl font-semibold">
                Clôturer le litige
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
