"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Truck, MapPin,
  Building2, ShoppingBag, LogOut, Wallet, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";


// ── static nav config ───────────────────────────────────────────────────────
const linkGroups = [
  {
    title: "GÉNÉRAL",
    links: [
      { href: "/",           label: "Vue d'ensemble", icon: LayoutDashboard },
      { href: "/commandes",  label: "Commandes",       icon: ShoppingBag },
    ],
  },
  {
    title: "ENTITÉS",
    links: [
      { href: "/pharmacies", label: "Pharmacies", icon: Building2 },
      { href: "/patients",   label: "Patients",   icon: Users },
      { href: "/livreurs",   label: "Livreurs",   icon: Truck },
      { href: "/missions",   label: "Missions",   icon: MapPin },
    ],
  },
  {
    title: "FINANCE",
    links: [
      { href: "/wallet", label: "Wallet", icon: Wallet },
    ],
  },
  {
    title: "MODÉRATION",
    links: [
      { href: "/litiges", label: "Litiges", icon: AlertTriangle },
    ],
  },
];

// ── component ────────────────────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col shrink-0 z-20 shadow-[0_0_15px_0_rgba(47,43,61,0.05)] overflow-y-auto">
      <div className="p-6 py-5 flex items-center gap-3 sticky top-0 bg-white z-10">
        <div className="w-8 h-8 bg-[#8c57ff] rounded-lg flex items-center justify-center shadow-md shadow-[#8c57ff]/40">
          <span className="text-white text-sm font-bold">eD</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900">eDoctor Admin</h1>
          <p className="text-xs text-gray-400">Tableau de bord</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-6">
        {linkGroups.map((group, i) => (
          <div key={i}>
            <p className="px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.links.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-[#8c57ff] to-[#a379ff] text-white shadow-md shadow-[#8c57ff]/40"
                        : "text-[#2f2b3d]/70 hover:bg-gray-50 hover:text-[#2f2b3d]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className={cn("shrink-0", isActive ? "text-white" : "text-[#2f2b3d]/50")} />
                      {label}
                    </div>

                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 w-full rounded-lg",
            "text-[15px] font-medium text-[#2f2b3d]/70",
            "hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          )}
        >
          <LogOut size={20} className="shrink-0 text-[#2f2b3d]/50" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
