import { Button } from "@/components/ui/button";
import { FaTelegram } from "react-icons/fa";

interface TelegramButtonProps {
  text: string;
  fullWidth?: boolean;
}

export default function TelegramButton({ text, fullWidth = false }: TelegramButtonProps) {
  return (
    <Button 
      className={`bg-primary hover:bg-primary-700 text-white telegram-btn ${fullWidth ? 'w-full' : ''}`}
      asChild
    >
      <a href="https://t.me/animes2u" target="_blank" rel="noopener noreferrer">
        <FaTelegram className="mr-2" />
        {text}
      </a>
    </Button>
  );
}
