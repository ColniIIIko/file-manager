import { App } from "./app.js";
import { FileOperationController } from "./controllers/FileOperationsController.js";
import { OSController } from "./controllers/OSController.js";

const app = new App([new FileOperationController(), new OSController()]);
app.init();
