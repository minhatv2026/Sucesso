import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Play } from "lucide-react";
import { Button } from "./ui/button";

interface ContentCardProps {
  id: number;
  title: string;
  posterUrl?: string;
  year?: number;
  imdbRating?: number;
  genres?: string[];
  onClick?: () => void;
}

export default function ContentCard({
  id,
  title,
  posterUrl,
  year,
  imdbRating,
  genres,
  onClick
}: ContentCardProps) {
  const genreList = typeof genres === "string" ? JSON.parse(genres) : genres || [];
  const rating = imdbRating ? imdbRating / 10 : null;

  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-card"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Play className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="lg" className="gap-2">
            <Play className="h-5 w-5" />
            Assistir
          </Button>
        </div>

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-2 right-2 bg-black/80 rounded-md px-2 py-1 flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm font-semibold">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{title}</h3>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          {year && <span>{year}</span>}
        </div>

        <div className="flex flex-wrap gap-1">
          {genreList.slice(0, 2).map((genre: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
