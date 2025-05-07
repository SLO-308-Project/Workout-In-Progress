"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const templateServices_1 = __importDefault(require("../services/templateServices"));
const router = (0, express_1.Router)();
router.delete("/:id", (req, res) => {
    templateServices_1.default
        .deleteTemplate(req.params.id)
        .then((result) => {
        if (result == null) {
            return res.status(404).send("Session not found");
        }
        else {
            return res.status(204).send();
        }
    })
        .catch((err) => {
        console.log(err);
        return res.status(400).send("Bad Request: " + err);
    });
});
exports.default = router;
