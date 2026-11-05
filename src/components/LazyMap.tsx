import { lazy, Suspense, type ComponentProps } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Skeleton } from "./kit";

const FieldMap = lazy(() => import("./FieldMap"));

export function LazyMap(props: ComponentProps<typeof FieldMap>) {
  const fb = <Skeleton className="w-full" />;
  return (
    <div style={{ height: props.height ?? 280 }}>
      <ClientOnly fallback={<Skeleton className="h-full w-full" />}>
        <Suspense fallback={fb}>
          <FieldMap {...props} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
