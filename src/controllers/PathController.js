import path from "path";
import { readdir, stat } from "fs/promises";

export class PathController {
  constructor() {
    this.currentPath = path.resolve();
    this.commands = ["cd", "ls", "up"];
  }

  async cd([pathArg]) {
    if (!pathArg) return;
    try {
      const newPath = path.resolve(
        this.currentPath,
        pathArg.replaceAll("'", "").replaceAll(`"`, "")
      );
      if ((await stat(newPath)).isDirectory()) this.currentPath = newPath;
    } catch (e) {
      console.log(`path ${pathArg} is incorrect`);
    }
  }

  up() {
    const newPath = path.resolve(this.currentPath, "..");
    this.currentPath = newPath;
  }

  async ls() {
    try {
      const files = await readdir(this.currentPath);
      const filesStat = await Promise.all(
        files.map(async (f) => {
          let fstat;
          try {
            fstat = await stat(path.join(this.currentPath, f));
          } catch (e) {
            fstat = null;
          }
          return fstat?.isDirectory() ? "Directory" : "File";
        })
      );
      const fileTable = files
        .reduce((acc, f, index) => {
          acc.push({ Name: f, Type: filesStat[index] });
          return acc;
        }, [])
        .sort((lhs, rhs) => {
          if (lhs.Type === rhs.Type) {
            return lhs.Name.localeCompare(rhs.Name);
          }

          return lhs.Type === "Directory" ? -1 : 1;
        });
      console.table(fileTable);
    } catch (e) {
      throw e;
    }
  }
}
