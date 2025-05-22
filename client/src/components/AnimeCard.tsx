import { useState } from "react";
import { Anime } from "@shared/schema";
import GenreBadge from "./GenreBadge";
import StatusBadge from "./StatusBadge";
import LanguageBadge from "./LanguageBadge";
import { FaTelegram } from "react-icons/fa";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface AnimeCardProps {
  anime: Anime;
  isCompact?: boolean;
  rankNumber?: number;
}

export default function AnimeCard({ anime, isCompact = false, rankNumber }: AnimeCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleTelegramRedirect = async () => {
    setIsLoading(true);
    try {
      // Increment view count before redirecting
      await apiRequest("POST", `/api/anime/${anime.id}/view`);
      // Invalidate trending cache
      queryClient.invalidateQueries({ queryKey: ["/api/anime/trending"] });
      // Open telegram link in new tab
      window.open(anime.telegramUrl, "_blank");
    } catch (error) {
      console.error("Failed to record view:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompact) {
    return (
      <div className="anime-card bg-card rounded-xl overflow-hidden">
        <div className="relative" onClick={handleTelegramRedirect}>
          <img 
            src={anime.posterUrl} 
            alt={anime.title} 
            className="w-full h-56 object-cover cursor-pointer"
          />
        </div>
        <div className="p-3">
          <h3 className="text-md font-nunito font-bold text-foreground mb-1 truncate">{anime.title}</h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {anime.genres.slice(0, 1).map((genre) => (
              <GenreBadge key={genre} genre={genre} small />
            ))}
            <LanguageBadge language={anime.language} small />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="anime-card bg-card rounded-xl overflow-hidden">
      <div className="relative">
        <img 
          src={anime.posterUrl} 
          alt={anime.title} 
          className="w-full h-64 object-cover"
        />
        {rankNumber !== undefined && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
            <span className="mr-1">#</span>{rankNumber}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-nunito font-bold text-foreground mb-2 truncate">{anime.title}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {anime.genres.slice(0, 2).map((genre) => (
            <GenreBadge key={genre} genre={genre} />
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <StatusBadge status={anime.status} />
          <LanguageBadge language={anime.language} />
        </div>
        <button 
          onClick={handleTelegramRedirect}
          disabled={isLoading}
          className="mt-4 bg-secondary hover:bg-muted text-foreground text-center py-2 px-4 rounded-lg block transition duration-300 w-full flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-b-2 border-primary rounded-full mr-2"></div>
          ) : (
            <FaTelegram className="mr-2" />
          )}
          Watch Now
        </button>
      </div>
    </div>
  );
}
