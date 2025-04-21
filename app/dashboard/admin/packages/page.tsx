import { prisma } from "@/lib/prisma";
import PackageList from "@/app/components/packages/PackageList";
import { Package, PackageSchedule, PackageCategory, Tag } from "@prisma/client";

// Define the type for Package with its relations
interface PackageWithRelations extends Package {
  schedules: PackageSchedule[];
  category: PackageCategory | null;
  tags: Tag[];
}

export default async function PackagesManagementPage() {
  const packages = await prisma.package.findMany({
    include: {
      schedules: true,
      category: true,
      tags: true,
    },
    where: {
      deleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-h3 font-primary">Packages Management</h2>
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <PackageList packages={packages as PackageWithRelations[]} />
      </div>
    </div>
  );
}
