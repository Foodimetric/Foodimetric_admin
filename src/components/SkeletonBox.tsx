export const SkeletonBox = ({ height = "h-32" }: { height?: string }) => (
  <div className={`bg-gray-200 rounded-md animate-pulse ${height}`}></div>
);
