import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreatePortfolioForm } from "./components/create-portfolio-form";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Portfolio Management | Admin Dashboard",
  description: "Manage your portfolio items in the admin dashboard",
};

export default async function NewPortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/signin");
  }

  const [categories, tags] = await Promise.all([
    prisma.workCategory.findMany(),
    prisma.workTag.findMany(),
  ]);

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <CreatePortfolioForm categories={categories} tags={tags} />
      </div>
    </div>
  );
}
