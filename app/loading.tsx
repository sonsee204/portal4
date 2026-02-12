export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-1/3 animate-pulse rounded bg-gray-200" />
      <div className="mt-4 h-4 w-full animate-pulse rounded bg-gray-200" />
      <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
    </div>
  );
}
