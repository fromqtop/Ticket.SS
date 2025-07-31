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
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Loader2Icon, X } from "lucide-react";
import { DynamicField } from "./DynamicField";
import {
  getCommentsFieldName,
  getIdFieldName,
  getTitleFieldName,
  isoToJpString,
} from "@/lib/utils";
import type {
  Schema,
  Ticket,
  TicketItemValue,
} from "../../../../shared/types/Types";
import CommentList from "./CommentList";

type Props = {
  ticket: Ticket;
  collectionName: string;
  schema: Schema;
  setSelectedTicketId: React.Dispatch<React.SetStateAction<string | number>>;
  updateTicket: (updatedTicket: Ticket) => void;
};

export const TicketDetailCard = ({
  ticket,
  collectionName,
  schema,
  setSelectedTicketId,
  updateTicket,
}: Props) => {
  const [draftTicket, setDraftTicket] = useState<Ticket>({ ...ticket });

  const idFieldName = getIdFieldName(schema);
  const ticketId = ticket[idFieldName];
  const titleFieldName = getTitleFieldName(schema);
  const commentsFieldName = getCommentsFieldName(schema);
  const [commentValue, setCommentValue] = useState<string>("");

  const isEditing = JSON.stringify(draftTicket) !== JSON.stringify(ticket);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setDraftTicket({ ...ticket });
    setCommentValue("");
  }, [ticket]);

  const updateDraftTicket = (fieldName: string, value: TicketItemValue) => {
    setDraftTicket({ ...draftTicket, [fieldName]: value });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const toastId = toast.loading("チケットを更新しています...");
    const newTicket = { ...draftTicket };

    google.script.run
      .withSuccessHandler((res) => {
        const updatedTicket = JSON.parse(res);
        updateTicket(updatedTicket);
        setCommentValue("");
        setIsSubmitting(false);
        toast.success("チケットを更新しました", { id: toastId });
      })
      .withFailureHandler((error) => {
        console.error(error);
        setIsSubmitting(false);
        toast.error("エラーが発生しました", { id: toastId });
      })
      .updateTicket(collectionName, JSON.stringify(newTicket), commentValue);
  };

  return (
    <Card className="w-[600px] h-dvh fixed top-0 right-0 gap-0 py-2">
      <CardHeader className="pb-3 border-b-1 border-gray-200">
        <CardDescription># {ticketId}</CardDescription>
        <CardTitle>
          {titleFieldName ? draftTicket[titleFieldName] : "（無題）"}
        </CardTitle>
        <CardAction>
          <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={() => setSelectedTicketId("")}
          >
            <X />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 overflow-auto pt-4 pb-15">
        {schema.map((field) => (
          <div
            key={field.fieldName}
            className={field.type === "comments" ? "order-last" : ""}
          >
            <label className="text-sm text-muted-foreground">
              {field.fieldName}
            </label>

            {field.type === "comments" ? (
              <CommentList
                commentsString={String(draftTicket[field.fieldName])}
              />
            ) : field.editable ? (
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
            ) : field.type === "date" ? (
              <div className="text-sm whitespace-pre-wrap">
                {isoToJpString(draftTicket[field.fieldName])}
              </div>
            ) : (
              <div className="text-sm whitespace-pre-wrap">
                {draftTicket[field.fieldName]}
              </div>
            )}
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-3  border-t-1 border-gray-200">
        {commentsFieldName && (
          <Textarea
            placeholder={`コメントを入力 ...`}
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
          />
        )}

        <Button
          className="w-[140px]"
          disabled={(!isEditing && !commentValue) || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {isEditing
            ? commentValue
              ? "コメントして更新"
              : "更新"
            : commentValue
            ? "コメント投稿"
            : "更新"}
        </Button>
      </CardFooter>
    </Card>
  );
};
