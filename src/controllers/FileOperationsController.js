import path from "path";
import { createReadStream, createWriteStream, writeFile } from "fs";
import { open, rename, rm } from "fs/promises";
export class FileOperationController {
  constructor() {
    this.commands = ["cat", "add", "cp", "rn", "mv", "rm"];
  }

  async #isFileExists(filePath) {
    try {
      const fd = await open(filePath);
      await fd.close();
      return true;
    } catch (e) {
      return false;
    }
  }

  async cat([argPath], _, currentPath) {
    const filePath = path.join(currentPath, argPath);

    try {
      const fd = await open(filePath);
      const stream = fd.createReadStream("utf-8");

      await new Promise((resolve) => {
        console.log("\x1b[33m");
        stream
          .on("end", () => {
            console.log("\x1b[0m");
            resolve();
          })
          .pipe(process.stdout);
      });
      process.stdout.write("\n");
    } catch (e) {
      throw new Error(`file ${argPath} doesn't exist`);
    }
  }

  async add([argPath], _, currentPath) {
    const filePath = path.join(currentPath, argPath);

    if (await this.#isFileExists(filePath)) {
      throw new Error(`file ${argPath} already exists`);
    }

    createWriteStream(filePath).close();
  }

  async rn([oldFileName, newFileName], _, currentPath) {
    const oldFilePath = path.join(currentPath, oldFileName);
    const newFilePath = path.join(currentPath, newFileName);

    if (await this.#isFileExists(newFilePath))
      throw new Error(`file ${oldFileName} already exists`);

    if (!(await this.#isFileExists(oldFilePath)))
      throw new Error(`file ${newFileName} doesn't exist`);

    rename(oldFilePath, newFilePath);
  }

  async cp([oldFileName, newFileName], _, currentPath) {
    const oldFilePath = path.join(currentPath, oldFileName);
    const newFilePath = path.join(currentPath, newFileName);

    if (await this.#isFileExists(newFilePath))
      throw new Error(`file ${oldFileName} already exists`);

    if (!(await this.#isFileExists(oldFilePath)))
      throw new Error(`file ${newFileName} doesn't exist`);

    const readStream = createReadStream(oldFilePath);
    const writeStream = createWriteStream(newFilePath);

    readStream.pipe(writeStream);
  }

  async mv([oldFileName, newFileName], _, currentPath) {
    try {
      this.cp([oldFileName, newFileName], _, currentPath);
    } catch (e) {
      throw e;
    }

    const oldFilePath = path.join(currentPath, oldFileName);
    rm(oldFilePath);
  }

  async rm([fileName], _, currentPath) {
    const filePath = path.join(currentPath, fileName);
    if (!(await this.#isFileExists(filePath)))
      throw new Error(`file ${fileName} doesn't exist`);
    rm(filePath);
  }
}
