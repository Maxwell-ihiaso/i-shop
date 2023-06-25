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
const cors_1 = __importDefault(require("cors"));
const console_1 = require("console");
const error_handler_1 = require("./utils/error-handler");
const database_1 = require("./database");
// import { customer, appEvents } from './api'
// import { SubscribeMessage } from './utils'
const store = new database_1.Store();
exports.default = (app, channel) => __awaiter(void 0, void 0, void 0, function* () {
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    //   app.use(express.static(__dirname + '/public'))
    //api
    // appEvents(app);
    (0, console_1.log)(channel);
    //   customer(app, channel)
    // error handling
    app.use(error_handler_1.ErrorHandler);
});
