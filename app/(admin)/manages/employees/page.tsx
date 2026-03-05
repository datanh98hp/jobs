import { FormUser } from "@/components/contents/Employee/FormCreateEmployee";
import ListEmployee, { LoadingTable } from "@/components/contents/Employee/ListEmployee";


import { Suspense } from "react";

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        Page User Management
        <Counter />
      </div> */}
      {/* <div className="bg-muted/50 md:flex rounded-xl md:min-h-min w-full">
        <CardInf />
      </div> */}
      <div className="md:grid grid-cols-4 gap-3">
        <FormUser />
        <div className="col-span-3">
          <Suspense fallback={<LoadingTable />}>
            <ListEmployee />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
