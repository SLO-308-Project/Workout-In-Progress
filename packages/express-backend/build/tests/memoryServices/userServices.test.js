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
const mongo_memory_server_config_1 = require("../util/mongo-memory-server-config");
const user_1 = __importDefault(require("../../src/data/user"));
const userServices_1 = __importDefault(require("../../src/services/userServices"));
describe("User Services Tests", () => {
    // In memory database setup
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_memory_server_config_1.connect)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_memory_server_config_1.close)();
    }));
    // Build in memory database for tests
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        let dummyUser = new user_1.default({
            name: "Philip Buff",
            email: "pbuff@gmail.com",
            password: "pass123",
            units: "lbs",
        });
        yield dummyUser.save();
        dummyUser = new user_1.default({
            name: "Anna Bolick",
            email: "abolick@gmail.com",
            password: "pass1234",
            units: "kilos",
        });
        yield dummyUser.save();
        dummyUser = new user_1.default({
            name: "John Smith",
            email: "jsmith@gmail.com",
            password: "pass12",
            units: "lbs",
        });
        yield dummyUser.save();
        dummyUser = new user_1.default({
            name: "Jane Doe",
            email: "jdoe@gmail.com",
            password: "pass12345",
            units: "lbs",
        });
        yield dummyUser.save();
    }));
    // Clean up database entries for tests
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.deleteMany();
    }));
    // userServices Tests
    test("Add user -- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const dummyUser = {
            name: "Person Guy",
            email: "pguy@gmail.com",
            password: "password123",
            units: "lbs",
        };
        const result = yield userServices_1.default.addUser(dummyUser);
        expect(result).toBeTruthy();
        expect(result.name).toBe(dummyUser.name);
        expect(result.email).toBe(dummyUser.email);
        expect(result).toHaveProperty("_id");
    }));
    // Add user - test to hit the catch blocks
    // Closes the connection to database to force an error to hit the catch blocks
    // Reconnects after test finishes
    test("Add user -- failure (save error)", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_memory_server_config_1.close)();
        const dummyUser = {
            name: "Person Guy",
            email: "pguy@gmail.com",
            password: "password123!",
            units: "lbs",
            sessionLogId: undefined,
            machineLogId: undefined,
        };
        try {
            yield userServices_1.default.addUser(dummyUser);
            fail("Test shouldn't get here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
        finally {
            yield (0, mongo_memory_server_config_1.connect)();
        }
    }));
});
