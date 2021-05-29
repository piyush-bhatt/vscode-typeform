import * as vscode from "vscode";
import { getContext } from "../context";

export default class ViewLoader {
  private _panel: vscode.WebviewPanel | undefined;
  constructor(private title: string, private responses: any) {
    this._panel = vscode.window.createWebviewPanel("typeform", this.title, vscode.ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    this._panel.onDidDispose(() => {
      this._panel = undefined;
    });
    this._panel.webview.html = getWebviewContent(this.responses);
  }
}

const getStylesheet = () =>
  vscode.Uri.file(getContext().asAbsolutePath("assets/styles.css")).with({
    scheme: "vscode-resource",
  });

const getCircleCss = () =>
  vscode.Uri.file(getContext().asAbsolutePath("assets/circle.css")).with({
    scheme: "vscode-resource",
  });

const getWebviewContent = (responses: any) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="${getStylesheet()}" />
    <link rel="stylesheet" href="${getCircleCss()}" />
  </head>
  <body>
    <div class="container">
      <div class="insights-container">
        <h3>Insights</h3>
        <div class="counts-container">
          <div class="card pointer">
            <h1>${responses.summary.responses_count}</h1>
            <h4>Total Responses</h4>
          </div>
          <div class="card pointer">
            <h1>${responses.summary.total_visits}</h1>
            <h4>Total Visits</h4>
          </div>
          <div class="card pointer">
            <h1>${responses.summary.unique_visits}</h1>
            <h4>Unique Visits</h4>
          </div>
          <div class="card pointer">
            <h1>${
              responses.summary.average_time < 60
                ? responses.summary.average_time + " sec"
                : responses.summary.average_time >= 60 && responses.summary.average_time < 3600
                ? Math.round((responses.summary.average_time / 60) * 10) / 10 + " min"
                : Math.round((responses.summary.average_time / 3600) * 10) / 10 + " hr"
            }</h1>
            <h4>Average Time</h4>
          </div>
        </div>
      </div>
      <div class="summary-container">
        <h3>Completion Rate</h3>
        <div class="rate-container">
          <div class="overall-completion">
            <h4>Total</h4>
            <div class="pointer c100 big dark p${Math.round(responses.summary.completion_rate)} ${
  responses.summary.completion_rate >= 75 ? "green" : responses.summary.completion_rate >= 25 ? "orange" : "red"
}">
              <span>${responses.summary.completion_rate}%</span>
              <div class="slice">
                  <div class="bar"></div>
                  <div class="fill"></div>
              </div>
            </div>
          </div>
          <div class="platform-completion">
            ${responses.summary.platforms.reduce((acc: string, item: Record<string, any>) => {
              acc += `<div>
                <h4>${item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}</h4>
                <div class="pointer c100 dark p${Math.round(item.completion_rate)} ${
                item.completion_rate >= 75 ? "green" : item.completion_rate >= 25 ? "orange" : "red"
              }">
                  <span>${item.completion_rate}%</span>
                  <div class="slice">
                      <div class="bar"></div>
                      <div class="fill"></div>
                  </div>
                </div>
              </div>`;
              return acc;
            }, "")}
          </div>
        </div>
      </div>
      <div class="response-container">
        <h3>Responses</h3>
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
        </div>
      </div>
    </div>
  </body>
</html>`;
