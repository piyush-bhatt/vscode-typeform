import * as vscode from "vscode";
import { updateTypeformAPIAuth } from "./api";
import { setContext } from "./context";
import { FormListProvider } from "./formList/formListProvider";
import { getQuickInput, getTypeformToken, setTypeformToken, getResponses } from "./utils";
import ViewLoader from "./webview/ViewLoader";

export function activate(context: vscode.ExtensionContext) {
  setContext(context);
  let disposables: vscode.Disposable[] = [];
  const formListProvider = new FormListProvider();
  disposables.push(vscode.window.registerTreeDataProvider("typeform.forms", formListProvider));
  disposables.push(
    vscode.commands.registerCommand("typeform.addToken", async () => {
      const token: string = getTypeformToken();
      const userInputToken = await getQuickInput("Enter Typeform Token", "Token can't be empty string", token);
      if (userInputToken) {
        await setTypeformToken(userInputToken);
        updateTypeformAPIAuth();
        formListProvider.refresh();
      }
    })
  );
  disposables.push(
    vscode.commands.registerCommand("typeform.refresh", () => {
      formListProvider.refresh();
    })
  );
  disposables.push(
    vscode.commands.registerCommand("typeform.form.viewResponses", async (title: string, id: string) => {
      await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: "Typeform" },
        async (progress): Promise<void> => {
          progress.report({ message: "Fetching Responses" });
          const responses = await getResponses(id);
          if (responses) {
            new ViewLoader(title, responses);
          }
          return new Promise(async (resolve, reject) => {
            resolve();
          });
        }
      );
    })
  );
}

export function deactivate() {}
