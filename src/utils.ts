import * as vscode from "vscode";
import { getFormDetails, getFormResponses, getForms } from "./api";

export const outputChannel = vscode.window.createOutputChannel("Typeform");

export const getTypeformToken = (): string => vscode.workspace.getConfiguration("typeform").get("token", "");

export const setTypeformToken = async (val: string) =>
  await vscode.workspace.getConfiguration().update("typeform.token", val, vscode.ConfigurationTarget.Global);

export const getTypeformFormList = async (): Promise<Record<string, string>[]> => {
  try {
    const forms = await getForms();
    if (forms && forms.items && forms.items.length > 0) {
      return forms.items.map(({ id, title }: { id: string; title: string }) => ({ id, title }));
    }
    return [];
  } catch (error) {
    outputChannel.appendLine("Error in fetching form list");
    return [];
  }
};

export const getQuickInput = (prompt: string, validationErrorMessage: string, value: string = "") =>
  vscode.window.showInputBox({
    prompt,
    value,
    validateInput: (value: string) => (value === "" ? validationErrorMessage : ""),
  });

export const getResponses = async (id: string) => {
  try {
    const formDetails = await getFormDetails(id);
    if (formDetails && Object.keys(formDetails).length > 0) {
      const formResponses = await getFormResponses(id);
      if (formResponses && Object.keys(formResponses).length > 0) {
        // construct DS
      }
    }
  } catch (error) {
    outputChannel.appendLine("Error in fetching form details/responses");
  }
};
