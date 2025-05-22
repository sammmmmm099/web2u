import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FaTelegram, FaDiscord, FaTwitter, FaInstagram } from "react-icons/fa";
import GenreBadge from "./GenreBadge";

export default function Footer() {
  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy",
    "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life",
    "Sports", "Supernatural"
  ];

  return (
    <footer className="bg-card pt-10 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-primary text-2xl font-nunito font-bold">Animes2u</span>
              <span className="ml-2 text-foreground text-sm font-nunito">Community</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Your favorite place to discover and enjoy anime with fellow fans. Join our community today!
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://t.me/animes2u" target="_blank" rel="noopener noreferrer">
                  <FaTelegram className="h-5 w-5" />
                  <span className="sr-only">Telegram</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FaDiscord className="h-5 w-5" />
                  <span className="sr-only">Discord</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-foreground font-nunito font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary-400">Home</Link></li>
              <li><Link href="/?filter=trending" className="text-muted-foreground hover:text-primary-400">Trending Anime</Link></li>
              <li><Link href="/?filter=recent" className="text-muted-foreground hover:text-primary-400">Recently Added</Link></li>
              <li><Link href="/?section=all" className="text-muted-foreground hover:text-primary-400">All Anime</Link></li>
              <li><Link href="/#" className="text-muted-foreground hover:text-primary-400">Request Anime</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-foreground font-nunito font-bold text-lg mb-4">Popular Genres</h4>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Link key={genre} href={`/?genre=${genre.toLowerCase()}`}>
                  <GenreBadge genre={genre} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-6">
          <p className="text-muted-foreground text-center text-sm">
            © {new Date().getFullYear()} Animes2u Community. All rights reserved. We do not store any media content.
          </p>
        </div>
      </div>
    </footer>
  );
}
