import { Skeleton } from "@/components/ui/skeleton";

export default function OrgSettingsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <Skeleton className="mt-2 h-5 w-64" />
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <div className="inline-flex gap-2 rounded-md border bg-muted/20 p-1">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      <div className="rounded-lg border">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-4 ${i > 1 ? "border-t" : ""}`}
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <Skeleton className="h-8 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
