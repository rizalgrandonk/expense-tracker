import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserAvatar({
  name,
  picture,
  className,
}: {
  name: string;
  picture?: string;
  className?: string;
}) {
  const initials = (name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <Avatar className={cn("h-9 w-9", className)}>
      {picture ? <AvatarImage src={picture} alt={name} /> : null}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
