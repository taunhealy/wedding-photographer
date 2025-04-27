import { DashboardTabsNavigation } from "@/app/components/dashboard/dashboard-tabs-navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

type Role = "admin" | "guide" | "customer";

interface TabConfig {
  id: string;
  label: string;
  href: string;
  roles: Role[];
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user.role?.toLowerCase() as Role) || "customer";

  // Centralized tab configuration based on your file structure
  const TAB_CONFIG: TabConfig[] = [
    // Admin sections
    {
      id: "admin-bookings",
      label: "Bookings Management",
      href: "/dashboard/admin/bookings",
      roles: ["admin"],
    },
    {
      id: "packages",
      label: "Packages Management",
      href: "/dashboard/admin/packages",
      roles: ["admin"],
    },
    {
      id: "portfolio",
      label: "Portfolio Management",
      href: "/dashboard/admin/portfolio",
      roles: ["admin"],
    },
    {
      id: "settings",
      label: "System Settings",
      href: "/dashboard/settings",
      roles: ["admin"],
    },

    // Client sections
    {
      id: "my-bookings",
      label: "My Sessions",
      href: "/dashboard/client/bookings",
      roles: ["customer"],
    },
    {
      id: "my-gallery",
      label: "My Gallery",
      href: "/dashboard/client/gallery",
      roles: ["customer"],
    },
    {
      id: "profile",
      label: "Profile",
      href: "/dashboard/profile",
      roles: ["admin", "customer"],
    },
  ];

  // Filter tabs based on user role
  const tabs = TAB_CONFIG.filter((tab) => tab.roles.includes(userRole));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-h2 mb-6 font-primary">
        Welcome, {session.user.name || "Explorer"}
      </h1>

      <DashboardTabsNavigation tabs={tabs} />

      {children}
    </div>
  );
}
