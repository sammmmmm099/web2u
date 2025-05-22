import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Anime } from "@shared/schema";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import AnimeCard from "@/components/AnimeCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import TelegramButton from "@/components/TelegramButton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "wouter";

export default function HomePage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{genre?: string; language?: string; status?: string}>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("alphabetical");
  const itemsPerPage = 10;

  // Parse URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('genre')) setFilters(f => ({...f, genre: params.get('genre')!}));
    if (params.has('language')) setFilters(f => ({...f, language: params.get('language')!}));
    if (params.has('status')) setFilters(f => ({...f, status: params.get('status')!}));
    if (params.has('search')) setSearchQuery(params.get('search')!);
    if (params.has('page')) setCurrentPage(parseInt(params.get('page')!));
  }, [location]);

  // Fetch recommended anime
  const { data: recommendedAnime = [] } = useQuery<Anime[]>({
    queryKey: ["/api/anime/recommended"],
  });

  // Fetch trending anime
  const { data: trendingAnime = [] } = useQuery<Anime[]>({
    queryKey: ["/api/anime/trending"],
  });

  // Fetch recently added anime
  const { data: recentAnime = [] } = useQuery<Anime[]>({
    queryKey: ["/api/anime/recent"],
  });

  // Fetch all anime with search and filters
  const { data: allAnime = [], isLoading } = useQuery<Anime[]>({
    queryKey: ["/api/anime", searchQuery, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (filters.genre) params.append("genre", filters.genre);
      if (filters.language) params.append("language", filters.language);
      if (filters.status) params.append("status", filters.status);
      
      const response = await fetch(`/api/anime?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch anime");
      return response.json();
    },
  });

  // Apply sorting
  const sortedAnime = [...allAnime].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "reverse-alphabetical":
        return b.title.localeCompare(a.title);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "popularity":
        return b.views - a.views;
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedAnime.length / itemsPerPage);
  const paginatedAnime = sortedAnime.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateUrlParams({ search: query });
  };

  const handleFilterChange = (type: 'genre' | 'language' | 'status', value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setCurrentPage(1);
    updateUrlParams({ [type]: value });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams({ page: page.toString() });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateUrlParams = (params: Record<string, string>) => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Update or remove parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlParams.set(key, value);
      } else {
        urlParams.delete(key);
      }
    });
    
    // Set the new URL
    const newUrl = urlParams.toString() ? `/?${urlParams.toString()}` : '/';
    setLocation(newUrl);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchBar 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />
      
      {/* Featured Carousel */}
      {!searchQuery && Object.keys(filters).length === 0 && (
        <FeaturedCarousel anime={recommendedAnime} />
      )}
      
      {/* Trending Anime Section */}
      {!searchQuery && Object.keys(filters).length === 0 && (
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-nunito font-bold text-foreground">Trending Anime</h2>
            <a 
              href="/?filter=trending" 
              className="text-primary hover:text-primary-400 text-sm font-medium"
            >
              View All <span aria-hidden="true">→</span>
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingAnime.slice(0, 4).map((anime, index) => (
              <AnimeCard 
                key={anime.id} 
                anime={anime} 
                rankNumber={index + 1}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Recently Added Section */}
      {!searchQuery && Object.keys(filters).length === 0 && (
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-nunito font-bold text-foreground">Recently Added</h2>
            <a 
              href="/?filter=recent" 
              className="text-primary hover:text-primary-400 text-sm font-medium"
            >
              View All <span aria-hidden="true">→</span>
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recentAnime.slice(0, 5).map((anime) => (
              <AnimeCard 
                key={anime.id} 
                anime={anime} 
                isCompact={true}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* All Anime Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-nunito font-bold text-foreground">
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : Object.keys(filters).length > 0 
                ? 'Filtered Results' 
                : 'All Anime'
            }
          </h2>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-2 hidden sm:block">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">A-Z</SelectItem>
                <SelectItem value="reverse-alphabetical">Z-A</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : paginatedAnime.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginatedAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-nunito mb-4">No anime found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            {(searchQuery || Object.keys(filters).length > 0) && (
              <a href="/" className="text-primary hover:underline">
                Clear all filters
              </a>
            )}
          </div>
        )}
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>
      
      {/* Telegram Banner */}
      <div className="bg-primary bg-opacity-10 py-6 mt-10 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-nunito font-bold text-foreground">Join Our Telegram Community</h3>
              <p className="text-primary-200">Get instant updates, early access, and discuss with other fans!</p>
            </div>
            <TelegramButton text="Join Telegram Channel" />
          </div>
        </div>
      </div>
      
      {/* Floating Telegram Button (Mobile Only) */}
      <div className="fixed bottom-6 right-6 sm:hidden z-50">
        <TelegramButton text="" />
      </div>
    </main>
  );
}
