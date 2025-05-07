"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const machineServices_1 = __importDefault(require("../services/machineServices"));
// import { userType } from "../data/user";
// all start with /machines
const router = (0, express_1.Router)();
//create machine.
//req.body of type machine.
/**req.body = machine =
 * {
 * name: String
 * muscle: String
 * }
 * */
router.post("/:userEmail/", (req, res) => {
    machineServices_1.default
        .addMachine(req.body, req.params.userEmail)
        .then((result) => {
        return res.status(201).send(result);
    })
        .catch((err) => {
        return res.status(400).send("Bad Request: " + err);
    });
});
//get machine.
//query parameters optional
//  name: string
//  muscle: string
//returns a list of machines.
router.get("/:userEmail/", (req, res) => {
    machineServices_1.default
        .getMachines(req.query.name, req.query.muscle, req.params.userEmail)
        .then((result) => {
        return res.status(200).send(result);
    })
        .catch((err) => {
        console.log(err);
        return res.send("Error: " + err);
    });
});
//delete machine by it's unique name.
//path variable.
//  name: string
router.delete("/:userEmail/:name", (req, res) => {
    machineServices_1.default
        .deleteMachine(req.params.userEmail, req.params.name)
        .then((result) => {
        if (result == null) {
            return res.status(404).send("Resource not found");
        }
        else {
            return res.status(204).send();
        }
    })
        .catch((err) => {
        res.status(400).send("Bad Request: " + err);
    });
});
//update machine by its unique name.
//Body can have any attribute of machineType.
//Cannot accept null or undefined attributes.
//result is the machine's previous values before update.
router.patch("/:userEmail/:name", (req, res) => {
    machineServices_1.default
        .updateMachine(req.params.userEmail, req.params.name, req.body)
        .then((result) => {
        return res.status(200).send(result);
    })
        .catch((err) => {
        res.status(400).send("Bad Request: " + err);
    });
});
// get attributes for a machineid
router.get("/:id/attributes", (req, res) => {
    machineServices_1.default
        .getAttributes(req.params.id)
        .then((result) => {
        return res.status(200).send(result);
    })
        .catch((err) => {
        res.status(400).send("Bad Request: " + err);
    });
});
// post an attribute for a machineid
router.post("/:id/attributes", (req, res) => {
    machineServices_1.default
        .addAttribute(req.params.id, req.body.name, req.body.unit)
        .then((result) => {
        return res.status(201).send(result);
    })
        .catch((err) => {
        console.log(err);
    });
});
// delete an attribute for a machineid given its name
router.delete("/:id/attributes/:attrName", (req, res) => {
    machineServices_1.default
        .deleteAttribute(req.params.id, req.params.attrName)
        .then((result) => {
        if (!result) {
            res.status(404).send();
        }
        else {
            res.status(204).send();
        }
    })
        .catch((err) => {
        console.log(err);
        res.status(400).send("Bad Request: " + err);
    });
});
exports.default = router;
