import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { value: number; label: string };
  color?: "blue" | "green" | "purple" | "orange" | "red" | "sky";
  children?: React.ReactNode;
  className?: string;
}

const colorMap = {
  blue:   "text-blue-600 bg-blue-100/50",
  green:  "text-green-600 bg-green-100/50",
  purple: "text-[#8c57ff] bg-[#f4f0ff]",
  orange: "text-orange-600 bg-orange-100/50",
  red:    "text-red-600 bg-red-100/50",
  sky:    "text-sky-600 bg-sky-100/50",
};

export function StatsCard({ 
  title, value, subtitle, icon: Icon, trend, color = "purple", children, className 
}: StatsCardProps) {
  return (
    <Card className={cn("rounded-2xl border-none shadow-[0_4px_18px_0_rgba(47,43,61,0.05)] w-full overflow-hidden relative", className)}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-[15px] font-medium text-gray-500">
            {title}
          </CardTitle>
          <span className="text-[26px] font-bold text-[#2f2b3d] leading-none">
            {value}
          </span>
        </div>
        {Icon && (
          <div className={cn("p-2.5 rounded-lg", colorMap[color])}>
            <Icon size={22} />
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-5">
        {subtitle && (
          <p className="text-[13px] text-gray-500 mb-1">{subtitle}</p>
        )}
        {trend && (
          <p className={cn("text-[13px] font-medium flex items-center gap-1.5 mt-2",
            trend.value >= 0 ? "text-green-500" : "text-red-500")}>
            <span className={cn("inline-flex items-center justify-center rounded-full w-[18px] h-[18px]", 
              trend.value >= 0 ? "bg-green-100" : "bg-red-100")}>
              {trend.value >= 0 ? "↑" : "↓"}
            </span> 
            {Math.abs(trend.value)}% <span className="text-gray-400 ml-1 font-normal">{trend.label}</span>
          </p>
        )}
        {children && <div className="mt-4 w-full">{children}</div>}
      </CardContent>
    </Card>
  );
}
