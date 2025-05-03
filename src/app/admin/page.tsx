import { SummaryDashboard } from "@/components";


export default async function AdminPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <SummaryDashboard />
    </div>
  );
}