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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = exports.ErrorLogger = void 0;
const winston_1 = require("winston");
const LogErrors = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: '../logs/customer_app_error.log' }),
    ],
});
class ErrorLogger {
    constructor() { }
    logError(err) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('==================== Start Error Logger ===============');
            LogErrors.log({
                private: true,
                level: 'error',
                message: `${new Date()} : ${err === null || err === void 0 ? void 0 : err.status} : ${err === null || err === void 0 ? void 0 : err.name} : ${err === null || err === void 0 ? void 0 : err.message} : ${(err === null || err === void 0 ? void 0 : err.stack) && (err === null || err === void 0 ? void 0 : err.stack)}`,
            });
            console.log('==================== End Error Logger ===============');
        });
    }
}
exports.ErrorLogger = ErrorLogger;
const ErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errorLogger = new ErrorLogger();
    yield errorLogger.logError(err);
    let status = (_a = err === null || err === void 0 ? void 0 : err.statusCode) !== null && _a !== void 0 ? _a : 500;
    return res.status(status).json({ message: err.message });
});
exports.ErrorHandler = ErrorHandler;
