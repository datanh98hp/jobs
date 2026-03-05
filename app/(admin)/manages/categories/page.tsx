import { FormAddCategory } from "@/components/contents/Categories/FormAddCategory";
import ListCategory from "@/components/contents/Categories/ListCategory";

import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="bg-muted/50 min-h-screen rounded-xl md:min-h-min">
        <div className="md:grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Suspense fallback={<Spinner />}>
              <ListCategory />
            </Suspense>
          </div>
          <div className="col-span-1 p-4 border-l">
            <FormAddCategory />
          </div>
        </div>
      </div>
    </div>
  );
}
