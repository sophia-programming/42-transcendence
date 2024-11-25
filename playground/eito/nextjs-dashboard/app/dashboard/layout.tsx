import SideNav from "@/app/ui/dashboard/sidenav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SideNav />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
