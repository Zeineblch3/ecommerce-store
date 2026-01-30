export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header skeleton */}
      <div className="mb-12 text-center animate-pulse-fast">
        <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
      </div>

      {/* Grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse"
          >
            {/* Image skeleton */}
            <div className="h-64 bg-gray-200"></div>

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              {/* Badge skeleton */}
              <div className="h-5 bg-gray-200 rounded-full w-1/3"></div>

              {/* Title skeleton (2 lines) */}
              <div className="h-5 bg-gray-200 rounded"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>

              {/* Rating skeleton */}
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>

              {/* Price skeleton */}
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
