import { google } from "@/mocks/googleMock";
import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Loader2Icon, X } from "lucide-react";
import { DynamicField } from "./DynamicField";
import { getIdFieldName, getTitleFieldName } from "@/lib/utils";
import type {
  Schema,
  Ticket,
  TicketItemValue,
} from "../../../../shared/types/Types";

type Props = {
  ticket: Ticket;
  collectionName: string;
  schema: Schema;
  setCreatingTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
  createTicket: (newTicket: Ticket) => void;
};

export const TicketCreateCard = ({
  ticket,
  collectionName,
  schema,
  createTicket,
  setCreatingTicket,
}: Props) => {
  const [draftTicket, setDraftTicket] = useState<Ticket>({ ...ticket });
  const isEditing = JSON.stringify(draftTicket) !== JSON.stringify(ticket);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const idFieldName = getIdFieldName(schema);
  const titleFieldName = getTitleFieldName(schema);

  useEffect(() => {
    setDraftTicket({ ...ticket });
  }, [ticket]);

  const updateDraftTicket = (fieldName: string, value: TicketItemValue) => {
    setDraftTicket({ ...draftTicket, [fieldName]: value });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const toastId = toast.loading("チケットを作成しています...");
    const newTicket = { ...draftTicket };

    google.script.run
      .withSuccessHandler((res) => {
        const newTicket = JSON.parse(res);
        createTicket(newTicket);
        setCreatingTicket(null);
        setIsSubmitting(false);
        toast.success("チケットを作成しました", { id: toastId });
      })
      .withFailureHandler((error) => {
        console.error(error);
        setCreatingTicket(null);
        setIsSubmitting(false);
        toast.error("エラーが発生しました", { id: toastId });
      })
      .createTicket(collectionName, JSON.stringify(newTicket));
  };

  return (
    <Card className="w-[600px] h-dvh fixed top-0 right-0 gap-0 py-2">
      <CardHeader className="pb-3 border-b-1 border-gray-200">
        <CardDescription># 新規チケット</CardDescription>
        <CardTitle>
          {titleFieldName ? draftTicket[titleFieldName] : "（無題）"}
        </CardTitle>
        <CardAction>
          <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={() => setCreatingTicket(null)}
          >
            <X />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 overflow-auto pt-4 pb-15">
        {schema.map((field) => (
          <div key={field.fieldName}>
            <label className="text-sm text-muted-foreground">
              {field.fieldName}
            </label>

            {field.fieldName === idFieldName ? (
              <div className="text-sm whitespace-pre-wrap">（自動採番）</div>
            ) : (
              <DynamicField
                fieldName={field.fieldName}
                value={draftTicket[field.fieldName]}
                type={field.type}
                options={field.options}
                updateDraftTicket={updateDraftTicket}
                isEditing={
                  ticket[field.fieldName] !== draftTicket[field.fieldName]
                }
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-3  border-t-1 border-gray-200">
        <Button
          className="w-[140px]"
          disabled={!isEditing || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          登録
        </Button>
      </CardFooter>
    </Card>
  );
};
