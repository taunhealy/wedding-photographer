import { prisma } from "@/lib/prisma";
import PackageForm from "@/app/dashboard/admin/packages/components/PackageForm";
import { notFound } from "next/navigation";
import {
  PackageWithRelations,
  PackageWithRelationsDB,
} from "@/lib/types/package";

function serializePackage(
  package_: PackageWithRelationsDB
): PackageWithRelations {
  return {
    ...package_,
    price: Number(package_.price),
    schedules: package_.schedules.map((schedule) => ({
      ...schedule,
      price: Number(schedule.price),
    })),
  };
}

export default async function EditPackagePage({
  params,
}: {
  params: { id: string };
}) {
  // Await the params object
  const id = params.id;

  const package_ = await prisma.package.findUnique({
    where: { id },
    include: {
      category: true,
      tags: true,
      schedules: true,
    },
  });

  if (!package_) {
    return notFound();
  }

  // Fetch all available tags for the tag selector
  const allTags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const serializedPackage = serializePackage(package_);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Edit Package</h1>
      <PackageForm initialData={serializedPackage} allTags={allTags} />
    </div>
  );
}
