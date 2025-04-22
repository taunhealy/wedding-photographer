"use client";

import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { X } from "lucide-react";

interface PortfolioFilterProps {
  categories: any[];
  tags: any[];
  selectedCategory?: string;
  selectedTag?: string;
  featuredSelected?: boolean;
}

export default function PortfolioFilter({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  featuredSelected,
}: PortfolioFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Function to update URL with filters
  const updateFilters = (params: Record<string, string | null>) => {
    const url = new URL(window.location.href);

    // Update or remove each parameter
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });

    router.push(url.pathname + url.search);
  };

  // Handle category selection
  const handleCategoryClick = (slug: string) => {
    updateFilters({
      category: selectedCategory === slug ? null : slug,
    });
  };

  // Handle tag selection
  const handleTagClick = (slug: string) => {
    updateFilters({
      tag: selectedTag === slug ? null : slug,
    });
  };

  // Toggle featured filter
  const handleFeaturedToggle = () => {
    updateFilters({
      featured: featuredSelected ? null : "true",
    });
  };

  // Clear all filters
  const clearFilters = () => {
    router.push(pathname);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategory || selectedTag || featuredSelected;

  return (
    <div className="space-y-6">
      {/* Mobile filter indicator */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between lg:hidden">
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge variant="outline" className="flex items-center gap-1">
                {categories.find((c) => c.slug === selectedCategory)?.name}
                <X
                  className="h-3 w-3"
                  onClick={() => updateFilters({ category: null })}
                />
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="outline" className="flex items-center gap-1">
                {tags.find((t) => t.slug === selectedTag)?.name}
                <X
                  className="h-3 w-3"
                  onClick={() => updateFilters({ tag: null })}
                />
              </Badge>
            )}
            {featuredSelected && (
              <Badge variant="outline" className="flex items-center gap-1">
                Featured
                <X
                  className="h-3 w-3"
                  onClick={() => updateFilters({ featured: null })}
                />
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="hidden lg:flex"
            >
              Clear All
            </Button>
          )}
        </div>

        <Separator className="my-4" />

        {/* Featured filter */}
        <div className="mb-6">
          <Button
            variant={featuredSelected ? "default" : "outline"}
            size="sm"
            onClick={handleFeaturedToggle}
            className="w-full justify-start"
          >
            Featured Work
          </Button>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="font-medium">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.slug ? "default" : "ghost"
                }
                size="sm"
                className={`w-full justify-between ${selectedCategory === category.slug ? "" : "text-muted-foreground"}`}
                onClick={() => handleCategoryClick(category.slug)}
              >
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {category._count.workItems}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="font-medium">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTag === tag.slug ? "default" : "outline"}
                className={`cursor-pointer ${tag._count.workItems === 0 ? "opacity-50" : ""}`}
                onClick={() =>
                  tag._count.workItems > 0 && handleTagClick(tag.slug)
                }
              >
                {tag.name} ({tag._count.workItems})
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
