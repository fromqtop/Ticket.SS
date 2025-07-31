import { Skeleton } from "../ui/skeleton";
import { TableSkeleton } from "./TableSkeleton";

export const CollectionPageSkeleton = () => {
  return (
    <div className="container mx-auto px-7 py-10 flex flex-col gap-5">
      <Skeleton className="h-7 w-50" />
      <div className="flex items-center gap-5 mb-4">
        <Skeleton className="h-8 w-70" />
        <Skeleton className="h-8 w-30" />
        <Skeleton className="h-8 w-30" />
      </div>
      <TableSkeleton />
    </div>
  );
};
