import * as vscode from "vscode";
import { FormListProvider } from "./formList/formListProvider";
import {
  getQuickInput,
  getTypeformToken,
  addToTypeformFormList,
  setTypeformToken,
  removeFromTypeformFormList,
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
          formListProvider.refresh();
        }
      }
    })
  );
  disposables.push(
    vscode.commands.registerCommand("typeform.form.edit", async (item: any) => {
      const formId: string = item.command.arguments[0];
      const formName: string = item.label;
      const newFormName = await getQuickInput(
        "Enter a name to identify the form",
        "Form Name can't be empty",
        formName
      );
      if (newFormName && formName !== newFormName) {
        addToTypeformFormList(formId, newFormName);
        formListProvider.refresh();
      }
    })
  );
  disposables.push(
    vscode.commands.registerCommand("typeform.form.delete", async (item: any) => {
      const formId: string = item.command.arguments[0];
      removeFromTypeformFormList(formId);
      formListProvider.refresh();
    })
  );
  disposables.push(
    vscode.commands.registerCommand("typeform.form.viewResponses", async (formId: string) => {
      // view responses
    })
  );
}

export function deactivate() {}
