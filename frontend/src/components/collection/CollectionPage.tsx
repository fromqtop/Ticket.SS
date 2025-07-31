import { useEffect, useState, useMemo } from "react";
import type { Collection } from "../../../../shared/types/Types";
import type { Ticket } from "../../../../shared/types/Types";
import { TicketDetailCard } from "./TicketDetailCard";
import { TicketFilterDropdowns } from "./TicketFilterDropdowns";
import { TicketsTable } from "./TicketsTable";
import { getIdFieldName } from "../../lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { TicketCreateCard } from "./TicketCreateCard";
import { useTextFilter } from "@/hooks/useTextFilter";
import { useTicketFilterDropdowns } from "../../hooks/useTicketFilterDropdowns";

type Props = {
  collection: Collection;
  createTicket: (newTicket: Ticket) => void;
  updateTicket: (updatedTicket: Ticket) => void;
};

export const CollectionPage = ({
  collection,
  createTicket,
  updateTicket,
}: Props) => {
  const { name, schema, tickets } = collection;
  const idFieldName = getIdFieldName(schema);

  const [creatingTicket, setCreatingTicket] = useState<Ticket | null>(null);
  const initialValues = {
    text: "",
    textarea: "",
    select: "",
    date: "",
    comments: "",
  };
  const initialTicket = Object.fromEntries(
    schema.map((field) => [field.fieldName, initialValues[field.type] ?? ""])
  );

  const [selectedTicketId, setSelectedTicketId] = useState<string | number>("");
  const selectedTicket = tickets.find(
    (ticket) => ticket[idFieldName] && ticket[idFieldName] === selectedTicketId
  );

  const {
    dropdownfilters,
    setDropdownFilters,
    isDropdownFilterActive,
    isDropdownFilterMatch,
    clearDropdownFilters,
  } = useTicketFilterDropdowns(schema);

  const {
    textFilterValue,
    setTextFilterValue,
    isTextFilterActive,
    isTextFilterMatch,
    clearTextFilter,
  } = useTextFilter();

  const isFiltered = isTextFilterActive || isDropdownFilterActive;

  const clearAllFilters = () => {
    clearTextFilter();
    clearDropdownFilters();
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(
      (ticket) =>
        dropdownfilters.every((ddFilter) =>
          isDropdownFilterMatch(ticket, ddFilter)
        ) && isTextFilterMatch(ticket, textFilterValue)
    );
  }, [tickets, dropdownfilters, textFilterValue]);

  useEffect(() => {
    setCreatingTicket(null);
    setSelectedTicketId("");
    clearTextFilter();
    clearDropdownFilters();
  }, [name]);

  return (
    <div className="container mx-auto px-7 py-10 flex flex-col gap-5 overflow-auto max-h-svh">
      <h2 className="text-xl font-bold">{name}</h2>

      <div className="flex justify-between">
        <div className="flex items-center gap-5">
          <Input
            value={textFilterValue}
            onChange={(e) => setTextFilterValue(e.target.value)}
            placeholder="キーワードで絞り込む"
            className="w-70"
          />

          <TicketFilterDropdowns
            filters={dropdownfilters}
            setFilters={setDropdownFilters}
          />

          {isFiltered && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X />
              リセット
            </Button>
          )}
        </div>
        <Button onClick={() => setCreatingTicket(initialTicket)}>
          新規登録
        </Button>
      </div>

      <TicketsTable
        schema={schema}
        tickets={filteredTickets}
        setSelectedTicketId={setSelectedTicketId}
      />

      {selectedTicket && (
        <TicketDetailCard
          ticket={selectedTicket}
          collectionName={name}
          schema={schema}
          setSelectedTicketId={setSelectedTicketId}
          updateTicket={updateTicket}
        />
      )}

      {creatingTicket && (
        <TicketCreateCard
          ticket={creatingTicket}
          collectionName={name}
          schema={schema}
          setCreatingTicket={setCreatingTicket}
          createTicket={createTicket}
        />
      )}
    </div>
  );
};
