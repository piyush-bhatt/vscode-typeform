import * as vscode from "vscode";

export default class ViewLoader {
  private _panel: vscode.WebviewPanel | undefined;
  constructor(context: vscode.ExtensionContext) {
    this._panel = vscode.window.createWebviewPanel("typeform", "Typeform", vscode.ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    this._panel.onDidDispose(() => {
      this._panel = undefined;
    });
    this._panel.webview.html = getWebviewContent();
  }
}

const getWebviewContent = () => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body></body>
</html>`;
