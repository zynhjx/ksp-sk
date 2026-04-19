import React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

type BarData = {
  label: string;
  value: number;
  color?: string;
};

type SegmentData = {
  label: string;
  value: number;
  color: string;
};

interface DashboardGraphicOrganizerProps {
  employmentStatusData: SegmentData[];
  educationLevelData: SegmentData[];
  ageDistributionData: BarData[];
  genderDistributionData: BarData[];
}

const Card = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={`bg-theme-card-white shadow-sm rounded-3xl p-6 min-h-80 flex flex-col ${className}`}>
    <h2 className="text-xl font-semibold text-theme-blue mb-5">{title}</h2>
    <div className="flex-1">{children}</div>
  </div>
);

const BarChart = ({ data }: { data: BarData[] }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <ReBarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.12} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip wrapperStyle={{ borderRadius: 12, boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)" }} />
        <Bar dataKey="value" radius={[12, 12, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.color || "#2563eb"} />
          ))}
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  </div>
);

const PieDonutChart = ({
  data,
  innerRadius = 0,
}: {
  data: SegmentData[];
  innerRadius?: number;
}) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={innerRadius}
          outerRadius={100}
          paddingAngle={4}
          stroke="transparent"
        >
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip wrapperStyle={{ borderRadius: 12, boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)" }} />
        <Legend verticalAlign="bottom" layout="horizontal" iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const DashboardGraphicOrganizer = ({
  employmentStatusData,
  educationLevelData,
  ageDistributionData,
  genderDistributionData,
}: DashboardGraphicOrganizerProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <Card title="Age distribution" className="lg:col-span-2 xl:col-span-3">
        <BarChart data={ageDistributionData} />
      </Card>

      <Card title="Gender distribution">
        <BarChart data={genderDistributionData} />
      </Card>

      <Card title="Employment status">
        <PieDonutChart data={employmentStatusData} />
      </Card>

      <Card title="Education level distribution">
        <PieDonutChart data={educationLevelData} innerRadius={40} />
      </Card>
    </div>
  );
};

export default DashboardGraphicOrganizer;
