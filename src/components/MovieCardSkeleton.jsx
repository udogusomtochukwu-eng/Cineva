function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 bg-noir-card rounded-xl h-full overflow-hidden">
      <div className="relative bg-noir-elevated w-full aspect-square animate-pulse" />

      <div className="flex flex-col gap-2 p-3">
        <div className="bg-noir-elevated rounded w-full h-5 animate-pulse" />
        <div className="bg-noir-elevated rounded w-3/4 h-5 animate-pulse" />
        <div className="flex justify-between mt-1">
          <div className="bg-noir-elevated rounded w-10 h-4 animate-pulse" />
          <div className="bg-noir-elevated rounded w-12 h-4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
export default MovieCardSkeleton;
