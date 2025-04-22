import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PortfolioItemDisplay from "../../components/portfolio/portfolio-item-display";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Fix: Await the params object
  const slug = params.slug;

  const workItem = await prisma.workItem.findUnique({
    where: { slug },
  });

  if (!workItem) {
    return {
      title: "Project Not Found | Off The Grid",
      description: "The requested portfolio project could not be found.",
    };
  }

  return {
    title: `${workItem.title} | Off The Grid Portfolio`,
    description: workItem.description,
  };
}

export default async function PortfolioItemPage({
  params,
}: {
  params: { slug: string };
}) {
  const workItem = await prisma.workItem.findUnique({
    where: {
      slug: params.slug,
      published: true,
    },
    include: {
      category: true,
      tags: true,
    },
  });

  if (!workItem) {
    notFound();
  }

  return (
    <PortfolioItemDisplay
      workItem={{
        ...workItem,
        location: workItem.location || undefined,
        couple: workItem.couple || undefined,
        venue: workItem.venue || undefined,
      }}
    />
  );
}
