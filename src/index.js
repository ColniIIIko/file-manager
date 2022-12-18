import { App } from "./app.js";
import { FileOperationController } from "./controllers/FileOperationsController.js";

const app = new App([new FileOperationController()]);
app.init();
