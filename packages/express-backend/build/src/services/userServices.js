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
const machineLog_1 = __importDefault(require("../data/machineLog"));
const user_1 = __importDefault(require("../data/user"));
const sessionLog_1 = __importDefault(require("../data/sessionLog"));
const templateList_1 = __importDefault(require("../data/templateList"));
/**
 * Create logs for machines, sessions, and templates for a user
 *
 * @param {UserType} user - User logs are being added to
 * @returns {Promise} - Create session, machine, and template logs
 */
function createUserLogs(user) {
    const createdSessionLog = new sessionLog_1.default()
        .save()
        .then((result) => {
        user.sessionLogId = result._id;
        return;
    })
        .catch((error) => {
        console.log("create empty sessionLog error: " + error);
        throw error;
    });
    const createdMachineLog = new machineLog_1.default()
        .save()
        .then((result) => {
        user.machineLogId = result._id;
    })
        .catch((error) => {
        console.log("create empty machineLog error: " + error);
        throw error;
    });
    const createdTemplateLog = new templateList_1.default()
        .save()
        .then((result) => {
        user.templateListId = result._id;
    })
        .catch((error) => {
        console.log("create empty templateLog erorr: " + error);
        throw error;
    });
    return Promise.all(
    //returns a promise where all promises are complete.
    [
        //create sessionLog and update user.
        createdSessionLog,
        createdMachineLog,
        createdTemplateLog,
    ]);
}
/**
 * Add a new user
 *
 * @param {UserType} user - User to be added
 * @returns {Promise} - Add user
 */
function addUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return createUserLogs(user).then(() => {
            //both the machine and session logs have been created.
            const userToAdd = new user_1.default(user);
            const prom = userToAdd.save();
            return prom;
        });
    });
}
// Optional includePassword for auth checks since schema set to hide password from select
function getUser(email_1) {
    return __awaiter(this, arguments, void 0, function* (email, includePassword = false) {
        let query = user_1.default.findOne({ email });
        if (includePassword) {
            query = query.select("+password");
        }
        return query;
    });
}
exports.default = {
    addUser,
    getUser,
};
