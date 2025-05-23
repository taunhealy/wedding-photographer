import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PackageForm from "@/app/dashboard/admin/packages/components/PackageForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewPackagePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/signin?callbackUrl=/dashboard/admin/packages");
  }

  // Fetch all tags to pass to the form
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container py-8 font-primary">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Package</h1>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <PackageForm initialData={null} allTags={tags} />
        </div>
      </div>
    </div>
  );
}
