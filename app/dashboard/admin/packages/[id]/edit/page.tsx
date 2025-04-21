import { prisma } from "@/lib/prisma";
import PackageForm from "@/app/components/packages/PackageForm";
import { notFound } from "next/navigation";

export default async function EditPackagePage({
  params,
}: {
  params: { id: string };
}) {
  const package_ = await prisma.package.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      tags: true,
      schedules: true,
    },
  });

  if (!package_) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Edit Package</h1>
      <PackageForm initialData={package_} />
    </div>
  );
}
