import { readFileSync, writeFileSync } from "fs";
import { RecordConfig } from "../typings/common.typing";

function readConfig(configPath: string): RecordConfig {
  return JSON.parse(readFileSync(configPath).toString());
}

function writeConfig(configPath: string, config: RecordConfig): void {
  writeFileSync(configPath, JSON.stringify(config, null, 4));
}

export { readConfig, writeConfig };
