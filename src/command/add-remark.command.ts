import { existsSync, readFileSync } from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { FileAlias } from "../file-alias";
import { RecordConfig } from "../typings/common.typing";
import { readConfig, writeConfig } from "../utils/file.util";

const addRemark = (
  workspace: vscode.WorkspaceFolder,
  fileAlias: FileAlias
): vscode.Disposable => {
  const configPath = path.join(workspace.uri.fsPath, ".vscode/file-remark.json");
  if (!existsSync(configPath)) {
    throw new Error("不存在配置");
  }

  const privateConfigPath = path.resolve(
    workspace.uri.fsPath,
    ".vscode/file-remark.json"
  );
  const originConfig = readConfig(configPath);
  const commonConfig = existsSync(privateConfigPath)
    ? JSON.parse(readFileSync(privateConfigPath).toString())
    : {};
  const configFile: RecordConfig = { ...commonConfig, ...originConfig };

  return vscode.commands.registerCommand(
    "file-remark.addRemark",
    (uri: vscode.Uri) => {
      const relativelyPath = uri.path.substring(workspace.uri.path.length + 1);
      const filename = path.basename(configPath);
      const inputConfig: vscode.InputBoxOptions = {
        title: "Add Remark",
        value: configFile[relativelyPath]
          ? configFile[relativelyPath].description
          : filename
      };
      vscode.window.showInputBox(inputConfig).then((alias) => {
        if (alias) {
          originConfig[relativelyPath] = {
            ...originConfig[relativelyPath],
            description: alias
          };
          writeConfig(configPath, originConfig);
          fileAlias.setConfig();
          fileAlias.changeEmitter.fire(uri);
        }
      });
    }
  );
};

export { addRemark };
