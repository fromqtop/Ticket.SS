import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Schema, Ticket } from "../../../../shared/types/Types";
import { getIdFieldName, isoToJpString } from "@/lib/utils";

type Props = {
  schema: Schema;
  tickets: Ticket[];
  setSelectedTicketId: React.Dispatch<React.SetStateAction<string | number>>;
};

export const TicketsTable = ({
  schema,
  tickets,
  setSelectedTicketId,
}: Props) => {
  const shownFields = schema.filter((field) => field.shownInTable);
  const idFieldName = getIdFieldName(schema);

  return (
    <Table>
      <TableHeader className="sticky top-0 bg-white">
        <TableRow>
          {shownFields.map((field) => (
            <TableHead key={field.fieldName}>{field.fieldName}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => {
          const idValue = ticket[idFieldName];

          return (
            <TableRow
              key={String(ticket[idFieldName])}
              onClick={() => {
                if (typeof idValue === "string" || typeof idValue === "number")
                  setSelectedTicketId(idValue);
              }}
              className="cursor-pointer"
            >
              {shownFields.map((field) => (
                <TableCell key={field.fieldName}>
                  {field.type === "date"
                    ? isoToJpString(ticket[field.fieldName])
                    : String(ticket[field.fieldName])}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
