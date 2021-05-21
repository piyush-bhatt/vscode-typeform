import * as vscode from "vscode";
import { getQuickInput, getTypeformToken, addToTypeformFormList, setTypeformToken } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  let disposables: vscode.Disposable[] = [];
  disposables.push(
    vscode.commands.registerCommand("typeform.addToken", async () => {
      const token: string = getTypeformToken();
      const userInputToken = await getQuickInput("Enter Typeform Token", "Token can't be empty string", token);
      if (userInputToken) {
        setTypeformToken(userInputToken);
      }
    })
  );
  disposables.push(
    vscode.commands.registerCommand("typeform.addForm", async () => {
      const formId = await getQuickInput("Enter Typeform Form ID", "Form ID can't be empty");
      if (formId) {
        const formName = await getQuickInput("Enter a name to identify the form", "Form Name can't be empty");
        if (formName) {
          addToTypeformFormList(formId, formName);
        }
      }
    })
  );
}

export function deactivate() {}
