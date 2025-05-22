interface GenreBadgeProps {
  genre: string;
  small?: boolean;
}

export default function GenreBadge({ genre, small = false }: GenreBadgeProps) {
  const baseClasses = 
    "bg-opacity-20 text-primary-300 border border-primary-700 rounded-full inline-block";
  
  const sizeClasses = small 
    ? "text-xs px-2 py-0.5" 
    : "text-xs px-2 py-1";
  
  return (
    <span className={`${baseClasses} ${sizeClasses} bg-primary`}>
      {genre}
    </span>
  );
}
