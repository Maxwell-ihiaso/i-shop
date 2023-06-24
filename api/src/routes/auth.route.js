const router = require("express").Router();
const { registerHandler, loginHandler } = require("../controllers/auth.controller");

//REGISTER
router.post("/register", registerHandler);

//LOGIN
router.post("/login", loginHandler);

module.exports = router;
