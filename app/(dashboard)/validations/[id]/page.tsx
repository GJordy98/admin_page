"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, CheckCircle, XCircle, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ValidationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // TODO: Replace with real API get
  const validation: any = null;

  if (!validation) {
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
          <h2 className="text-2xl font-bold text-[#2f2b3d]">Dossier de {validation.type}</h2>
          <p className="text-sm text-gray-500">{validation.nom} - Reçu le {validation.soumis_le}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl border border-gray-100 shadow-sm bg-white">
          <CardHeader className="border-b border-gray-50 bg-gray-50/20">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#2f2b3d]">
              <FileText size={20} className="text-[#8c57ff]" />
              Documents à vérifier
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-100 rounded-2xl bg-white hover:border-[#8c57ff]/30 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#8c57ff]">
                    <FileText size={20} />
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 group-hover:text-[#8c57ff]">
                    <Download size={18} />
                  </Button>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Pièce d'Identité</h4>
                <p className="text-xs text-gray-400">PDF - 2.4 MB</p>
              </div>

              <div className="p-4 border border-gray-100 rounded-2xl bg-white hover:border-[#8c57ff]/30 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <FileText size={20} />
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 group-hover:text-blue-500">
                    <Download size={18} />
                  </Button>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Licence d'exercice</h4>
                <p className="text-xs text-gray-400">PDF - 1.8 MB</p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="text-center py-10">
                <ExternalLink size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Prévisualisation non disponible pour ce format.<br/>Veuillez télécharger le fichier pour examen.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Décision administrative
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle size={18} /> Approuver le dossier
              </Button>
              <Button variant="outline" className="w-full border-red-100 text-red-500 hover:bg-red-50 h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                <XCircle size={18} /> Rejeter / Demander corrections
              </Button>
              <div className="pt-4 border-t border-gray-50">
                <p className="text-[11px] text-gray-400 leading-relaxed italic text-center">
                  L'approbation activera automatiquement le compte du partenaire et lui enverra un email de confirmation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
