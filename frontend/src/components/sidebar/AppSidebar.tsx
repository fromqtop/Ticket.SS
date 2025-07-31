import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { UserInfo } from "./UserInfo";
import { File, FileSpreadsheet } from "lucide-react";
import type { User } from "../../../../shared/types/Types";

type Props = {
  fileName: string | undefined;
  fileUrl: string | undefined;
  sheetNames: string[] | undefined;
  isLoading: boolean;
  setSelectedSheetName: React.Dispatch<React.SetStateAction<string | null>>;
  user: User | null;
};

export function AppSidebar({
  fileName,
  fileUrl,
  sheetNames,
  isLoading,
  setSelectedSheetName,
  user,
}: Props) {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          {/* タイトル・スプレッドシートリンク */}
          <SidebarMenuItem>
            <div className="px-2 py-1 font-medium text-2xl">Ticket.ss</div>
            {isLoading ? (
              <Skeleton className="h-[20px] w-[150px] m-1" />
            ) : fileName && fileUrl ? (
              <SidebarMenuButton asChild>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  <File />
                  <span>{fileName}</span>
                </a>
              </SidebarMenuButton>
            ) : (
              <div>データが取得できませんでした</div>
            )}
          </SidebarMenuItem>
          <SidebarSeparator className="my-3" />

          {/* 検索フォーム */}
          {/* <SidebarMenuItem>
            <SearchForm />
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarHeader>

      {/* シート一覧 */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <div>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[20px] w-[150px] m-2" />
                  ))}
                </div>
              ) : sheetNames ? (
                <div>
                  {sheetNames.map((sheetName) => (
                    <SidebarMenuItem key={sheetName}>
                      <SidebarMenuButton
                        className="cursor-pointer"
                        onClick={() => setSelectedSheetName(sheetName)}
                      >
                        <FileSpreadsheet />
                        <span>{sheetName}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              ) : (
                <div>データが取得できませんでした</div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ログインユーザー情報 */}
      <SidebarFooter>
        {user ? <UserInfo user={user} /> : <div>Loading...</div>}
      </SidebarFooter>
    </Sidebar>
  );
}
