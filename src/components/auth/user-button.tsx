import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import UserAvatar from "../user-avatar";

export function UserButton() {
  const { user, handleLogout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full cursor-pointer"
        >
          <UserAvatar name={user?.name || ""} picture={user?.picture} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="p-2">
          <p className="text-sm font-medium">{user?.name}</p>
          {user?.email ? (
            <p className="text-xs text-muted-foreground">{user.email}</p>
          ) : null}
        </div>
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
