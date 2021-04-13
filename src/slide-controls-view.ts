import * as vscode from "vscode";

export class SlideControlsViewProvider
  implements vscode.TreeDataProvider<vscode.TreeItem> {
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): vscode.TreeItem[] {
    return [
      new SlidesControlTreeItem("Prev", {
        title: "Previous Slide",
        command: "vscode-slides.prevSlide",
      }),
      new SlidesControlTreeItem("Next", {
        title: "Next Slide",
        command: "vscode-slides.advanceSlide",
      }),
    ];
  }
}

class SlidesControlTreeItem extends vscode.TreeItem {
  constructor(public readonly label: string, public command: vscode.Command) {
    super(label);
    this.tooltip = this.label;
  }
}
