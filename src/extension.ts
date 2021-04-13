// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Slide } from "./slide";
import { SlidesService } from "./slides-service";
import { SlideControlsViewProvider } from "./slide-controls-view";

let slideService: SlidesService;
let panel: vscode.WebviewPanel;
let currentSlide = 0;

function showSlide(slide: Slide): void {
  panel.webview.html = slide.html;
}
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vscode-slides" is now active!');

  vscode.window.registerTreeDataProvider(
    "slideControls",
    new SlideControlsViewProvider()
  );

  let disposable = vscode.commands.registerCommand(
    "vscode-slides.startSlideShow",
    () => {
      panel = vscode.window.createWebviewPanel(
        "cscode-slides",
        "VS Code Slides",
        vscode.ViewColumn.One,
        {}
      );
      const md = "" + vscode.window.activeTextEditor?.document.getText();
      const mdPath = vscode.window.activeTextEditor?.document.uri;

      slideService = new SlidesService(md, mdPath?.fsPath);
      showSlide(slideService.currentSlide);
    }
  );

  let disposable2 = vscode.commands.registerCommand(
    "vscode-slides.advanceSlide",
    () => {
      showSlide(slideService.moveToNextSlide());
    }
  );

  let disposable3 = vscode.commands.registerCommand(
    "vscode-slides.prevSlide",
    () => {
      showSlide(slideService.moveToPrevSlide());
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposable2);
  context.subscriptions.push(disposable3);
}

export function deactivate() {}
