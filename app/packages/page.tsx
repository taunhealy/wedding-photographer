import PackageList from "../dashboard/admin/packages/components/PackageList";
import { prisma } from "@/lib/prisma";

interface PackagesPageProps {
  searchParams: {
    month?: string;
    category?: string;
    duration?: string;
    search?: string;
  };
}

export default async function PackagesPage({
  searchParams,
}: PackagesPageProps) {
  // Get packages with relations
  const packages = await prisma.package.findMany({
    where: {
      published: true,
      deleted: false,
    },
    include: {
      schedules: true,
      category: true,
      tags: true,
      paypalOrders: true,
    },
  });

  // Convert Decimal values to strings or numbers before passing to client components
  const serializedPackages = packages.map((pkg) => ({
    ...pkg,
    price: pkg.price.toString(), // Convert Decimal to string
    schedules: pkg.schedules.map((schedule) => ({
      ...schedule,
      price: schedule.price.toString(), // Convert schedule price Decimal to string
      date: schedule.date.toISOString(), // Convert Date to string
    })),
    // Convert any other Decimal fields if they exist
  }));

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">Wedding Photography Packages</h1>
      <p className="text-muted-foreground mb-8">
        From intimate elopements to grand celebrations, find the perfect
        photography package for your special day.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full">
          <PackageList packages={serializedPackages} />
        </div>
      </div>
    </div>
  );
}
