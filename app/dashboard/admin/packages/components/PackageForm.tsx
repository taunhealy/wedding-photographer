"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PackageWithRelations } from "@/lib/types/package";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "sonner";
import { MultiSelect } from "@/app/components/ui/multi-select";
import { Plus, X } from "lucide-react";

// 1. Schema for validation
const packageFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  duration: z.coerce
    .number()
    .int()
    .positive("Duration must be a positive number"),
  price: z.coerce.number().nonnegative("Price must be a non-negative number"),
  images: z.array(z.string()),
  published: z.boolean(),
  categoryId: z.string().nullable(),
  tags: z.array(z.string()),
  highlights: z.array(z.string()),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
});

type PackageFormValues = z.infer<typeof packageFormSchema>;

interface PackageFormProps {
  initialData?: PackageWithRelations | null;
  allTags: { id: string; name: string }[];
}

export default function PackageForm({
  initialData,
  allTags,
}: PackageFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highlightInput, setHighlightInput] = useState("");
  const [inclusionInput, setInclusionInput] = useState("");
  const [exclusionInput, setExclusionInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["packageCategories"],
    queryFn: async () => {
      const response = await fetch("/api/package-categories");
      return response.json();
    },
  });

  // Fetch tags
  const { data: tagsData = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await fetch("/api/tags");
      return response.json();
    },
  });

  // Format tags for MultiSelect
  const tagOptions = Array.isArray(tagsData)
    ? tagsData.map((tag) => ({
        value: tag.id,
        label: tag.name,
      }))
    : [];

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard/admin/packages");
    }
  }, [status, router]);

  // Initialize the form
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      duration: initialData?.duration || 1,
      price: initialData?.price ? parseFloat(initialData.price.toString()) : 0,
      images: initialData?.images || [],
      published: initialData?.published || false,
      categoryId: initialData?.categoryId || null,
      tags: initialData?.tags?.map((tag) => tag.id) || [],
      highlights: initialData?.highlights || [],
      inclusions: initialData?.inclusions || [],
      exclusions: initialData?.exclusions || [],
    },
  });

  // Get values from form
  const highlights = form.watch("highlights") || [];
  const inclusions = form.watch("inclusions") || [];
  const exclusions = form.watch("exclusions") || [];

  // Add highlight
  const addHighlight = () => {
    if (highlightInput.trim()) {
      form.setValue("highlights", [...highlights, highlightInput]);
      setHighlightInput("");
    }
  };

  // Remove highlight
  const removeHighlight = (index: number) => {
    form.setValue(
      "highlights",
      highlights.filter((_, i) => i !== index)
    );
  };

  // Add inclusion
  const addInclusion = () => {
    if (inclusionInput.trim()) {
      form.setValue("inclusions", [...inclusions, inclusionInput]);
      setInclusionInput("");
    }
  };

  // Remove inclusion
  const removeInclusion = (index: number) => {
    form.setValue(
      "inclusions",
      inclusions.filter((_, i) => i !== index)
    );
  };

  // Add exclusion
  const addExclusion = () => {
    if (exclusionInput.trim()) {
      form.setValue("exclusions", [...exclusions, exclusionInput]);
      setExclusionInput("");
    }
  };

  // Remove exclusion
  const removeExclusion = (index: number) => {
    form.setValue(
      "exclusions",
      exclusions.filter((_, i) => i !== index)
    );
  };

  // Add tag
  const addTag = async () => {
    if (tagInput.trim()) {
      // Check if tag already exists in the options
      const existingTag = tagOptions.find(
        (tag) => tag.label.toLowerCase() === tagInput.trim().toLowerCase()
      );

      if (existingTag) {
        // If tag exists, add it to selected tags if not already selected
        if (!form.getValues("tags").includes(existingTag.value)) {
          form.setValue("tags", [...form.getValues("tags"), existingTag.value]);
        }
      } else {
        // Create a new tag
        try {
          const response = await fetch("/api/tags", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: tagInput.trim() }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to create tag");
          }

          const newTag = await response.json();

          // Add the new tag to the form values
          form.setValue("tags", [...form.getValues("tags"), newTag.id]);

          // Refresh the tags list
          queryClient.invalidateQueries({ queryKey: ["tags"] });

          toast.success(`Tag "${newTag.name}" created successfully`);
        } catch (error: any) {
          toast.error(
            `Error creating tag: ${error?.message || "Unknown error"}`
          );
        }
      }
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagId: string) => {
    form.setValue(
      "tags",
      form.getValues("tags").filter((id) => id !== tagId)
    );
  };

  // Mutation for creating/updating package
  const packageMutation = useMutation({
    mutationFn: async (values: PackageFormValues) => {
      const url = initialData
        ? `/api/packages/${initialData.id}`
        : "/api/packages";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save package");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success(
        initialData
          ? "Package updated successfully"
          : "Package created successfully"
      );
      router.push("/dashboard/admin/packages");
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const onSubmitForm = async (values: PackageFormValues) => {
    setIsSubmitting(true);
    try {
      packageMutation.mutate(values);
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Failed to submit form");
    }
  };

  // If loading authentication, show loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center p-8 font-primary">Loading...</div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="space-y-6 font-primary"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Package Name</FormLabel>
              <Input {...field} className="input" />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Description</FormLabel>
              <Textarea {...field} className="input" rows={4} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Duration (hours)</FormLabel>
                <Input type="number" {...field} className="input" min={1} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Price ($)</FormLabel>
                <Input
                  type="number"
                  {...field}
                  className="input"
                  min={0}
                  step={0.01}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">None</SelectItem>
                  {categories.map((category: { id: string; name: string }) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter a tag name"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    size="icon"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <MultiSelect
                  options={tagOptions}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select tags..."
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((tagId) => {
                    const tag = tagOptions.find((t) => t.value === tagId);
                    return tag ? (
                      <div
                        key={tagId}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        <span>{tag.label}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tagId)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Highlights</h3>
            <div className="flex mt-2">
              <Input
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="Add a highlight"
                className="mr-2"
              />
              <Button type="button" onClick={addHighlight}>
                Add
              </Button>
            </div>
            <div className="mt-2">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center mt-2">
                  <div className="bg-secondary p-2 rounded-md flex-1">
                    {highlight}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHighlight(index)}
                    className="ml-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Inclusions</h3>
            <div className="flex mt-2">
              <Input
                value={inclusionInput}
                onChange={(e) => setInclusionInput(e.target.value)}
                placeholder="Add an inclusion"
                className="mr-2"
              />
              <Button type="button" onClick={addInclusion}>
                Add
              </Button>
            </div>
            <div className="mt-2">
              {inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-center mt-2">
                  <div className="bg-secondary p-2 rounded-md flex-1">
                    {inclusion}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInclusion(index)}
                    className="ml-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Exclusions</h3>
            <div className="flex mt-2">
              <Input
                value={exclusionInput}
                onChange={(e) => setExclusionInput(e.target.value)}
                placeholder="Add an exclusion"
                className="mr-2"
              />
              <Button type="button" onClick={addExclusion}>
                Add
              </Button>
            </div>
            <div className="mt-2">
              {exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-center mt-2">
                  <div className="bg-secondary p-2 rounded-md flex-1">
                    {exclusion}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExclusion(index)}
                    className="ml-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Publish Package</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={() => router.push("/dashboard/admin/packages")}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting
              ? "Submitting..."
              : initialData
                ? "Update Package"
                : "Create Package"}
            {isSubmitting && (
              <span className="ml-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
