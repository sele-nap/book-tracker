function Bone({ className }: { className?: string }) {
  return (
    <div className={`bg-mist/20 rounded-lg animate-pulse ${className ?? ''}`} />
  );
}

export function LibrarySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="bg-dusk border border-mist/20 rounded-xl overflow-hidden"
        >
          <Bone className="h-40 rounded-none" />
          <div className="p-4 space-y-2">
            <Bone className="h-3 w-16" />
            <Bone className="h-4 w-full" />
            <Bone className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-dusk border border-mist/20 rounded-xl p-5 flex gap-4"
        >
          <Bone className="w-14 h-20 shrink-0" />
          <div className="flex-1 space-y-2">
            <Bone className="h-4 w-3/4" />
            <Bone className="h-3 w-1/2" />
            <Bone className="h-2 w-full mt-4" />
            <Bone className="h-8 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ShelvesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-dusk border border-mist/20 rounded-xl p-5 space-y-4"
        >
          <div className="space-y-2">
            <Bone className="h-5 w-32" />
            <Bone className="h-3 w-48" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <Bone key={j} className="w-14 h-20 shrink-0" />
            ))}
          </div>
          <div className="flex justify-between">
            <Bone className="h-3 w-16" />
            <Bone className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChallengesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="bg-dusk border border-mist/20 rounded-xl p-5 space-y-4"
        >
          <div className="space-y-2">
            <Bone className="h-5 w-24" />
            <Bone className="h-3 w-40" />
          </div>
          <Bone className="h-2 w-full" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <Bone key={j} className="w-14 h-20" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-dusk border border-mist/20 rounded-xl p-5 space-y-2"
          >
            <Bone className="h-3 w-16" />
            <Bone className="h-8 w-12" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Bone className="h-64 rounded-xl" />
        <Bone className="h-64 rounded-xl" />
        <Bone className="h-64 rounded-xl lg:col-span-2" />
      </div>
    </div>
  );
}
