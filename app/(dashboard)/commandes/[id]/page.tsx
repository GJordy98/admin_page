"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingBag, User, Building2, Calendar, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { commandesApi } from "@/lib/api";
import { Commande } from "@/types";
import { CommandeBadge } from "@/components/ui/status-badge";

export default function CommandeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCommande();
  }, [id]);

  const fetchCommande = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await commandesApi.get(id) as any;
      const data = resp?.data || resp; // Unwrap object if needed
      console.log("Détail Commande API Response:", data);
      setCommande(data as Commande);
    } catch (err: any) {
      setError(err.message || "Failed to load order data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#8c57ff]" size={40} />
      </div>
    );
  }

  if (error || !commande) {
    return <div className="p-6 text-red-500 font-medium">Error: {error || "Commande not found."}</div>;
  }

  const itemsList: any[] = commande.items || commande.cart?.items || [];

  const deliveryFee = Number(commande.delivery_fee ?? 0);
  // Calculer uniquement le total des articles avec le statut "RESERVED"
  const reservedItemsSum = itemsList
    .filter(item => item.status === "RESERVED")
    .reduce((acc, item) => acc + Number(item.line_total || (item.unit_price * item.quantity) || 0), 0);

  const baseProductAmount = reservedItemsSum;
  const totalAmount = reservedItemsSum + deliveryFee;

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
          <h2 className="text-2xl font-bold text-[#2f2b3d]">Commande #{commande.id}</h2>
          <p className="text-sm text-gray-500">Récapitulatif et suivi de la commande</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#2f2b3d]">
                <ShoppingBag size={20} className="text-[#8c57ff]" />
                Détails de la Commande
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Patient</p>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[#2f2b3d] font-medium text-lg">
                        <User size={18} className="text-[#8c57ff]" />
                        {commande.patient?.first_name || commande.patient?.last_name 
                          ? `${commande.patient?.first_name || ''} ${commande.patient?.last_name || ''}` 
                          : commande.patient?.id 
                            ? `Patient #${(commande.patient.id as string).split('-')[0]}` 
                            : (typeof commande.patient === 'string' ? `Patient #${(commande.patient as string).split('-')[0]}` : "ID inconnu")
                        }
                      </div>
                      <div className="text-sm text-gray-500 ml-6 flex flex-col">
                        <span>{commande.patient?.telephone || ""}</span>
                        <span>{commande.patient?.email || ""}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Date de commande</p>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} className="text-gray-300" />
                      {(commande.created_at || commande.date_creation) ? new Date(commande.created_at || commande.date_creation!).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }) : "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Dernière mise à jour</p>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      {commande.updated_at ? new Date(commande.updated_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "-"}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Pharmacie Source</p>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 size={16} className="text-gray-300" />
                      Non spécifiée / Assiette Multiple
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Statut Actuel</p>
                    <div className="pt-1">
                      <CommandeBadge statut={commande.status} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-gray-50/20">
              <CardTitle className="text-lg font-semibold text-[#2f2b3d]">Articles Commandés</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50 uppercase text-xs tracking-wider text-gray-500">
                    <th className="text-left px-6 py-3 font-semibold">Produit</th>
                    <th className="text-center px-6 py-3 font-semibold">Qté</th>
                    <th className="text-right px-6 py-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {itemsList.length > 0 ? itemsList.map((item: any, index: number) => {
                    const isCancelled = item.status === "CANCELLED";
                    return (
                      <tr key={item.id || index} className={`hover:bg-gray-50/50 transition-colors ${isCancelled ? 'opacity-60 bg-gray-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <div className={`font-medium ${isCancelled ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{item.product?.name || item.product_name || "Produit sans nom"}</div>
                          {item.product?.dci && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.product.dci} {item.product.galenic ? `• ${item.product.galenic}` : ""}
                            </div>
                          )}
                          {item.status && <div className={`text-[10px] uppercase font-bold mt-1 ${isCancelled ? 'text-red-400' : 'text-purple-400'}`}>Status: {item.status}</div>}
                        </td>
                        <td className={`px-6 py-4 text-center font-medium ${isCancelled ? 'text-gray-400' : 'text-gray-600'}`}>{Number(item.quantity || 1)}</td>
                        <td className={`px-6 py-4 text-right font-semibold ${isCancelled ? 'text-gray-400 line-through' : 'text-[#8c57ff]'}`}>
                          {Number(item.line_total ?? (Number(item.unit_price ?? item.price ?? 0) * Number(item.quantity ?? 1))).toLocaleString()} XAF
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td colSpan={3} className="px-6 py-6 text-center text-sm font-medium text-gray-500">Aucun article transmis par l'API principale</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Résumé Financier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Sous-total commande (Produits)</span>
                <span>{baseProductAmount.toLocaleString() || "N/A"} XAF</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Frais de livraison estimés</span>
                <span>{deliveryFee.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50 font-bold text-lg">
                <div className="flex items-center gap-2 text-[#2f2b3d]">
                  <CreditCard size={18} className="text-[#8c57ff]" />
                  Total (TTC)
                </div>
                <span className="text-[#8c57ff]">{totalAmount.toLocaleString("fr-FR")} XAF</span>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  );
}
