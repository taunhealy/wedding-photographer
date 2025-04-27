import { prisma } from "@/lib/prisma";
import PackageList from "./components/PackageList";
import { Package, PackageSchedule, PackageCategory, Tag } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { JsonValue } from "@prisma/client/runtime/library";

// Define the type for Package with its relations
interface PackageWithRelations extends Package {
  schedules: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    notes: string | null;
    price: Decimal;
    packageId: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    available: boolean;
    metadata: JsonValue;
  }[];
  category: PackageCategory | null;
  tags: Tag[];
}

export default async function PackagesManagementPage() {
  const packages = await prisma.package.findMany({
    include: {
      schedules: true,
      category: true,
      tags: true,
      paypalOrders: true,
    },
    where: {
      deleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedPackages = packages.map((pkg) => ({
    ...pkg,
    price: pkg.price.toString(),
    schedules: pkg.schedules.map((schedule) => ({
      ...schedule,
      price: schedule.price.toString(),
      date: schedule.date.toISOString(),
    })),
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-h3 font-primary">Packages Management</h2>
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <PackageList packages={formattedPackages} />
      </div>
    </div>
  );
}
