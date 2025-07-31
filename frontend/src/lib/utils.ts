import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import type { Schema } from "../../../shared/types/Types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isoToJpString = (value: unknown) => {
  const date = parseISO(String(value));
  return isValid(date)
    ? format(date, "yyyy/MM/dd (EEE)", { locale: ja })
    : String(value);
};

export const parseMaybeDate = (value: unknown): Date | string => {
  if (typeof value === "string") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date;
  }
  return value as string;
};

export const getIdFieldName = (schema: Schema) => {
  return schema.find((FieldDefine) => FieldDefine.isId)?.fieldName!;
};

export const getTitleFieldName = (schema: Schema) => {
  return schema.find((FieldDefine) => FieldDefine.isTitle)?.fieldName;
};

export const getCommentsFieldName = (schema: Schema) => {
  return schema.find((FieldDefine) => FieldDefine.type === "comments")
    ?.fieldName;
};

export const buildComment = (comment: string, authorName: string) => {
  const dateString = format(new Date(), "yyyy/MM/dd（EEE）", {
    locale: ja,
  });
  return `u:${authorName} d:${dateString}\n` + comment;
};
