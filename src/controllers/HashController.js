import { createHash } from "node:crypto";
import { readFile } from "fs/promises";
import path from "path";

export class HashController {
  constructor() {
    this.commands = ["hash"];
  }

  async hash([argPath], _, currentPath) {
    const hash = createHash("sha256");

    const filePath = path.join(currentPath, argPath);
    try {
      const content = await readFile(filePath);
      console.log(hash.update(content).digest("hex"));
    } catch (e) {
      throw new Error(`file ${argPath} doesn't exist`);
    }
  }
}
