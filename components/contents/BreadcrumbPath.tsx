"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function BreadcrumbPath() {
  const pathname = usePathname();
  const spStr = (str:string) => {
    return str
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  };
  
  const items = pathname.split('/').slice(1);
 
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div
            className="flex flex-rows justify-center items-center"
            key={index}
          >
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={`${item==='manages' ? '/dashboard' : item}`}>{spStr(`${item==='/dashboard' ? 'Admin' : item}`)}</BreadcrumbLink>
            </BreadcrumbItem>
            {index !== items.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </div>
        ))}
        {/* <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem> */}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
