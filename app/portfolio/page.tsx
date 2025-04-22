import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PortfolioGrid from "../components/portfolio/portfolio-grid";
import PortfolioHeader from "../components/portfolio/portfolio-header";
import PortfolioFilter from "../components/portfolio/portfolio-filter";

export const metadata: Metadata = {
  title: "Portfolio | Off The Grid",
  description: "Explore our portfolio of creative work and projects.",
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get filter parameters
  const categorySlug =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;
  const tagSlug =
    typeof searchParams.tag === "string" ? searchParams.tag : undefined;
  const featured = searchParams.featured === "true";

  // Build the where clause for work items
  const where: any = {
    published: true,
  };

  // Filter by category
  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  // Filter by tag
  if (tagSlug) {
    where.tags = {
      some: {
        slug: tagSlug,
      },
    };
  }

  // Filter by featured status
  if (featured) {
    where.featured = true;
  }

  // Fetch data
  const [workItems, categories, tags] = await Promise.all([
    // Get work items with filters
    prisma.workItem.findMany({
      where,
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        date: "desc",
      },
    }),

    // Get categories with counts
    prisma.workCategory.findMany({
      orderBy: {
        order: "asc",
      },
      include: {
        _count: {
          select: {
            workItems: {
              where: {
                published: true,
              },
            },
          },
        },
      },
    }),

    // Get tags with counts
    prisma.workTag.findMany({
      include: {
        _count: {
          select: {
            workItems: {
              where: {
                published: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <div className="container py-12 md:py-16">
      <PortfolioHeader />

      <div className="mt-8 lg:mt-12 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <PortfolioFilter
          categories={categories}
          tags={tags}
          selectedCategory={categorySlug}
          selectedTag={tagSlug}
          featuredSelected={featured}
        />
        <div className="lg:col-span-3">
          <PortfolioGrid workItems={workItems} />
        </div>
      </div>
    </div>
  );
}
