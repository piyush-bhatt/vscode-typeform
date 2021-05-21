import * as vscode from "vscode";

export const outputChannel = vscode.window.createOutputChannel("Typeform");

export const getTypeformToken = (): string => vscode.workspace.getConfiguration("typeform").get("token", "");

export const setTypeformToken = (val: string) =>
  vscode.workspace.getConfiguration().update("typeform.token", val, vscode.ConfigurationTarget.Global);

const getTypeformFormList = (): Record<string, string>[] =>
  vscode.workspace.getConfiguration("typeform").get("formList", []);

export const addToTypeformFormList = (formId: string, formName: string) => {
  const formList = getTypeformFormList();
  const index = formList.findIndex((item) => item.formId === formId);
  if (index !== -1) {
    formList[index]["formName"] = formName;
  } else {
    formList.push({ formId, formName });
  }

  vscode.workspace.getConfiguration().update("typeform.formList", formList, vscode.ConfigurationTarget.Global);
};

export const getQuickInput = (prompt: string, validationErrorMessage: string, value: string = "") =>
  vscode.window.showInputBox({
    prompt,
    value,
    validateInput: (value: string) => (value === "" ? validationErrorMessage : ""),
  });
