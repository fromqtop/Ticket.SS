import type { GasFunctions } from "../../shared/types/gasFunctions";
import { Schema, Ticket } from "../../shared/types/Types";

const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

function doGet(
  e: GoogleAppsScript.Events.DoGet
): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("Ticket.SS")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

const getLoginUser: GasFunctions["getLoginUser"] = () => {
  const sheet = spreadsheet.getSheetByName(".users");
  if (!sheet) throw new Error(".usersシートが存在しません");

  const email = Session.getActiveUser().getEmail();
  const userRow = sheet
    .getDataRange()
    .getValues()
    .slice(1)
    .find((row) => row[0] === email);

  if (!userRow) throw new Error("ユーザー情報が存在しません");

  const user = {
    email: userRow[0],
    name: userRow[1],
    avatar: userRow[2],
  };

  return JSON.stringify(user);
};

const getSpreadSheetMetaData: GasFunctions["getSpreadSheetMetaData"] = () => {
  const fileName = spreadsheet.getName();
  const fileUrl = spreadsheet.getUrl();
  const sheetNames = spreadsheet
    .getSheets()
    .map((sheet) => sheet.getName())
    .filter(
      (sheetName) => !sheetName.startsWith(".") && !sheetName.startsWith("_")
    );

  const metaData = {
    fileName,
    fileUrl,
    sheetNames,
  };

  return JSON.stringify(metaData);
};

const getCollectionSchema_ = (collectionName: string) => {
  const sheet = spreadsheet.getSheetByName(".schema");
  if (!sheet) throw new Error(".schemaシートが存在しません");

  const [keys, ...records] = sheet.getDataRange().getValues();
  const schema: Schema = arraysToObjects_(keys, records)
    .filter((record) => record.sheetName === collectionName)
    .map((record) => {
      return {
        ...record,
        options: record.options.split(","),
      };
    });
  return schema;
};

const getCollection: GasFunctions["getCollection"] = (collectionName) => {
  const sheet = spreadsheet.getSheetByName(collectionName);
  if (!sheet) throw new Error(`${collectionName}シートが存在しません。`);

  const [keys, ...records] = sheet.getDataRange().getValues();
  const tickets = arraysToObjects_(keys, records);

  return JSON.stringify({
    name: sheet.getName(),
    schema: getCollectionSchema_(collectionName),
    tickets: tickets,
  });
};

const createTicket: GasFunctions["createTicket"] = (collectionName, ticket) => {
  const sheet = spreadsheet.getSheetByName(collectionName);
  if (!sheet) throw new Error(`${collectionName}シートが存在しません。`);

  const schema = getCollectionSchema_(collectionName);
  const ticketObj = parseTicket_(schema, JSON.parse(ticket));

  // コメントにユーザー情報・日付情報を付与
  const commentsColumn = getCommentsColumn_(collectionName);
  if (commentsColumn && ticketObj[commentsColumn]) {
    const authorName = JSON.parse(getLoginUser()).name;
    const comment = buildComment_(
      authorName,
      String(ticketObj[commentsColumn])
    );
    ticketObj[commentsColumn] = comment;
  }

  const lock = LockService.getDocumentLock();
  if (lock.tryLock(10000)) {
    const [keys, ...records] = sheet.getDataRange().getValues();

    // ID採番
    const idColumn = getIdColumn_(sheet.getName());
    const idColumnIndex = keys.findIndex((key) => key === idColumn);
    const ids = records
      .map((record) => record[idColumnIndex])
      .filter((val) => typeof val === "number" && !isNaN(val));
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    ticketObj[idColumn] = nextId;

    const ticketArray = objectToArray_(ticketObj, keys);
    sheet.appendRow(ticketArray);
    lock.releaseLock();
  } else {
    throw new Error(
      "データがロックされているため、チケットが作成できませんでした。"
    );
  }

  return JSON.stringify(ticketObj);
};

const updateTicket: GasFunctions["updateTicket"] = (
  collectionName,
  ticket,
  comment
) => {
  const sheet = spreadsheet.getSheetByName(collectionName);
  if (!sheet) throw new Error(`${collectionName}シートが存在しません。`);

  const schema = getCollectionSchema_(collectionName);
  const ticketObj = parseTicket_(schema, JSON.parse(ticket));

  const lock = LockService.getDocumentLock();
  if (lock.tryLock(10000)) {
    const [keys, ...records] = sheet.getDataRange().getValues();

    const idColumn = getIdColumn_(collectionName);
    const idColumnIndex = keys.findIndex((key) => key === idColumn);

    const ticketId = ticketObj[idColumn];

    // コメントにユーザー情報・日付情報を付与
    const commentsColumn = getCommentsColumn_(collectionName);
    if (commentsColumn && comment) {
      const authorName = JSON.parse(getLoginUser()).name;
      const newComment = buildComment_(authorName, comment);
      if (ticketObj[commentsColumn]) {
        ticketObj[commentsColumn] += "\n---\n" + newComment;
      } else {
        ticketObj[commentsColumn] = newComment;
      }
    }

    const targetIndex = records.findIndex(
      (record) => record[idColumnIndex] === ticketId
    );
    if (targetIndex === -1) throw new Error("更新対象のチケットが存在しません");

    const ticketArray = objectToArray_(ticketObj, keys);
    sheet.getRange(targetIndex + 2, 1, 1, keys.length).setValues([ticketArray]);

    lock.releaseLock();
  } else {
    throw new Error(
      "データがロックされているため、チケットが更新できませんでした。"
    );
  }

  return JSON.stringify(ticketObj);
};

function parseTicket_(schema: Schema, ticket: Ticket) {
  type parsedTicket = Record<string, string | number | boolean | Date>;

  const newTicket: parsedTicket = { ...ticket };

  for (const key in ticket) {
    const type = schema.find((field) => field.fieldName === key)?.type;

    if (type === "date") {
      const value = safeParseDate_(ticket[key]);
      newTicket[key] = value;
    }
  }

  return newTicket;
}

function getIdColumn_(sheetName: string) {
  const sheet = spreadsheet.getSheetByName(".schema");
  if (!sheet) throw new Error(".schemaシートが存在しません");

  const [keys, ...records] = sheet.getDataRange().getValues();
  const data = arraysToObjects_(keys, records);

  return data.find((item) => item.sheetName === sheetName && item.isId)
    .fieldName;
}

function getCommentsColumn_(sheetName: string) {
  const sheet = spreadsheet.getSheetByName(".schema");
  if (!sheet) throw new Error(".schemaシートが存在しません");

  const [keys, ...records] = sheet.getDataRange().getValues();
  const data = arraysToObjects_(keys, records);

  return data.find(
    (item) => item.sheetName === sheetName && item.type === "comments"
  ).fieldName;
}

function arraysToObjects_(keys: string[], records: any[][]) {
  return records.map((record) => arrayToObject_(keys, record));
}

function arrayToObject_(keys: string[], record: any[]) {
  return record.reduce((acc, value, i) => {
    acc[keys[i]] = value;
    return acc;
  }, {});
}

function objectsToArrays_(objs: Record<string, any>[], columns: string[]) {
  return objs.map((obj) => objectToArray_(obj, columns));
}

function objectToArray_(obj: Record<string, any>, columns: string[]) {
  return columns.map((column) => {
    return obj.hasOwnProperty(column) ? obj[column] : null;
  });
}

function safeParseDate_(value: any) {
  const date = new Date(String(value));
  return !date || isNaN(date.getTime()) ? value : date;
}

function buildComment_(authorName: string, comment: string) {
  const u = authorName;
  const now = new Date();
  const day = ["日", "月", "火", "水", "木", "金", "土"][now.getDay()];
  const d = Utilities.formatDate(now, "JST", "yyyy/M/d") + `（${day}）`;
  return `u:${u} d:${d}\n${comment}`;
}
