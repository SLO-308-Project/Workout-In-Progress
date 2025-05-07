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
const workoutServices_1 = __importDefault(require("../../src/services/workoutServices"));
const session_1 = __importDefault(require("../../src/data/session"));
const mongoose_1 = require("mongoose");
const machine_1 = __importDefault(require("../../src/data/machine"));
describe("Workout Services Tests", () => {
    // In memory database setup
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_memory_server_config_1.connect)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_memory_server_config_1.close)();
    }));
    // Build in memory database for tests
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Session entry needed for most workout functionality
        const dummySession = new session_1.default({
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
        yield dummySession.save();
        // Machine entry needed for adding workout
        const dummyMachine = new machine_1.default({
            _id: new mongoose_1.Types.ObjectId("61f12342cf4b93ee8b0b37d4"),
            name: "Treadmill",
            muscle: "Hamstring",
            attributes: [
                {
                    name: "calories",
                    unit: "cal",
                },
            ],
        });
        yield dummyMachine.save();
    }));
    // Clean up database entries
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield session_1.default.deleteMany();
        yield machine_1.default.deleteMany();
    }));
    test("Get workout --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const machineId = "6458a28d1f3d7c9a8e1b2c46";
        const result = yield workoutServices_1.default.getWorkout(sessionId);
        expect(result).toBeTruthy();
        expect(result[0].machineId.toString()).toBe(machineId);
        expect(result[0].sets.length).toBe(4);
    }));
    test("Remove workout --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        const result = yield workoutServices_1.default.removeWorkout(sessionId, workoutId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result._id.toString()).toBe(sessionId);
    }));
    test("Add workout", () => __awaiter(void 0, void 0, void 0, function* () {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const machineId = "61f12342cf4b93ee8b0b37d4";
        const result = yield workoutServices_1.default.addWorkout(machineId, sessionId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result.workout.length).toBe(2);
    }));
    // These tests exist to hit the catch blocks
    test("Get workout --- failure (session id not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // invalid session id forces error
            const sessionId = "6458a28d1f3d7c9a8e1b2c46";
            yield workoutServices_1.default.getWorkout(sessionId);
            fail("Test shouldn't get here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
    }));
    test("Get workout --- failure (invalid session id)", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // invalid session id forces error
            const sessionId = "";
            yield workoutServices_1.default.getWorkout(sessionId);
            fail("Test shouldn't get here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
    }));
    test("Remove workout --- failure (session id not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const sessionId = "6458a28d1f3d7c9a8e1b2c46";
            const workoutId = "6458a28d1f3d7c9a8e1b2c46";
            yield workoutServices_1.default.removeWorkout(sessionId, workoutId);
            fail("Test shouldn't get here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
    }));
    test("Remove workout --- failure (invalid session id)", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const sessionId = "";
            const workoutId = "6458a28d1f3d7c9a8e1b2c46";
            yield workoutServices_1.default.removeWorkout(sessionId, workoutId);
            fail("Test shouldn't get here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
    }));
    test("Add workout --- failure (session id not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // invalid session id forces error
            const sessionId = "6458a28d1f3d7c9a8e1b2c46";
            const machineId = "61f12342cf4b93ee8b0b37d4";
            yield workoutServices_1.default.addWorkout(machineId, sessionId);
            fail("Test shouldn't get here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
    }));
    test("Add workout --- failure (invalid session id)", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // invalid session id forces error
            const sessionId = "";
            const machineId = "61f12342cf4b93ee8b0b37d4";
            yield workoutServices_1.default.addWorkout(machineId, sessionId);
            fail("Test shouldn't get here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
    }));
});
