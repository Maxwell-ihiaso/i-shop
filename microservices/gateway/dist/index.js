"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/user', (0, express_http_proxy_1.default)(config_1.USER_MICROSERVICE));
app.use('/cart', (0, express_http_proxy_1.default)(config_1.CART_MICROSERVICE));
app.use('/order', (0, express_http_proxy_1.default)(config_1.ORDER_MICROSERVICE));
app.use('/checkout', (0, express_http_proxy_1.default)(config_1.CHECKOUT_MICROSERVICE));
app.use('/auth', (0, express_http_proxy_1.default)(config_1.AUTH_MICROSERVICE));
app.use('/', (0, express_http_proxy_1.default)(config_1.PRODUCT_MICROSERVICE)); // products
app.listen(8000, () => {
    console.log(`${config_1.ENVIRONMENT} environment started`);
    console.log('Gateway is Listening to Port 8000');
});
