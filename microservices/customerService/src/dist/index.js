"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
// import { databaseConnection } from './database'
const express_app_1 = __importDefault(require("./express-app"));
// import { CreateChannel } from './utils'
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    //   await databaseConnection()
    //   const channel = await CreateChannel()
    yield (0, express_app_1.default)(app, "channel");
    app
        .listen(config_1.PORT, () => {
        console.log(`${config_1.ENVIRONMENT} environment started`);
        console.log(`listening to port ${config_1.PORT}`);
    })
        .on('error', (err) => {
        console.log(err);
        process.exit();
    });
    // .on('close', () => {
    //   channel.close()
    // })
});
StartServer();
