import { getPortfolioItems } from "@/lib/types/portfolio";
import { DataTable } from "@/app/components/ui/data-table";
import { portfolioColumns } from "./portfolio-columns";

export async function PortfolioList() {
  const portfolioItems = await getPortfolioItems();

  return (
    <div>
      <DataTable
        columns={portfolioColumns}
        data={portfolioItems}
        searchKey="title"
      />
    </div>
  );
}
