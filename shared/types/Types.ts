export type SpreadSheetMetaData = {
  fileName: string;
  fileUrl: string;
  sheetNames: string[];
};

export type Collection = {
  name: string;
  schema: Schema;
  tickets: Ticket[];
};

export type Schema = FieldDefine[];

export type FieldDefine = {
  fieldName: string;
  isId: boolean;
  type: FieldType;
  editable: boolean;
  isTitle: boolean;
  shownInTable: boolean;
  enableFilter: boolean;
  options: string[];
};

export type FieldType = "text" | "textarea" | "select" | "date" | "comments";

export type Ticket = Record<string, TicketItemValue>;

export type TicketItemValue = string | number | boolean;

export type Filter = {
  fieldName: string;
  options: Record<string, boolean>;
};

export type FilterOptions = Record<string, boolean>;

export type User = {
  name: string;
  email: string;
  avatar: string;
};
