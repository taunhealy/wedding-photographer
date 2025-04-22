import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/app/components/ui/badge";
import { WorkItem, WorkCategory, WorkTag } from "@prisma/client";

interface PortfolioGridProps {
  workItems: (WorkItem & {
    category: WorkCategory;
    tags: WorkTag[];
  })[];
}

export default function PortfolioGrid({ workItems }: PortfolioGridProps) {
  if (workItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-medium">No portfolio items found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your filters or check back later for new content.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {workItems.map((item) => (
        <Link
          key={item.id}
          href={`/portfolio/${item.slug}`}
          className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
        >
          <div className="aspect-[4/3] relative overflow-hidden">
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {item.featured && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
              </div>
            )}
          </div>
          <div className="p-5">
            <div className="mb-2 flex items-center justify-between">
              <Badge variant="outline">{item.category.name}</Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(item.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
              {item.title}
            </h3>
            <p className="mb-4 line-clamp-2 text-muted-foreground">
              {item.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {item.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{item.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
