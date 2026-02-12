import { Skeleton } from '@/components/atoms/Skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-4 h-4 w-2/3" />
    </div>
  );
}
