import { google } from "@/mocks/googleMock";
import { useEffect, useState } from "react";
import { AppSidebar } from "./components/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { CollectionPage } from "./components/collection/CollectionPage";
import { Toaster } from "./components/ui/sonner";
import { SquareDashedMousePointer } from "lucide-react";
import { CollectionPageSkeleton } from "./components/collection/CollectionPageSkeleton";
import { getIdFieldName } from "./lib/utils";
import type {
  Collection,
  SpreadSheetMetaData,
  Ticket,
  User,
} from "../../shared/types/Types";

function App() {
  const [loginUser, setLoginUser] = useState<User | null>(null);
  const [spreadSheetMetaData, setSpreadSheetMetaData] =
    useState<SpreadSheetMetaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [selectedSheetName, setSelectedSheetName] = useState<string | null>(
    null
  );
  const [collection, setCollection] = useState<Collection | null>(null);
  const createTicket = (newTicket: Ticket) => {
    if (!collection) return;

    setCollection((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        tickets: [...prev.tickets, newTicket],
      };
    });
  };

  const updateTicket = (updatedTicket: Ticket) => {
    if (!collection) return;
    const IdFieldName = getIdFieldName(collection.schema);

    if (!IdFieldName) return;
    const ticketId = updatedTicket[IdFieldName];

    setCollection((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        tickets: prev.tickets.map((ticket) => {
          return ticket[IdFieldName] === ticketId ? updatedTicket : ticket;
        }),
      };
    });
  };

  // ログインユーザー取得
  useEffect(() => {
    google.script.run
      .withSuccessHandler((res) => {
        setLoginUser(JSON.parse(res));
      })
      .withFailureHandler((error) => console.error(error))
      .getLoginUser();
  }, []);

  // メタデータ取得
  useEffect(() => {
    google.script.run
      .withSuccessHandler((res) => {
        setSpreadSheetMetaData(JSON.parse(res));
        setIsLoading(false);
      })
      .withFailureHandler((error) => {
        console.error(error);
        setIsLoading(false);
      })
      .getSpreadSheetMetaData();
  }, []);

  // コレクション取得
  useEffect(() => {
    if (!selectedSheetName) return;
    setIsCollectionLoading(true);

    google.script.run
      .withSuccessHandler((res) => {
        setCollection(JSON.parse(res));
        setIsCollectionLoading(false);
      })
      .withFailureHandler((error) => {
        console.error(error);
        setIsCollectionLoading(false);
      })
      .getCollection(selectedSheetName);
  }, [selectedSheetName]);

  return (
    <>
      <Toaster richColors position="bottom-center" />
      <SidebarProvider>
        <AppSidebar
          fileName={spreadSheetMetaData?.fileName}
          fileUrl={spreadSheetMetaData?.fileUrl}
          sheetNames={spreadSheetMetaData?.sheetNames}
          isLoading={isLoading}
          setSelectedSheetName={setSelectedSheetName}
          user={loginUser}
        />
        <SidebarInset>
          {!selectedSheetName ? (
            <div className="flex flex-col justify-center items-center gap-4 h-svh">
              <SquareDashedMousePointer size="150" className="text-gray-200" />
              <p className="text-2xl text-gray-400">
                コレクションを選択してください
              </p>
            </div>
          ) : isCollectionLoading ? (
            <CollectionPageSkeleton />
          ) : collection ? (
            <CollectionPage
              collection={collection}
              createTicket={createTicket}
              updateTicket={updateTicket}
            />
          ) : null}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default App;
