import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import type { TicketItemValue } from "../../../../shared/types/Types";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return format(date, "yyyy-MM-dd");
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

type Props = {
  fieldName: string;
  dateString: string;
  updateDraftTicket: (key: string, value: TicketItemValue) => void;
  isSubmitting: boolean;
};

export function DatePickerWithInput({
  fieldName,
  dateString,
  updateDraftTicket,
  isSubmitting,
}: Props) {
  const now = new Date();
  const mayBeDate = new Date(dateString);

  // input
  const [value, setValue] = React.useState(
    isValidDate(mayBeDate) ? formatDate(mayBeDate) : dateString
  );

  // calendar
  const [open, setOpen] = React.useState(false);
  const date = isValidDate(mayBeDate) ? mayBeDate : undefined;
  const [month, setMonth] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    setValue(isValidDate(mayBeDate) ? formatDate(mayBeDate) : dateString);
  }, [dateString]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2 w-1/2">
        <Input
          id="date"
          value={value}
          placeholder="日付を選択 ..."
          className="bg-background pr-10"
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => {
            const date = new Date(e.target.value);
            if (isValidDate(date)) {
              const utcDate = new Date(
                Date.UTC(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() - 1,
                  15
                )
              );
              updateDraftTicket(fieldName, utcDate.toISOString());
              setMonth(date);
            } else {
              updateDraftTicket(fieldName, e.target.value);
              setMonth(new Date());
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          disabled={isSubmitting}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              disabled={isSubmitting}
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0 h-[333px]"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                updateDraftTicket(fieldName, date ? date.toISOString() : "");
                setOpen(false);
              }}
              startMonth={new Date(now.getFullYear() - 3, now.getMonth(), 1)}
              endMonth={new Date(now.getFullYear() + 3, now.getMonth() + 1, 0)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
