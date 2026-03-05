import { OverviewProductCard } from "@/components/contents/Products/OverviewProduct";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default async function Page() {
  return (
    <div className="bg-muted/50 rounded-xl md:min-h-min w-full border">
      <Suspense fallback={<Spinner />}>
        <OverviewProductCard />
      </Suspense>
    </div>
  );
}
