import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PackageForm from "@/app/components/packages/PackageForm";
import { authOptions } from "@/lib/auth";

export default async function NewPackagePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/signin?callbackUrl=/dashboard/admin/packages");
  }

  return (
    <div className="container py-8 font-primary">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Package</h1>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <PackageForm />
        </div>
      </div>
    </div>
  );
}
