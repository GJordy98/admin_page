"use client";
import { useEffect, useState } from "react";
import { Users, Truck, Building2, Loader2 } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { commandesApi, patientsApi, pharmaciesApi, livreursApi } from "@/lib/api";
import { KPI, DailyAmount, PaginatedResponse, Commande } from "@/types";
import { CommandeBadge } from "@/components/ui/status-badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [dailyData, setDailyData] = useState<DailyAmount[]>([]);
  const [period, setPeriod] = useState<'1j' | '7j' | '30j' | '12m'>('7j');

  // Real stats
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPharmacies, setTotalPharmacies] = useState(0);
  const [totalLivreurs, setTotalLivreurs] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Commande[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [kpiData, dailyRes, patRes, pharmRes, livRes, ordRes] = await Promise.allSettled([
        commandesApi.kpi(),
        commandesApi.dailyAmount(),
        patientsApi.list(1),
        pharmaciesApi.list(1),
        livreursApi.list(1),
        commandesApi.list(1),
      ]);

      if (kpiData.status === "fulfilled") setKpi(kpiData.value as KPI);
      if (dailyRes.status === "fulfilled") {
        const value: any = dailyRes.value;
        const arr = Array.isArray(value)
          ? value
          : value?.results || value?.data || value?.montants || value?.daily_amounts || [];
        setDailyData(Array.isArray(arr) ? arr : []);
      }
      if (patRes.status === "fulfilled") {
        const d = patRes.value as PaginatedResponse<any> | any[];
        setTotalPatients("count" in d ? d.count : d.length);
      }
      if (pharmRes.status === "fulfilled") {
        const d = pharmRes.value as PaginatedResponse<any> | any[];
        setTotalPharmacies("count" in d ? d.count : d.length);
      }
      if (livRes.status === "fulfilled") {
        const d = livRes.value as PaginatedResponse<any> | any[];
        setTotalLivreurs("count" in d ? d.count : d.length);
      }
      if (ordRes.status === "fulfilled") {
        const d = ordRes.value as PaginatedResponse<Commande> | Commande[];
        const orders = "results" in d ? d.results : d;
        setRecentOrders(orders.slice(0, 5));
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#8c57ff]" size={40} />
      </div>
    );
  }

  const getChartData = () => {
    const sorted = [...dailyData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    switch (period) {
      case '1j':
        return sorted.slice(-1).map((d) => ({
          name: new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
          value: d.montant,
        }));
      case '7j':
        return sorted.slice(-7).map((d) => ({
          name: new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
          value: d.montant,
        }));
      case '30j':
        return sorted.slice(-30).map((d) => ({
          name: new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
          value: d.montant,
        }));
      case '12m': {
        const byMonth: Record<string, number> = {};
        sorted.forEach((d) => {
          const key = new Date(d.date).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
          byMonth[key] = (byMonth[key] || 0) + d.montant;
        });
        return Object.entries(byMonth).slice(-12).map(([name, value]) => ({ name, value }));
      }
      default:
        return [];
    }
  };

  const chartData = getChartData();
  const periodLabels: Record<string, string> = {
    '1j': "Aujourd'hui",
    '7j': '7 derniers jours',
    '30j': '30 derniers jours',
    '12m': '12 derniers mois',
  };

  return (
    <div className="space-y-6">

      {/* ── Ligne 1 : Gain Total + Patients Inscrits ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Gain Total"
          value={`${(kpi?.gain_total || 0).toLocaleString()} F`}
          color="purple"
          className="bg-white border border-gray-100 shadow-sm"
        >
          <div className="h-16 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.length ? chartData : [{ name: 'Aucun', value: 0 }]}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8c57ff"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#fff", stroke: "#8c57ff", strokeWidth: 2 }}
                  className="drop-shadow-sm"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-gray-400 font-medium mt-3">Revenus sur 7 jours</p>
        </StatsCard>

        <StatsCard
          title="Patients Inscrits"
          value={totalPatients}
          icon={Users}
          color="blue"
          className="bg-white border border-gray-100 shadow-sm"
        />
      </div>

      {/* ── Ligne 2 : Livreurs + Pharmacies ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard title="Livreurs Inscrits"     value={totalLivreurs}   icon={Truck}     color="green" />
        <StatsCard title="Pharmacies Partenaires" value={totalPharmacies} icon={Building2} color="sky"   />
      </div>

      {/* ── Ligne 3 : BarChart + Commandes Récentes ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 flex-wrap gap-3">
              <div>
                <CardTitle className="text-[17px] font-semibold text-[#2f2b3d]">
                  Évolution des Revenus
                </CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">{periodLabels[period]}</p>
              </div>
              {/* Sélecteur de période */}
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1">
                {(['1j', '7j', '30j', '12m'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                      period === p
                        ? 'bg-[#8c57ff] text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {p === '1j' ? 'Auj.' : p === '12m' ? '1 an' : p}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-gray-400 text-sm">
                  Aucune donnée disponible pour cette période
                </div>
              ) : (
                <div className="h-[280px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                      <Tooltip
                        cursor={{ fill: "#f9fafb" }}
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        formatter={(v: any) => [`${Number(v).toLocaleString()} F`, 'Revenus']}
                      />
                      <Bar dataKey="value" fill="#8c57ff" radius={[6, 6, 0, 0]} barSize={period === '30j' ? 10 : period === '12m' ? 22 : 35} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-1">
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-[17px] font-semibold text-[#2f2b3d]">
                Commandes Récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Aucune commande récente</p>
              ) : (
                recentOrders.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 cursor-pointer rounded-lg px-2 -mx-2 transition-colors"
                    onClick={() => router.push(`/commandes/${c.id}`)}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-gray-900 text-[14px]">
                        #{c.id} — {c.patient?.first_name} {c.patient?.last_name}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {(c.montant_total || 0).toLocaleString()} XAF
                      </p>
                    </div>
                    <div className="text-right">
                      <CommandeBadge statut={c.status} />
                    </div>
                  </div>
                ))
              )}
              <Button
                variant="outline"
                className="w-full mt-4 text-[#8c57ff] border-purple-100 hover:bg-purple-50"
                onClick={() => router.push("/commandes")}
              >
                Voir tout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
