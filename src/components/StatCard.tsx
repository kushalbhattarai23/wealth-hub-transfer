
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  color: "green" | "red" | "blue";
}

export function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const colorClasses = {
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600", 
    blue: "bg-blue-50 text-blue-600"
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
