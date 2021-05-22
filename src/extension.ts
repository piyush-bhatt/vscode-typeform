import * as vscode from "vscode";
import { updateTypeformAPIAuth } from "./api";
import { FormListProvider } from "./formList/formListProvider";
import {
  getQuickInput,
  getTypeformToken,
  setTypeformToken,
  getResponses,
} from "./utils";

export function activate(context: vscode.ExtensionContext) {
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
    vscode.commands.registerCommand("typeform.form.viewResponses", async (id: string) => {
      const responses = await getResponses(id);
    })
  );
}

export function deactivate() {}
