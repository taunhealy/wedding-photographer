import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreatePortfolioForm } from "../components/create-portfolio-form";

export default async function NewPortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/signin?callbackUrl=/dashboard/admin/portfolio");
  }

  // Fetch categories for the form
  const categories = await prisma.workCategory.findMany({
    orderBy: {
      order: "asc",
    },
  });

  // Fetch tags for the form
  const tags = await prisma.workTag.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container py-8 font-primary">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Portfolio Item</h1>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <CreatePortfolioForm categories={categories} tags={tags} />
        </div>
      </div>
    </div>
  );
}
