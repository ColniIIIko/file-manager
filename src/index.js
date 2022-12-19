import { App } from "./app.js";
import { CompressController } from "./controllers/CompressController.js";
import { FileOperationController } from "./controllers/FileOperationsController.js";
import { HashController } from "./controllers/HashController.js";
import { OSController } from "./controllers/OSController.js";

const app = new App([
  new FileOperationController(),
  new OSController(),
  new HashController(),
  new CompressController(),
]);
app.init();
