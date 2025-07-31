import { useState } from "react";
import type { Filter, Schema, Ticket } from "../../../shared/types/Types";

export const useTicketFilterDropdowns = (schema: Schema) => {
  const initialDropdownFilters = schema
    .filter((field) => field.enableFilter)
    .map((field) => {
      return {
        fieldName: field.fieldName,
        options: Object.fromEntries(
          field.options.map((option) => [option, false])
        ),
      };
    });

  const [dropdownfilters, setDropdownFilters] = useState(
    initialDropdownFilters
  );

  const isDropdownFilterActive = dropdownfilters.some((filter) =>
    Object.values(filter.options).some((value) => value === true)
  );

  const isDropdownFilterMatch = (ticket: Ticket, filter: Filter) => {
    const selected = Object.entries(filter.options)
      .filter(([_, checked]) => checked)
      .map(([value]) => value);

    if (selected.length === 0) return true;

    return selected.includes(String(ticket[filter.fieldName]));
  };

  const clearDropdownFilters = () => {
    setDropdownFilters(initialDropdownFilters);
  };

  return {
    dropdownfilters,
    setDropdownFilters,
    isDropdownFilterActive,
    isDropdownFilterMatch,
    clearDropdownFilters,
  };
};
