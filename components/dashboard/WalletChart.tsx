"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { MoreVertical, PieChart, CreditCard, DollarSign } from "lucide-react";

// Mock data representing the 3 floating segments
const data = [
  { year: '2015', profit: 26, spacer1: 4, income: 0,  spacer2: 0, expense: 0 },
  { year: '2016', profit: 18, spacer1: 4, income: 12, spacer2: 0, expense: 0 },
  { year: '2017', profit: 21, spacer1: 4, income: 8,  spacer2: 0, expense: 0 },
  { year: '2018', profit: 16, spacer1: 4, income: 12, spacer2: 4, expense: 10 },
  { year: '2019', profit: 26, spacer1: 4, income: 0,  spacer2: 0, expense: 0 },
  { year: '2020', profit: 16, spacer1: 4, income: 10, spacer2: 4, expense: 8 },
  { year: '2021', profit: 32, spacer1: 4, income: 8,  spacer2: 4, expense: 12 },
];

export function WalletChart() {
  return (
    <Card className="rounded-2xl border-none shadow-[0_4px_18px_0_rgba(47,43,61,0.05)] w-full overflow-hidden h-full">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Side: Chart */}
        <div className="flex-1 md:border-r border-gray-100 p-6 flex flex-col">
          <CardHeader className="p-0 pb-6 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-[#2f2b3d]">Total Profit</CardTitle>
          </CardHeader>
          <div className="flex-1 w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barSize={12} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#9ca3af" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#9ca3af" }} tickFormatter={(v) => `${v}K`} />
                <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 18px 0 rgba(47,43,61,0.1)" }} />
                
                {/* Bottom Segment (Purple) */}
                <Bar dataKey="profit" stackId="a" fill="#8c57ff" radius={20} />
                <Bar dataKey="spacer1" stackId="a" fill="transparent" />
                
                {/* Middle Segment (Green) */}
                <Bar dataKey="income" stackId="a" fill="#72E128" radius={20} />
                <Bar dataKey="spacer2" stackId="a" fill="transparent" />
                
                {/* Top Segment (Gray) */}
                <Bar dataKey="expense" stackId="a" fill="#8d9498" radius={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: KPI & Info */}
        <div className="w-full md:w-[320px] p-6 flex flex-col justify-between shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[26px] font-bold text-[#2f2b3d] leading-none mb-1">$482.85k</p>
              <p className="text-sm text-gray-500">Last month balance $234.40k</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={20}/></button>
          </div>

          <div className="space-y-6 mt-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#72E128]/10 flex items-center justify-center text-[#72E128]">
                <PieChart size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#2f2b3d]">$48,568.20</span>
                <span className="text-[13px] text-gray-500">Total Profit</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#f4f0ff] flex items-center justify-center text-[#8c57ff]">
                <CreditCard size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#2f2b3d]">$38,453.25</span>
                <span className="text-[13px] text-gray-500">Total Income</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                <DollarSign size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#2f2b3d]">$2,453.45</span>
                <span className="text-[13px] text-gray-500">Total Expense</span>
              </div>
            </div>
          </div>

          <Button className="w-full h-11 bg-[#8c57ff] hover:bg-[#7841f4] text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-md shadow-[#8c57ff]/40">
            View Report
          </Button>
        </div>
      </div>
    </Card>
  );
}
