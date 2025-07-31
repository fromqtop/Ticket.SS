import type {
  FieldType,
  TicketItemValue,
} from "../../../../shared/types/Types";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { DatePickerWithInput } from "./DatePickerWithInput";

type Props = {
  fieldName: string;
  value: TicketItemValue;
  type: FieldType;
  options: string[];
  updateDraftTicket: (key: string, value: TicketItemValue) => void;
  isEditing: boolean;
  isSubmitting: boolean;
};

const FieldWrapper = ({
  isEditing,
  children,
}: {
  isEditing: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative">
      <div
        className={`absolute top-0 -left-3 w-1 h-full rounded-4xl ${
          isEditing ? "bg-green-300" : ""
        }`}
      />
      {children}
    </div>
  );
};

export const DynamicField = ({
  fieldName,
  value,
  type,
  options,
  updateDraftTicket,
  isEditing,
  isSubmitting,
}: Props) => {
  return (
    <>
      {type === "text" && (
        <FieldWrapper isEditing={isEditing}>
          <Input
            type="text"
            placeholder={`${fieldName}を入力 ...`}
            value={String(value)}
            onChange={(e) => updateDraftTicket(fieldName, e.target.value)}
            disabled={isSubmitting}
          />
        </FieldWrapper>
      )}

      {(type === "textarea" || type === "comments") && (
        <FieldWrapper isEditing={isEditing}>
          <Textarea
            placeholder={`${fieldName}を入力 ...`}
            value={String(value)}
            onChange={(e) => updateDraftTicket(fieldName, e.target.value)}
            disabled={isSubmitting}
          />
        </FieldWrapper>
      )}

      {type === "select" && (
        <FieldWrapper isEditing={isEditing}>
          <Select
            value={String(value)}
            onValueChange={(value) => updateDraftTicket(fieldName, value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-1/2">
              <SelectValue placeholder={`${fieldName}を選択 ...`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{fieldName}</SelectLabel>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FieldWrapper>
      )}

      {type === "date" && (
        <FieldWrapper isEditing={isEditing}>
          <DatePickerWithInput
            fieldName={fieldName}
            dateString={String(value)}
            updateDraftTicket={updateDraftTicket}
            isSubmitting={isSubmitting}
          />
        </FieldWrapper>
      )}
    </>
  );
};
