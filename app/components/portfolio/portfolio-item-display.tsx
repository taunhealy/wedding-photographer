"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkItemProps {
  workItem: {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    images: string[];
    date: Date | string;
    featured: boolean;
    location?: string;
    couple?: string;
    venue?: string;
    content?: string;
    category: {
      id: string;
      name: string;
    };
    tags: Array<{
      id: string;
      name: string;
    }>;
  };
}

export default function PortfolioItemDisplay({ workItem }: WorkItemProps) {
  const router = useRouter();

  return (
    <div className="container py-12 md:py-16">
      <Link
        href="/portfolio"
        className="inline-flex items-center mb-8 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Portfolio
      </Link>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-1 lg:col-span-2">
          <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
            <Image
              src={workItem.coverImage}
              alt={workItem.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 66vw"
            />
          </div>

          {workItem.images.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              {workItem.images.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] relative overflow-hidden rounded-lg"
                >
                  <Image
                    src={image}
                    alt={`${workItem.title} - Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 22vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge>{workItem.category.name}</Badge>
              {workItem.featured && <Badge variant="secondary">Featured</Badge>}
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {workItem.title}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {new Date(workItem.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="prose max-w-none dark:prose-invert">
            <p>{workItem.description}</p>
          </div>

          {workItem.location && (
            <div>
              <h3 className="text-lg font-medium">Location</h3>
              <p>{workItem.location}</p>
            </div>
          )}

          {workItem.couple && (
            <div>
              <h3 className="text-lg font-medium">Couple</h3>
              <p>{workItem.couple}</p>
            </div>
          )}

          {workItem.venue && (
            <div>
              <h3 className="text-lg font-medium">Venue</h3>
              <p>{workItem.venue}</p>
            </div>
          )}

          {workItem.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {workItem.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button className="w-full" onClick={() => router.push("/contact")}>
            Contact Us
          </Button>
        </div>
      </div>

      {workItem.content && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">About This Project</h2>
          <div
            className="prose max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: workItem.content }}
          />
        </div>
      )}

      {workItem.images.length > 3 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {workItem.images.slice(3).map((image, index) => (
              <div
                key={index + 3}
                className="aspect-[4/3] relative overflow-hidden rounded-lg"
              >
                <Image
                  src={image}
                  alt={`${workItem.title} - Gallery image ${index + 4}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
