import * as vscode from "vscode";
import { getContext } from "../context";

export default class ViewLoader {
  private _panel: vscode.WebviewPanel | undefined;
  constructor(private responses: any) {
    this._panel = vscode.window.createWebviewPanel("typeform", "Typeform", vscode.ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    this._panel.onDidDispose(() => {
      this._panel = undefined;
    });
    this._panel.webview.html = getWebviewContent(this.responses);
    console.log(this._panel.webview.html);
  }
}

const getStylesheet = () =>
  vscode.Uri.file(getContext().asAbsolutePath("src/assets/styles.css")).with({
    scheme: "vscode-resource",
  });

const getWebviewContent = (responses: any) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="${getStylesheet()}" />
  </head>
  <body>
    <div class="container">
      <div class="table-container">
        <table class="styled-table">
          <thead>
            <tr>
              ${responses.fields.reduce((acc: string, { title }: { title: string }) => {
                acc += `<th>
                    ${title}
                  </th>`;
                return acc;
              }, "")}
            </tr>
          </thead>
          <tbody>
            ${responses.responses.reduce((acc: string, item: any) => {
              acc += `<tr>
                ${responses.fields.reduce((acc: string, { id }: { id: string }) => {
                  const x = item.find((element: any) => element.fieldId === id);
                  if (x) {
                    acc += `<td>${x.value}</td>`;
                  } else {
                    acc += "<td></td>";
                  }
                  return acc;
                }, "")}
              </tr>`;
              return acc;
            }, "")}
          </tbody>
        </table>
      </div
    </div>
  </body>
</html>`;
