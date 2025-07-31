export type GasFunctions = {
  getSpreadSheetMetaData: () => string;
  getCollection: (collectionName: string) => string;
  createTicket: (collectionName: string, ticket: string) => string;
  updateTicket: (
    collectionName: string,
    ticket: string,
    comment: string
  ) => string;
  getLoginUser: () => string;
};
