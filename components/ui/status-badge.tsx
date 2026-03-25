import { Badge } from "@/components/ui/badge";
import { StatutValidation, OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const validationConfig: Record<StatutValidation, 
  { label: string; className: string }> = {
  valide:     { label: "Validé",     
                className: "bg-green-100 text-green-700 hover:bg-green-100" },
  en_attente: { label: "En attente", 
                className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  rejete:     { label: "Rejeté",     
                className: "bg-red-100 text-red-700 hover:bg-red-100" },
};

const commandeConfig: Record<string, { label: string; className: string }> = {
  "PENDING":            { label: "En attente", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  "PARTIAL_VALIDATION": { label: "Validation Partielle", className: "bg-orange-100 text-orange-700 hover:bg-orange-100" },
  "VALIDATED":          { label: "Validée", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  "IN_PICKUP":          { label: "En ramassage", className: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100" },
  "IN_TRANSIT":         { label: "En transit", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
  "PAYMENT_PENDING":    { label: "Paiement en attente", className: "bg-pink-100 text-pink-700 hover:bg-pink-100" },
  "COMPLETED":          { label: "Terminée", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" },
  "DELIVERED":          { label: "Livrée", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  "CANCELLED":          { label: "Annulée", className: "bg-red-100 text-red-700 hover:bg-red-100" },
};

export function ValidationBadge({ statut }: { statut: StatutValidation }) {
  const cfg = validationConfig[statut];
  if (!cfg) return null;
  return (
    <Badge className={cn("font-medium border-0", cfg.className)}>
      {cfg.label}
    </Badge>
  );
}

export function CommandeBadge({ statut }: { statut: OrderStatus | string }) {
  const cfg = commandeConfig[statut];
  if (!cfg) {
    return (
      <Badge className="font-medium border-0 bg-gray-100 text-gray-700">
        {statut}
      </Badge>
    );
  }
  return (
    <Badge className={cn("font-medium border-0", cfg.className)}>
      {cfg.label}
    </Badge>
  );
}
