import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MoreVertical, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: 1,
    title: "Pharmacie Plus",
    subtitle: "Règlement Hebdomadaire",
    amount: "+450,000 FCFA",
    trend: "up",
    icon: "💊",
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 2,
    title: "Client #9842",
    subtitle: "Remboursement",
    amount: "-15,000 FCFA",
    trend: "down",
    icon: "👤",
    color: "bg-red-100 text-red-600"
  },
  {
    id: 3,
    title: "Jean (Livreur)",
    subtitle: "Paiement Hebdo",
    amount: "-85,000 FCFA",
    trend: "down",
    icon: "🛵",
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: 4,
    title: "Abonnement Premium",
    subtitle: "Patient #1105",
    amount: "+25,000 FCFA",
    trend: "up",
    icon: "⭐",
    color: "bg-[#f4f0ff] text-[#8c57ff]"
  },
  {
    id: 5,
    title: "Pharmacie de la Gare",
    subtitle: "Vente",
    amount: "+120,500 FCFA",
    trend: "up",
    icon: "🏥",
    color: "bg-green-100 text-green-600"
  }
];

export function TransactionsList() {
  return (
    <Card className="rounded-2xl border-none shadow-[0_4px_18px_0_rgba(47,43,61,0.05)] h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-[17px] font-semibold text-[#2f2b3d]">
          Dernières Transactions
        </CardTitle>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={20}/>
        </button>
      </CardHeader>
      <CardContent className="space-y-6">
        {transactions.map(t => (
          <div key={t.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", t.color)}>
                <span className="text-xl leading-none">{t.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-[#2f2b3d] leading-snug">
                  {t.title}
                </span>
                <span className="text-[13px] text-gray-500">
                  {t.subtitle}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-medium text-[#2f2b3d]">
                {t.amount}
              </span>
              {t.trend === "up" ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
