import { useState } from "react";
import type { Ticket } from "../../../shared/types/Types";

export const useTextFilter = () => {
  const [textFilterValue, setTextFilterValue] = useState("");

  const isTextFilterMatch = (ticket: Ticket, text: string) => {
    return Object.values(ticket).some((value) =>
      String(value).toLowerCase().includes(text.toLowerCase())
    );
  };

  const isTextFilterActive = textFilterValue ? true : false;

  const clearTextFilter = () => setTextFilterValue("");

  return {
    textFilterValue,
    setTextFilterValue,
    isTextFilterActive,
    isTextFilterMatch,
    clearTextFilter,
  };
};
