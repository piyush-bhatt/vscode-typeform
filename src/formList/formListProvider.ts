import * as vscode from "vscode";
import { getTypeformFormList } from "../utils";

export class FormListProvider implements vscode.TreeDataProvider<FormTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<FormTreeItem | undefined | null | void> = new vscode.EventEmitter<
    FormTreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData: vscode.Event<FormTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: FormTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FormTreeItem): Thenable<FormTreeItem[]> {
    return Promise.resolve(this.getLists());
  }

  private async getLists(): Promise<FormTreeItem[]> {
    let items: FormTreeItem[];
    const formList: Record<string, string>[] = await getTypeformFormList();
    items = formList.map((item) => {
      const formTreeItem = new FormTreeItem(item.title);
      formTreeItem.command = {
        title: "",
        command: "typeform.form.viewResponses",
        arguments: [item.id],
      };
      formTreeItem.iconPath = new vscode.ThemeIcon("output");
      return formTreeItem;
    });
    return items;
  }
}

class FormTreeItem extends vscode.TreeItem {
  constructor(public label: string) {
    super(label);
  }
}
