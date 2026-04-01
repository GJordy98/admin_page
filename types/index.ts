export type StatusCart = "ACTIVE" | "EXPIRED" | "ORDERED";

export type OrderStatus = 
  | "PENDING" | "PARTIAL_VALIDATION" | "VALIDATED" 
  | "IN_PICKUP" | "IN_TRANSIT" | "PAYMENT_PENDING" 
  | "COMPLETED" | "DELIVERED" | "CANCELLED";

export type OfficineOrderStatus = 
  | "PENDING" | "PENDING_PATIENT" | "APPROVED" 
  | "REJECTED" | "READY_FOR_PICKUP" | "PICKED_UP" 
  | "CANCELLED" | "COMPLETED";

export type SubitemStatus = 
  | "PENDING" | "RESERVED" | "PICKED" 
  | "CANCELLED" | "COMPLETED";

export type PickupStatus = 
  | "ASSIGNED" | "ACCEPTED" | "EN_ROUTE" 
  | "ARRIVED" | "CONFIRMED" | "PICKED_UP" 
  | "CANCELLED" | "TIMEOUT";

export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export type StatutValidation = "en_attente" | "valide" | "rejete"; // Keeping existing if not specified otherwise

export interface AdminUser {
  id: string;
  telephone?: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
  phone_number?: string;
  is_active: boolean;
  active?: boolean;
  is_staff?: boolean;
  is_admin?: boolean;
  date_joined?: string;
  created_at?: string;
}

export interface PatientAdresse {
  id?: string;
  city?: string;
  rue?: string;
  quater?: string;
  bp?: string;
  longitude?: number;
  latitude?: number;
  telephone?: string;
  created_at?: string;
  country?: number;
}

export interface Patient {
  id: string;
  user: AdminUser;
  first_name?: string;
  last_name?: string;
  birthdate?: string;
  sexe?: string;
  profession?: string;
  profile_image?: string | null;
  created_at?: string;
  date_inscription?: string;
  adresse?: PatientAdresse | null;
}

export type OnboardingStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
export type DriverStatus = "IS_FREE" | "IS_BUSY" | "OFFLINE";

export interface Livreur {
  id: string;
  user: AdminUser;
  zone?: string;
  is_active?: boolean;
  statut_validation?: StatutValidation;
  birthdate?: string;
  onboarding_status?: OnboardingStatus | string;
  status?: DriverStatus | string;
  rejection_reason?: string | null;
  validated_at?: string | null;
  created_at?: string;
  livraisons_total?: number;
  total_deliveries?: number;
  deliveries_count?: number;
  missions_count?: number;
}

export interface Pharmacie {
  id: string;
  name: string;
  description: string;
  telephone: string;
  is_activate: boolean;
  pharmacist_holder: {
    id?: string;
    user: {
      id?: string;
      telephone?: string;
      email: string;
      first_name: string;
      last_name: string;
      role?: string;
      is_active: boolean;
      active?: boolean;
      is_staff?: boolean;
      is_admin?: boolean;
      created_at?: string;
    };
    poste?: string;
    sexe?: string;
    created_at?: string;
  };
  created_at?: string;
}

export interface OrderItem {
  id?: string;
  product?: string;
  product_name: string;
  quantity: number | string;
  price: number;
  selected_unit?: string;
}

export interface Commande {
  id: string;
  patient: any; // Using any or expanding properties to avoid type issues with nested or flat responses
  patient_name?: string;
  status: OrderStatus | string;
  items?: any[];
  cart?: {
    total_amount?: number | string;
    items?: OrderItem[];
  };
  montant_total?: number | string;
  total_amount?: number | string;
  amount?: number | string;
  delivery_fee?: number | string;
  payment_status?: string;
  updated_at?: string;
  product_amount?: number;
  montant_produits?: number;
  montant_sans_livraison?: number;
  date_creation?: string;
  created_at?: string;
}

export interface Mission {
  id: string;
  driver: Livreur;
  status: PickupStatus | string;
  date_creation: string;
}

export interface Pickup {
  id: string;
  officine: Pharmacie;
  mission: Mission;
}

export interface KPI {
  total_orders: number;
  total_revenue: number;
  orders_per_officine: {
    id: string;
    name: string;
    order_count: number;
  }[];
  revenue_per_officine: {
    id: string;
    name: string;
    revenue: number;
  }[];
}

export interface DailyAmount {
  date: string;
  total: number;
  count: number;
}

export interface DashboardStats {
  total_patients: number;
  total_livreurs: number;
  total_pharmacies: number;
  total_commandes: number;
  revenus_total: number;
  commandes_aujourd_hui: number;
}

export interface Wallet {
  id: string;
  balance: string;
  created_at: string;
  updated_at: string;
}

export interface RevenueData {
  mois: string;
  revenus: number;
  commandes: number;
}

export interface ValidationDemande {
  id: string;
  type: "Livreur" | "Pharmacie";
  nom: string;
  soumis_le: string;
}

export type PrioriteLitige = "Basse" | "Moyenne" | "Haute";

export interface Litige {
  id: string;
  commande_id: string;
  patient: string;
  motif: string;
  priorite: PrioriteLitige;
}

export interface WalletTransaction {
  id: string;
  date: string;
  commande_id: string;
  pharmacie: string;
  montant: number;
  commission: number;
  statut: "Reçu" | "En attente" | "Annulé";
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
