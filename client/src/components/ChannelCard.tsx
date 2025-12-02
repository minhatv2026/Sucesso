import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tv } from "lucide-react";

interface ChannelCardProps {
  id: number;
  name: string;
  icon?: string;
  quality?: string;
  onClick?: () => void;
}

export default function ChannelCard({
  id,
  name,
  icon,
  quality,
  onClick
}: ChannelCardProps) {
  return (
    <Card 
      className="group cursor-pointer transition-all hover:scale-105 hover:shadow-lg bg-card"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
            {icon ? (
              <img
                src={icon}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Tv className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{name}</h3>
            {quality && (
              <Badge variant="secondary" className="text-xs">
                {quality}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
