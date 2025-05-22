import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import TelegramButton from "./TelegramButton";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface NavbarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Navbar({ isAuthenticated, isAdmin, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary text-2xl font-nunito font-bold">Animes2u</span>
              <span className="ml-2 text-white text-sm font-nunito">Community</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-primary text-foreground px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/?filter=trending" className="border-transparent text-muted-foreground hover:border-primary-400 hover:text-foreground px-1 pt-1 border-b-2 text-sm font-medium">
                Trending
              </Link>
              <Link href="/?filter=recent" className="border-transparent text-muted-foreground hover:border-primary-400 hover:text-foreground px-1 pt-1 border-b-2 text-sm font-medium">
                Recently Added
              </Link>
              <Link href="/?section=all" className="border-transparent text-muted-foreground hover:border-primary-400 hover:text-foreground px-1 pt-1 border-b-2 text-sm font-medium">
                All Anime
              </Link>
              {isAdmin && (
                <Link href="/admin" className="border-transparent text-muted-foreground hover:border-primary-400 hover:text-foreground px-1 pt-1 border-b-2 text-sm font-medium">
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <TelegramButton text="Join Telegram" />
            </div>
            {isAuthenticated ? (
              <Button onClick={onLogout} variant="outline" size="sm">
                Logout
              </Button>
            ) : (
              <Link href="/admin/login">
                <Button variant="outline" size="sm">
                  Admin Login
                </Button>
              </Link>
            )}
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="sm:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="pt-2 pb-3 space-y-1 mt-6">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Home</Button>
                  </Link>
                  <Link href="/?filter=trending" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Trending</Button>
                  </Link>
                  <Link href="/?filter=recent" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Recently Added</Button>
                  </Link>
                  <Link href="/?section=all" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">All Anime</Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">Admin</Button>
                    </Link>
                  )}
                  <div className="mt-4">
                    <TelegramButton text="Join Telegram" fullWidth />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
