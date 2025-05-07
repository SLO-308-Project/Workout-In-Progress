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
const workoutServices_1 = __importDefault(require("../../src/services/workoutServices"));
const session_1 = __importDefault(require("../../src/data/session"));
// import machineModel from "../../src/data/machine";
const mongoose_1 = require("mongoose");
const sessionTemplate_1 = __importDefault(require("../../src/data/sessionTemplate"));
describe("Workout Services Tests", () => {
    // In memory database setup
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () { }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () { }));
    // Build in memory database for tests
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // Clean up database entries
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () { }));
    test("Get workout --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const machineId = "6458a28d1f3d7c9a8e1b2c46";
        const session = new session_1.default({
            _id: new mongoose_1.Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
            date: new Date("2025-03-08T12:45:00.000Z"),
            time: 6000,
            workout: [
                {
                    machineId: new mongoose_1.Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
                    sets: [
                        { reps: 12, weight: 200 },
                        { reps: 10, weight: 220 },
                        { reps: 8, weight: 240 },
                        { reps: 6, weight: 260 },
                    ],
                },
            ],
        });
        session_1.default.findById = jest.fn().mockResolvedValue(session);
        const result = yield workoutServices_1.default.getWorkout(sessionId);
        expect(result).toBeTruthy();
        expect(result[0].machineId.toString()).toBe(machineId);
        expect(result[0].sets.length).toBe(4);
    }));
    test("Remove workout --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        const session = new session_1.default({
            _id: new mongoose_1.Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
            date: new Date("2025-03-08T12:45:00.000Z"),
            time: 6000,
            workout: [
                {
                    machineId: new mongoose_1.Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
                    sets: [
                        { reps: 12, weight: 200 },
                        { reps: 10, weight: 220 },
                        { reps: 8, weight: 240 },
                        { reps: 6, weight: 260 },
                    ],
                },
            ],
        });
        session_1.default.findOne = jest.fn().mockResolvedValue(session);
        jest.spyOn(session_1.default.prototype, "save").mockResolvedValue(session);
        const result = yield workoutServices_1.default.removeWorkout(sessionId, workoutId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result._id.toString()).toBe(sessionId);
    }));
    test("Add workout", () => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const machineId = "61f12342cf4b93ee8b0b37d4";
        const session = new session_1.default({
            _id: new mongoose_1.Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
            date: new Date("2025-03-08T12:45:00.000Z"),
            time: 6000,
            workout: [
                {
                    machineId: new mongoose_1.Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
                    sets: [
                        { reps: 12, weight: 200 },
                        { reps: 10, weight: 220 },
                        { reps: 8, weight: 240 },
                        { reps: 6, weight: 260 },
                    ],
                },
            ],
        });
        session_1.default.findOne = jest.fn().mockResolvedValue(session);
        jest.spyOn(session_1.default.prototype, "save").mockResolvedValue(session);
        const result = yield workoutServices_1.default.addWorkout(machineId, sessionId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result.workout.length).toBe(2);
    }));
    test("Save workout", () => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const templateId = "61f12342cf4b93ee8b0b37d4";
        const index = 0;
        const saveWorkout = {
            machineId: new mongoose_1.Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
            sets: [
                {
                    attributeValues: [
                        { name: "reps", value: 12 },
                        { name: "weight", value: 200 },
                    ],
                },
                {
                    attributeValues: [
                        { name: "reps", value: 10 },
                        { name: "weight", value: 220 },
                    ],
                },
                {
                    attributeValues: [
                        { name: "reps", value: 8 },
                        { name: "weight", value: 240 },
                    ],
                },
                {
                    attributeValues: [
                        { name: "reps", value: 6 },
                        { name: "weight", value: 260 },
                    ],
                },
            ],
        };
        const session = new session_1.default({
            _id: new mongoose_1.Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
            date: new Date("2025-03-08T12:45:00.000Z"),
            time: 6000,
            workout: [saveWorkout],
        });
        const template = new sessionTemplate_1.default({
            _id: new mongoose_1.Types.ObjectId(templateId),
            machineIds: [],
            workout: [saveWorkout],
        });
        session_1.default.findById = jest.fn().mockResolvedValue(session);
        sessionTemplate_1.default.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(template);
        const result = yield workoutServices_1.default.saveWorkout(templateId, sessionId, index);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        for (let i = 0; i < saveWorkout.sets.length; i++) {
            expect(result === null || result === void 0 ? void 0 : result.sets[i].attributeValues[0].name).toBe(saveWorkout.sets[i].attributeValues[0].name);
            expect(result === null || result === void 0 ? void 0 : result.sets[i].attributeValues[0].value).toBe(saveWorkout.sets[i].attributeValues[0].value);
            expect(result === null || result === void 0 ? void 0 : result.sets[i].attributeValues[1].name).toBe(saveWorkout.sets[i].attributeValues[1].name);
            expect(result === null || result === void 0 ? void 0 : result.sets[i].attributeValues[1].value).toBe(saveWorkout.sets[i].attributeValues[1].value);
        }
    }));
    test("Remove saved workout", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const saveWorkout = {
            machineId: new mongoose_1.Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
            sets: [
                {
                    attributeValues: [
                        { name: "reps", value: 12 },
                        { name: "weight", value: 200 },
                    ],
                },
                {
                    attributeValues: [
                        { name: "reps", value: 10 },
                        { name: "weight", value: 220 },
                    ],
                },
                {
                    attributeValues: [
                        { name: "reps", value: 8 },
                        { name: "weight", value: 240 },
                    ],
                },
                {
                    attributeValues: [
                        { name: "reps", value: 6 },
                        { name: "weight", value: 260 },
                    ],
                },
            ],
        };
        const index = 0;
        const template = new sessionTemplate_1.default({
            machineIds: [],
            workout: [saveWorkout],
        });
        const templateId = ((_a = template._id) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        sessionTemplate_1.default.findById = jest.fn().mockResolvedValue(template);
        jest.spyOn(sessionTemplate_1.default.prototype, "save").mockResolvedValue(template);
        const result = yield workoutServices_1.default.removeSavedWorkout(templateId, index);
        console.log(result);
        expect(result).toBeTruthy();
        expect(result === null || result === void 0 ? void 0 : result.workout.length).toBe(0);
    }));
    test("Get saved workout", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const workout = {
            machineId: new mongoose_1.Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
            sets: [
                {
                    attributeValues: [
                        { name: "reps", value: 12 },
                        { name: "weight", value: 200 },
                    ],
                },
            ],
        };
        const template = new sessionTemplate_1.default({
            machineIds: [],
            workout: [workout, workout, workout],
        });
        const templateId = ((_a = template._id) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        sessionTemplate_1.default.findById = jest.fn().mockResolvedValue(template);
        const result = yield workoutServices_1.default.getSavedWorkout(templateId);
        expect(result).toBeTruthy();
        expect(result === null || result === void 0 ? void 0 : result.length).toBe(3);
    }));
    // These tests exist to hit the catch blocks
    test("Get workout --- failure (session id not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        session_1.default.findById = jest.fn().mockResolvedValue(null);
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const result = yield workoutServices_1.default.getWorkout(sessionId);
        expect(result).toBeFalsy();
    }));
    test("Get workout --- failure (session error)", () => __awaiter(void 0, void 0, void 0, function* () {
        session_1.default.findById = jest.fn().mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.reject(new Error("boom"));
        }));
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const result = yield workoutServices_1.default.getWorkout(sessionId);
        expect(result).toBeNull();
    }));
    test("Remove workout --- failure (session not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = "";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        try {
            yield workoutServices_1.default.removeWorkout(sessionId, workoutId);
            fail("Test Should Not Be Here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
    }));
    test("Remove workout --- failure (session not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        session_1.default.findOne = jest.fn().mockResolvedValue(null);
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        const result = yield workoutServices_1.default.removeWorkout(sessionId, workoutId);
        expect(result).toBeFalsy();
    }));
    test("Remove workout --- failure (session error)", () => __awaiter(void 0, void 0, void 0, function* () {
        session_1.default.findOne = jest.fn().mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.reject(new Error("boom"));
        }));
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        const result = yield workoutServices_1.default.removeWorkout(sessionId, workoutId);
        expect(result).toBeNull();
    }));
    test("Add workout --- failure (session id not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        session_1.default.findOne = jest.fn().mockResolvedValue(null);
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const machineId = "61f12342cf4b93ee8b0b37d4";
        const result = yield workoutServices_1.default.addWorkout(machineId, sessionId);
        expect(result).toBeFalsy();
    }));
    test("Add workout --- failure (session id not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        session_1.default.findOne = jest.fn().mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.reject(new Error("boom"));
        }));
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const machineId = "61f12342cf4b93ee8b0b37d4";
        const result = yield workoutServices_1.default.addWorkout(machineId, sessionId);
        expect(result).toBeNull();
    }));
    test("Save workout --- failure (session id not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = "";
        const templateId = "61f12342cf4b93ee8b0b37d4";
        const index = 0;
        session_1.default.findById = jest.fn().mockResolvedValue(null);
        const result = yield workoutServices_1.default.saveWorkout(templateId, sessionId, index);
        expect(result).toBeFalsy();
    }));
    test("Save workout --- failure (index not in range)", () => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const templateId = "61f12342cf4b93ee8b0b37d4";
        const badIndex = -1000;
        const saveWorkout = {
            machineId: new mongoose_1.Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
            sets: [
                {
                    attributeValues: [
                        { name: "reps", value: 12 },
                        { name: "weight", value: 200 },
                    ],
                },
            ],
        };
        const session = new session_1.default({
            _id: new mongoose_1.Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
            date: new Date("2025-03-08T12:45:00.000Z"),
            time: 6000,
            workout: [saveWorkout],
        });
        session_1.default.findById = jest.fn().mockResolvedValue(session);
        const result = yield workoutServices_1.default.saveWorkout(templateId, sessionId, badIndex);
        expect(result).toBeFalsy();
    }));
    test("Save workout --- failure (tempalte id not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const templateId = "";
        const index = 0;
        const saveWorkout = {
            machineId: new mongoose_1.Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
            sets: [
                {
                    attributeValues: [
                        { name: "reps", value: 12 },
                        { name: "weight", value: 200 },
                    ],
                },
            ],
        };
        const session = new session_1.default({
            _id: new mongoose_1.Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
            date: new Date("2025-03-08T12:45:00.000Z"),
            time: 6000,
            workout: [saveWorkout],
        });
        session_1.default.findById = jest.fn().mockResolvedValue(session);
        sessionTemplate_1.default.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(null);
        const result = yield workoutServices_1.default.saveWorkout(templateId, sessionId, index);
        expect(result).toBeFalsy();
    }));
    test("Remove saved workout --- failure (no template id found)", () => __awaiter(void 0, void 0, void 0, function* () {
        const index = 0;
        const templateId = "";
        sessionTemplate_1.default.findById = jest.fn().mockResolvedValue(null);
        const result = yield workoutServices_1.default.removeSavedWorkout(templateId, index);
        expect(result).toBeFalsy();
    }));
    test("Remove saved workout --- failure (bad index)", () => __awaiter(void 0, void 0, void 0, function* () {
        const index = -1000;
        const template = new sessionTemplate_1.default({
            machineIds: [],
            workout: [],
        });
        const templateId = "";
        sessionTemplate_1.default.findById = jest.fn().mockResolvedValue(template);
        const result = yield workoutServices_1.default.removeSavedWorkout(templateId, index);
        expect(result).toBeFalsy();
    }));
    test("Get saved workout --- failure (template id not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        const templateId = "";
        sessionTemplate_1.default.findById = jest.fn().mockResolvedValue(null);
        const result = yield workoutServices_1.default.getSavedWorkout(templateId);
        expect(result).toBeFalsy();
    }));
});
