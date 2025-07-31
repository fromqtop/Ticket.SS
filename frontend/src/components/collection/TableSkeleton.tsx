import { Skeleton } from "../ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="w-4/5">
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 10 }).map((_, ri) => (
          <>
            <div key={ri} className="flex gap-8">
              {Array.from({ length: 5 }).map((_, ci) => (
                <Skeleton key={`${ri}-${ci}`} className="w-1/5 h-5" />
              ))}
            </div>
            {ri < 9 && <Skeleton className="w-full h-0.5" />}
          </>
        ))}
      </div>
    </div>
  );
}
