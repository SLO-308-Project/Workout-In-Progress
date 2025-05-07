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
const user_1 = __importDefault(require("../../src/data/user"));
const machineLog_1 = __importDefault(require("../../src/data/machineLog"));
const sessionLog_1 = __importDefault(require("../../src/data/sessionLog"));
const userServices_1 = __importDefault(require("../../src/services/userServices"));
const templateList_1 = __importDefault(require("../../src/data/templateList"));
describe("User Services Tests", () => {
    // In memory database setup
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () { }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () { }));
    // Build in memory database for tests
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // Clean up database entries for tests
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () { }));
    // userServices Tests
    test("Add user -- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const dummyUser = {
            name: "Person Guy",
            email: "pguy@gmail.com",
            password: "pass123",
        };
        const user = new user_1.default(dummyUser);
        const stubLog = {
            _id: "0",
        };
        jest.spyOn(user_1.default.prototype, "save").mockResolvedValue(user);
        jest.spyOn(machineLog_1.default.prototype, "save").mockResolvedValue(stubLog);
        jest.spyOn(sessionLog_1.default.prototype, "save").mockResolvedValue(stubLog);
        jest.spyOn(templateList_1.default.prototype, "save").mockResolvedValue(stubLog);
        const result = yield userServices_1.default.addUser(dummyUser);
        expect(result).toBeTruthy();
        expect(result.name).toBe(user.name);
        expect(result.email).toBe(user.email);
        expect(result).toHaveProperty("_id");
    }));
    test("Get User", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "pguy@gmail.com";
        const dummyUser = {
            name: "Person Guy",
            email: email,
            password: "pass123",
        };
        const user = new user_1.default(dummyUser);
        user_1.default.findOne = jest.fn().mockResolvedValue(user);
        const result = yield userServices_1.default.getUser(email);
        expect(result).toBeTruthy();
    }));
    // Add user - test to hit the catch blocks
    // Closes the connection to database to force an error to hit the catch blocks
    // Reconnects after test finishes
    test("Add user -- failure (save error)", () => __awaiter(void 0, void 0, void 0, function* () {
        const dummyUser = {
            name: "Person Guy",
            email: "pguy@gmail.com",
            password: "1234",
            sessionLogId: undefined,
            machineLogId: undefined,
        };
        const user = new user_1.default(dummyUser);
        jest.spyOn(user_1.default.prototype, "save").mockResolvedValue(user);
        jest.spyOn(machineLog_1.default.prototype, "save").mockResolvedValue(undefined);
        jest.spyOn(sessionLog_1.default.prototype, "save").mockResolvedValue(undefined);
        jest.spyOn(templateList_1.default.prototype, "save").mockResolvedValue(undefined);
        try {
            yield userServices_1.default.addUser(dummyUser);
            fail("Test shouldn't get here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
    }));
    test("Get User Include", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "pguy@gmail.com";
        const dummyUser = {
            name: "Person Guy",
            email: email,
            password: "pass123",
        };
        const user = new user_1.default(dummyUser);
        const mockSelect = jest.fn().mockReturnValue(user.password);
        user_1.default.findOne = jest
            .fn()
            .mockReturnValue({ user, select: mockSelect });
        const result = yield userServices_1.default.getUser(email, true);
        expect(result).toBeTruthy();
        expect(result).toBe(dummyUser.password);
    }));
});
