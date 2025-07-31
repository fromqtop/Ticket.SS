import type { GasFunctions } from "../../shared/types/GasFunctions";
import { testCollection } from "./testCollection";

type Mocks = {
  [K in keyof GasFunctions]: (...args: Parameters<GasFunctions[K]>) => void;
};

type SuccessHandler = (result?: any) => void;
type FailureHandler = (error?: any) => void;

export class GoogleScriptRun {
  private successHandler: SuccessHandler;
  private failureHandler: FailureHandler;

  constructor(
    successHandler?: SuccessHandler,
    failureHandler?: FailureHandler
  ) {
    this.successHandler = successHandler ?? (() => {});
    this.failureHandler = failureHandler ?? ((error) => console.error(error));
  }

  withSuccessHandler(handler: (result?: any) => void) {
    return new GoogleScriptRun(handler, this.failureHandler);
  }

  withFailureHandler(handler: (error?: any) => void) {
    return new GoogleScriptRun(this.successHandler, handler);
  }

  // ここからGASのモックを記述 //
  getLoginUser: Mocks["getLoginUser"] = () => {
    console.log("🛠️ [MOCK] getLoginUser Called");
    const user = {
      name: "testuser",
      email: "testuser@example.com",
      avatar: "",
    };
    const result = JSON.stringify(user);

    const isSuccess = true;
    setTimeout(() => {
      isSuccess
        ? this.successHandler(result)
        : this.failureHandler(new Error("データの作成に失敗しました"));
    }, 2000);
  };

  getSpreadSheetMetaData: Mocks["getSpreadSheetMetaData"] = () => {
    console.log("🛠️ [MOCK] getSpreadSheetMetaData Called");
    const isSuccess = true;

    setTimeout(() => {
      const info = {
        fileName: "テストスプレッドシート",
        fileUrl:
          "https://docs.google.com/spreadsheets/d/1xUXvtyEKdw0GX_OlQ9LlbSIoOxzk0Nq1tduz1VoGqIo",
        sheetNames: ["課題一覧", "QA一覧", "ToDos"],
      };
      const result = JSON.stringify(info);

      isSuccess
        ? this.successHandler(result)
        : this.failureHandler(new Error("データの取得に失敗しました"));
    }, 1000);
  };

  getCollection: Mocks["getCollection"] = (collectionName) => {
    console.log("🛠️ [MOCK] getCollection Called");
    const isSuccess = true;
    const json = { ...testCollection, name: collectionName };
    const result = JSON.stringify(json);

    setTimeout(() => {
      if (isSuccess) {
        this.successHandler(result);
      } else {
        this.failureHandler(new Error("データの取得に失敗しました"));
      }
    }, 1000);
  };

  createTicket: Mocks["createTicket"] = (collectionName, ticket) => {
    console.log("🛠️ [MOCK] createTicket Called", collectionName, ticket);
    const isSuccess = true;

    const ticketObj = JSON.parse(ticket);
    if (ticketObj.comment) ticketObj.comment += "u:testuser d:yyyy/mm/dd（E）";

    setTimeout(() => {
      isSuccess
        ? this.successHandler(JSON.stringify(ticketObj))
        : this.failureHandler(new Error("データの作成に失敗しました"));
    }, 2000);
  };

  updateTicket: Mocks["updateTicket"] = (collectionName, ticket, comment) => {
    console.log(
      "🛠️ [MOCK] updateTicket Called",
      collectionName,
      ticket,
      comment
    );
    const isSuccess = true;

    const ticketObj = JSON.parse(ticket);
    if (comment)
      ticketObj.comment +=
        "\n---\n" + "u:testuser d:yyyy/mm/dd（E）\n" + comment;

    setTimeout(() => {
      isSuccess
        ? this.successHandler(JSON.stringify(ticketObj))
        : this.failureHandler(new Error("データの更新に失敗しました"));
    }, 2000);
  };
}
