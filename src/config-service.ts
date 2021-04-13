import * as vscode from "vscode";

export class ConfigService {
  private static instance: ConfigService;

  private constructor() {}

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }

    return ConfigService.instance;
  }

  get isBulletsStagered(): boolean {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get("conf.presentation.staggerBullets", true);
  }

  get customCss(): string {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get("conf.view.cssStyles", "");
  }
}
