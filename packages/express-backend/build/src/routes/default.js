"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { userType } from "../data/user";
// all start with /machines
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    console.log(req);
    res.status(201).send("Helo world");
});
exports.default = router;
