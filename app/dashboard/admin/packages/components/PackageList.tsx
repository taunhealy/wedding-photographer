"use client";

import {
  Package,
  PackageSchedule,
  PackageCategory,
  Tag,
  PaypalOrder,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { JsonValue } from "@prisma/client/runtime/library";

interface PackageWithRelations extends Omit<Package, "price"> {
  price: string;
  schedules: (Omit<PackageSchedule, "price" | "date"> & {
    price: string;
    date: string;
  })[];
  category: PackageCategory | null;
  tags: Tag[];
  images: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  metadata: JsonValue | null;
  deleted: boolean;
  deletedAt: Date | null;
  paypalOrders: PaypalOrder[];
}

interface PackageListProps {
  packages: PackageWithRelations[];
  editPath?: string;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  createPath?: string;
  onEdit?: (pkg: PackageWithRelations) => void;
}

export default function PackageList({
  packages,
  editPath = "/dashboard/admin/packages/[packageId]/edit",
  onDelete = () => {},
  isDeleting = false,
  createPath = "/dashboard/admin/packages/new",
  onEdit = () => {},
}: PackageListProps) {
  const router = useRouter();

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(parseFloat(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEdit = (packageId: string) => {
    const path = editPath.replace("[packageId]", packageId);
    router.push(path);
  };

  const handleCreateNew = () => {
    router.push(createPath);
  };

  const handlePackageClick = (packageId: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    router.push(`/packages/${packageId}`);
  };

  if (!packages || packages.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500 font-primary">
          No packages found. Create your first photography package!
        </p>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-h4 font-primary">All Packages</h3>
          <Button
            onClick={handleCreateNew}
            variant="default"
            className="bg-primary hover:bg-primary-dark text-black"
          >
            Create New Package
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-h4 font-primary">All Packages</h3>
        <Button
          onClick={handleCreateNew}
          variant="default"
          className="bg-primary hover:bg-primary-dark text-black"
        >
          Create New Package
        </Button>
      </div>

      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={(e) => handlePackageClick(pkg.id, e)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-h4 mb-1">{pkg.name}</h3>
              <div className="flex items-center space-x-2 mb-2">
                {pkg.category && (
                  <span className="badge badge-blue">{pkg.category.name}</span>
                )}
                {pkg.published ? (
                  <span className="badge badge-green">Published</span>
                ) : (
                  <span className="badge badge-red">Draft</span>
                )}
              </div>
              <p className="text-gray-600 line-clamp-2 font-primary">
                {pkg.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {pkg.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(pkg.id);
                }}
                className="btn btn-outline py-1 px-3"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(pkg.id);
                }}
                className="btn py-1 px-3 bg-red-100 text-red-600 hover:bg-red-200"
                disabled={isDeleting}
              >
                {isDeleting ? "..." : "Delete"}
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 font-primary">
            <div className="flex justify-between">
              <span>{pkg.duration} hours</span>
              <span>{formatPrice(pkg.price)}</span>
            </div>
            <div className="mt-2">
              <span>Schedules: {pkg.schedules?.length || 0}</span>
              {pkg.highlights.length > 0 && (
                <span className="ml-4">
                  Highlights: {pkg.highlights.length}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
