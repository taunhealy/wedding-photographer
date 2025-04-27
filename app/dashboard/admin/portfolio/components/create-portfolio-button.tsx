"use client";

import { Button } from "@/app/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreatePortfolioButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.push("/dashboard/admin/portfolio/new")}>
      <PlusIcon className="mr-2 h-4 w-4" />
      Add Portfolio Item
    </Button>
  );
}
