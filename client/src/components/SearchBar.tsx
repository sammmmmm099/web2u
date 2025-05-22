import { useState } from "react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (type: 'genre' | 'language' | 'status', value: string) => void;
  currentFilters: {
    genre?: string;
    language?: string;
    status?: string;
  };
}

export default function SearchBar({ onSearch, onFilterChange, currentFilters }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      onSearch("");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
    "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", 
    "Sports", "Supernatural"
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-grow">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search anime by title..."
              className="bg-card border-border rounded-lg pl-10 pr-4 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </form>
        <div className="flex flex-wrap gap-2">
          <Select
            value={currentFilters.genre}
            onValueChange={(value) => onFilterChange('genre', value)}
          >
            <SelectTrigger className="w-[110px] bg-card">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentFilters.language}
            onValueChange={(value) => onFilterChange('language', value)}
          >
            <SelectTrigger className="w-[110px] bg-card">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Languages</SelectItem>
              <SelectItem value="sub">Subbed</SelectItem>
              <SelectItem value="dub">Dubbed</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={currentFilters.status}
            onValueChange={(value) => onFilterChange('status', value)}
          >
            <SelectTrigger className="w-[110px] bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
