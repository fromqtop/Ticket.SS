import { TicketFilterDropdown } from "./TicketFilterDropdown";
import type { Filter } from "../../../../shared/types/Types";

type Props = {
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
};

export const TicketFilterDropdowns = ({ filters, setFilters }: Props) => {
  const updateFilterOption = (
    fieldName: string,
    option: string,
    checked: boolean
  ) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.fieldName === fieldName
          ? { ...filter, options: { ...filter.options, [option]: checked } }
          : filter
      )
    );
  };

  const clearFilterOptions = (options: Record<string, boolean>) => {
    return Object.fromEntries(Object.keys(options).map((key) => [key, false]));
  };

  const clearFilter = (fieldName: string) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.fieldName === fieldName
          ? { ...filter, options: clearFilterOptions(filter.options) }
          : filter
      )
    );
  };

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        {filters.map((filter) => (
          <TicketFilterDropdown
            fieldName={filter.fieldName}
            options={filter.options}
            updateFilterOption={updateFilterOption}
            clearFilter={clearFilter}
          />
        ))}
      </div>
    </div>
  );
};
