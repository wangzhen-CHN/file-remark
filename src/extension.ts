import * as fs from "fs";
import { addRemark, deleteRemark } from "./command";
import path = require("path");
import { ExtensionContext, workspace } from "vscode";
import { FileAlias } from "./file-alias";
import { writeConfig } from "./utils/file.util";

export async function activate(context: ExtensionContext) {
  if (!workspace.workspaceFolders) {
    return;
  }

  for (let index = 0; index < workspace.workspaceFolders.length; index++) {
    const ws = workspace.workspaceFolders[index];
    let fileAlias = new FileAlias(ws.uri);
    await fileAlias.initWorkSpace();
    const workspaceDir: string = ws.uri.fsPath;
    const configPath = path.join(workspaceDir, ".vscode/file-remark.json");
    if (!fs.existsSync(configPath)) {
      writeConfig(configPath, {});
    }
    context.subscriptions.push(addRemark(ws, fileAlias));
    context.subscriptions.push(deleteRemark(ws, fileAlias));
  }
}
