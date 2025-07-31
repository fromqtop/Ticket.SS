import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { CirclePlusIcon, X } from "lucide-react";
import type { FilterOptions } from "../../../../shared/types/Types";

type Props = {
  fieldName: string;
  options: FilterOptions;
  updateFilterOption: UpdateFilterOption;
  clearFilter: (fieldName: string) => void;
};

type UpdateFilterOption = (
  fieldName: string,
  option: string,
  checked: boolean
) => void;

export const TicketFilterDropdown = ({
  fieldName,
  options,
  updateFilterOption,
  clearFilter,
}: Props) => {
  const [open, setOpen] = useState(false);
  const checkedOptionCount = Object.values(options).filter(
    (value) => value === true
  ).length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          <CirclePlusIcon />
          {fieldName}
          <Separator orientation="vertical" className="mx-1" />
          <Badge variant="secondary" className="w-5">
            {checkedOptionCount}
          </Badge>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="flex justify-between items-center">
          {fieldName}
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {Object.entries(options).map(([option, checked]) => (
          <DropdownMenuCheckboxItem
            checked={checked}
            onCheckedChange={(checked) =>
              updateFilterOption(fieldName, option, checked)
            }
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            <div className="flex w-full items-center">
              <span className="flex-1 truncate">{option}</span>
            </div>
          </DropdownMenuCheckboxItem>
        ))}

        <Separator className="my-1" />
        <Button
          variant="ghost"
          className="w-full font-normal"
          onClick={() => clearFilter(fieldName)}
        >
          クリア
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
