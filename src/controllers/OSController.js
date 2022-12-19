import { EOL, cpus, homedir, hostname } from "node:os";

export class OSController {
  #subController = new OSSubController();

  constructor() {
    this.commands = ["os"];
  }
  os(arg, commandArg) {
    if (!commandArg) {
      throw new Error(`command os should be provided with arguments`);
    }

    const command = commandArg.replace("--", "");
    if (this.#subController[command]) {
      this.#subController[command]();
    } else {
      throw new Error(`argument ${commandArg} isn't valid`);
    }
  }
}

class OSSubController {
  EOL() {
    console.log(JSON.stringify(EOL));
  }

  cpus() {
    const model = cpus()[0].model.trim();
    const amount = cpus().length;
    const clockRates = cpus().map((c) => `${(c.speed / 1000).toFixed(1)}Ghz`);
    console.log("Model:", model);
    console.log("Cpus amount:", amount);
    console.log("Clock rates:\n", clockRates);
  }

  homedir() {
    console.log(homedir());
  }

  username() {
    console.log(hostname());
  }

  architecture() {
    console.log(process.arch);
  }
}
