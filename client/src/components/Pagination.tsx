import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Calculate range of pages to show
  const showPages = [];
  const range = 2; // Show 2 pages on either side of current page

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // First page
      i === totalPages || // Last page
      (i >= currentPage - range && i <= currentPage + range) // Pages around current
    ) {
      showPages.push(i);
    } else if (
      (i === currentPage - range - 1 && i > 1) || // Show ellipsis before
      (i === currentPage + range + 1 && i < totalPages) // Show ellipsis after
    ) {
      showPages.push(-1); // -1 represents ellipsis
    }
  }

  // Remove duplicates (especially ellipsis)
  const uniqueShowPages = showPages.filter(
    (page, index, self) => page === -1 ? self.indexOf(page) === index : true
  );

  return (
    <div className="mt-8 flex justify-center">
      <nav className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-l-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {uniqueShowPages.map((page, idx) => {
          if (page === -1) {
            return (
              <div key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-muted-foreground">
                ...
              </div>
            );
          }
          
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              className="w-10 h-10"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-r-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
}
