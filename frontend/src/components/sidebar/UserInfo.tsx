import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";

export function UserInfo({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  //const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 ml-1 mb-1">
          <Avatar className="h-8 w-8">
            <AvatarImage
              className="rounded-lg"
              src={user.avatar}
              alt={user.name}
            />
            <AvatarFallback>
              <div className="flex justify-center items-center h-8 w-8 bg-gray-300 rounded-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
