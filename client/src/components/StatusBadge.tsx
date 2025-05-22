interface StatusBadgeProps {
  status: string;
  small?: boolean;
}

export default function StatusBadge({ status, small = false }: StatusBadgeProps) {
  const isOngoing = status === "ongoing";
  
  const baseClasses = "rounded-full inline-block";
  const sizeClasses = small ? "text-xs px-2 py-0.5" : "text-xs px-2 py-1";
  
  const colorClasses = isOngoing
    ? "bg-green-900 bg-opacity-20 text-green-300 border border-green-700"
    : "bg-pink-900 bg-opacity-20 text-pink-300 border border-pink-700";
  
  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses}`}>
      {status === "ongoing" ? "Ongoing" : "Completed"}
    </span>
  );
}
