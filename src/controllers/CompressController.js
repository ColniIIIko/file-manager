import { createReadStream, createWriteStream } from "node:fs";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import { open } from "fs/promises";
import path from "path";

export class CompressController {
  constructor() {
    this.commands = ["compress", "decompress"];
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

  async compress([srcPath, destPath], _, currentPath) {
    const fileSrcPath = path.join(currentPath, srcPath);
    const fileDestPath = path.join(currentPath, destPath);

    if (!(await this.#isFileExists(fileSrcPath))) {
      throw new Error(`file ${srcPath} doesn't exist`);
    }

    const gzip = createBrotliCompress();
    const readStream = createReadStream(fileSrcPath);
    const writeStream = createWriteStream(fileDestPath);

    readStream.pipe(gzip).pipe(writeStream);
  }

  async decompress([srcPath, destPath], _, currentPath) {
    const fileSrcPath = path.join(currentPath, srcPath);
    const fileDestPath = path.join(currentPath, destPath);

    if (!(await this.#isFileExists(fileSrcPath))) {
      throw new Error(`file ${srcPath} doesn't exist`);
    }

    const unzip = createBrotliDecompress();
    const readStream = createReadStream(fileSrcPath);
    const writeStream = createWriteStream(fileDestPath);

    readStream.pipe(unzip).pipe(writeStream);
  }
}
