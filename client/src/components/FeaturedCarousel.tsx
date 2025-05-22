import { useEffect, useRef } from "react";
import { Anime } from "@shared/schema";
import Swiper from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import GenreBadge from "./GenreBadge";
import StatusBadge from "./StatusBadge";
import LanguageBadge from "./LanguageBadge";
import { FaTelegram } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface FeaturedCarouselProps {
  anime: Anime[];
}

export default function FeaturedCarousel({ anime }: FeaturedCarouselProps) {
  const swiperRef = useRef<Swiper | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (anime.length === 0) return;

    swiperRef.current = new Swiper(".featured-swiper", {
      modules: [Navigation, Autoplay],
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
      navigation: {
        prevEl: prevButtonRef.current,
        nextEl: nextButtonRef.current,
      },
    });

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy();
        swiperRef.current = null;
      }
    };
  }, [anime]);

  const handleTelegramRedirect = async (animeId: number, telegramUrl: string) => {
    try {
      // Increment view count before redirecting
      await apiRequest("POST", `/api/anime/${animeId}/view`);
      // Invalidate trending cache
      queryClient.invalidateQueries({ queryKey: ["/api/anime/trending"] });
      // Open telegram link in new tab
      window.open(telegramUrl, "_blank");
    } catch (error) {
      console.error("Failed to record view:", error);
    }
  };

  if (anime.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-nunito font-bold text-foreground">Recommended Anime</h2>
        <div className="flex space-x-2">
          <Button
            ref={prevButtonRef}
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            ref={nextButtonRef}
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      </div>
      
      <div className="swiper featured-swiper">
        <div className="swiper-wrapper">
          {anime.map((item) => (
            <div
              key={item.id}
              className="swiper-slide"
              style={{ backgroundImage: `url(${item.posterUrl})` }}
            >
              <div className="swiper-slide-content">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-nunito font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.genres.slice(0, 2).map((genre) => (
                      <GenreBadge key={genre} genre={genre} />
                    ))}
                    <StatusBadge status={item.status} />
                    <LanguageBadge language={item.language} />
                  </div>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <Button 
                    onClick={() => handleTelegramRedirect(item.id, item.telegramUrl)}
                    className="bg-primary hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg inline-flex items-center justify-center w-full sm:w-auto"
                  >
                    <FaTelegram className="mr-2" />
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
