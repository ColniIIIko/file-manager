import { parseCommand } from "./utils/parseCommand.js";
import { parseArgs } from "./utils/parseArgs.js";
import { PathController } from "./controllers/PathController.js";

export class App {
  #pathController;
  #controllers;
  userName;

  constructor(controllers) {
    this.#controllers = controllers;

    const pathController = this.#controllers.find(
      (c) => c instanceof PathController
    );
    if (!pathController) {
      this.#pathController = new PathController();
      this.#controllers.push(this.#pathController);
    } else {
      this.#pathController = pathController;
    }
    this.userName = parseArgs().username;
  }

  init() {
    console.log(`Welcome to the File Manager, ${this.userName}!\n`);
    process.stdout.write(this.#pathController.currentPath + "> ");

    process.stdin.on("data", async (data) => {
      if (data.toString().trim() == ".exit") process.emit("SIGINT");

      const commandData = parseCommand(data.toString());
      const commandController = this.#controllers.find((c) =>
        c.commands.includes(commandData.command)
      );
      try {
        if (!commandController) {
          console.log(`command ${commandData.command} not found \n`);
        } else {
          await commandController[commandData.command](
            commandData.arg,
            commandData.commandArgs,
            this.#pathController.currentPath
          );
        }
      } catch (e) {
        console.log(e.message);
      }
      process.stdout.write(this.#pathController.currentPath + "> ");
    });

    process.on("SIGINT", () => {
      console.log(
        `\nThank you for using File Manager, ${this.userName}, goodbye!\n`
      );
      process.exit(1);
    });
  }
}
