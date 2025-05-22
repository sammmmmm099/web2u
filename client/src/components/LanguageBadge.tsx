interface LanguageBadgeProps {
  language: string;
  small?: boolean;
}

export default function LanguageBadge({ language, small = false }: LanguageBadgeProps) {
  const baseClasses = "rounded-full inline-block";
  const sizeClasses = small ? "text-xs px-2 py-0.5" : "text-xs px-2 py-1";
  
  let colorClasses = "";
  let label = "";
  
  switch (language) {
    case "sub":
      colorClasses = "bg-blue-900 bg-opacity-20 text-blue-300 border border-blue-700";
      label = "Sub";
      break;
    case "dub":
      colorClasses = "bg-orange-900 bg-opacity-20 text-orange-300 border border-orange-700";
      label = "Dub";
      break;
    case "both":
      colorClasses = "bg-purple-900 bg-opacity-20 text-purple-300 border border-purple-700";
      label = "Sub/Dub";
      break;
    default:
      colorClasses = "bg-gray-900 bg-opacity-20 text-gray-300 border border-gray-700";
      label = language;
  }
  
  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses}`}>
      {label}
    </span>
  );
}
