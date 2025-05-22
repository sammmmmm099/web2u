import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Anime } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Edit, Plus, Trash2 } from "lucide-react";
import GenreBadge from "@/components/GenreBadge";
import StatusBadge from "@/components/StatusBadge";
import LanguageBadge from "@/components/LanguageBadge";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Fetch all anime
  const { data: allAnime = [], isLoading } = useQuery<Anime[]>({
    queryKey: ["/api/anime"],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/anime/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/anime"] });
      toast({
        title: "Anime Deleted",
        description: "The anime has been successfully deleted.",
      });
      setIsConfirmOpen(false);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the anime.",
        variant: "destructive",
      });
    },
  });

  // Filter anime by search query
  const filteredAnime = allAnime.filter(anime => 
    anime.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => navigate("/admin/anime/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Anime
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search anime..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredAnime.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Genres</TableHead>
                <TableHead className="hidden md:table-cell">Episodes</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Language</TableHead>
                <TableHead className="hidden md:table-cell">Recommended</TableHead>
                <TableHead className="hidden md:table-cell">Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnime.map((anime) => (
                <TableRow key={anime.id}>
                  <TableCell className="font-medium">{anime.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={anime.posterUrl} 
                        alt={anime.title}
                        className="h-10 w-8 object-cover rounded-sm hidden sm:block"
                      />
                      <span className="font-medium truncate max-w-[200px]">
                        {anime.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {anime.genres.slice(0, 2).map((genre) => (
                        <GenreBadge key={genre} genre={genre} small />
                      ))}
                      {anime.genres.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{anime.genres.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {anime.episodes}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <StatusBadge status={anime.status} small />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <LanguageBadge language={anime.language} small />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {anime.isRecommended ? (
                      <span className="text-green-500">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {anime.views}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/admin/anime/${anime.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteClick(anime.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-nunito mb-4">No anime found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? 'Try a different search term' : 'Add your first anime to get started'}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this anime? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
