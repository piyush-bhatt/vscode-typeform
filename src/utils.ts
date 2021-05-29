import * as vscode from "vscode";
import { getFormInsights, getFormResponses, getForms } from "./api";

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
    const formInsights = await getFormInsights(id);
    if (formInsights && Object.keys(formInsights).length > 0) {
      const formResponses = await getFormResponses(id);
      if (formResponses && Object.keys(formResponses).length > 0) {
        const fields = formInsights.fields.map((field: any) => ({ id: field.id, title: field.title }));
        const summary = formInsights.form.summary;
        summary["platforms"] = formInsights.form.platforms;
        const responses = formResponses.items.map((item: any) => {
          return item.answers
            ? item.answers.map((answer: any) => {
                if (answer.type === "text") {
                  return { fieldId: answer.field.id, type: answer.type, value: answer.text };
                } else if (answer.type === "choice") {
                  return { fieldId: answer.field.id, type: answer.type, value: answer.choice.label };
                } else if (answer.type === "email") {
                  return { fieldId: answer.field.id, type: answer.type, value: answer.email };
                } else if (answer.type === "url") {
                  return { fieldId: answer.field.id, type: answer.type, value: answer.url };
                } else if (answer.type === "file_url") {
                  return { fieldId: answer.field.id, type: answer.type, value: answer.file_url };
                } else if (answer.type === "boolean") {
                  return { fieldId: answer.field.id, type: answer.type, value: answer.boolean };
                } else if (answer.type === "number") {
                  return { fieldId: answer.field.id, type: answer.type, value: answer.number };
                } else if (answer.type === "date") {
                  return { fieldId: answer.field.id, type: answer.type, value: answer.date };
                } else if (answer.type === "payment") {
                  return { fieldId: answer.field.id, type: answer.type, value: answer.payment };
                }
                return { fieldId: "", type: "", value: "" };
              })
            : [];
        });
        return { fields, summary, responses };
      }
    }
  } catch (error) {
    outputChannel.appendLine("Error in fetching form details/responses");
  }
};
