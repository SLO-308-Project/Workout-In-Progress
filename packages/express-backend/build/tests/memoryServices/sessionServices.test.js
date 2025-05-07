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
const session_1 = __importDefault(require("../../src/data/session"));
const sessionServices_1 = __importDefault(require("../../src/services/sessionServices"));
const mongoose_1 = require("mongoose");
describe("Session Services Tests", () => {
    // In memory database setup
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_memory_server_config_1.connect)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_memory_server_config_1.close)();
    }));
    // Build in memory database for tests
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Entry that mimics a current session entry
        const dummyCurrentSession = new session_1.default({
            _id: new mongoose_1.Types.ObjectId("65f49b7c1d34a2e5f6c89d0a"),
            date: new Date("2025-03-10T12:40:00.000Z"),
            time: 0,
            workout: [
                {
                    machineId: new mongoose_1.Types.ObjectId("65f3a12b7d8c4e9b2a1d5f7e"),
                    sets: [
                        { reps: 6, weight: 290 },
                        { reps: 3, weight: 210 },
                    ],
                },
            ],
        });
        yield dummyCurrentSession.save();
        // Session entries
        let dummySession = new session_1.default({
            date: new Date("2025-03-10T17:30:00.000Z"),
            time: 0,
            workout: [
                {
                    machineId: new mongoose_1.Types.ObjectId("6458a28d1f3d7c9a8e1b2c3e"),
                    sets: [
                        { reps: 12, weight: 180 },
                        { reps: 10, weight: 200 },
                        { reps: 8, weight: 220 },
                    ],
                },
            ],
        });
        yield dummySession.save();
        dummySession = new session_1.default({
            date: new Date("2025-03-05T08:15:00.000Z"),
            time: 4500,
            workout: [
                {
                    machineId: new mongoose_1.Types.ObjectId("6458a28d1f3d7c9a8e1b2c41"),
                    sets: [
                        { reps: 15, weight: 80 },
                        { reps: 12, weight: 90 },
                        { reps: 10, weight: 100 },
                    ],
                },
            ],
        });
        yield dummySession.save();
        dummySession = new session_1.default({
            date: new Date("2025-03-07T17:30:00.000Z"),
            time: 3600,
            workout: [
                {
                    machineId: new mongoose_1.Types.ObjectId("6458a28d1f3d7c9a8e1b2c44"),
                    sets: [
                        { reps: 20, weight: 100 },
                        { reps: 15, weight: 120 },
                        { reps: 12, weight: 140 },
                    ],
                },
                {
                    machineId: new mongoose_1.Types.ObjectId("6458a28d1f3d7c9a8e1b2c45"),
                    sets: [
                        { reps: 15, weight: 90 },
                        { reps: 12, weight: 100 },
                        { reps: 10, weight: 110 },
                    ],
                },
            ],
        });
        yield dummySession.save();
        dummySession = new session_1.default({
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
    }));
    // Clean up database entries for tests
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield session_1.default.deleteMany();
    }));
    // sessionServices tests
    // Test get all sessions
    // Verify the amount of entries returned matches expected
    test("Get list of sessions --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield sessionServices_1.default.getAllSessions();
        expect(result.length).toBe(5);
    }));
    // Get current session
    test("Get current session --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield sessionServices_1.default.getCurrentSession();
        expect(result).toBeTruthy();
        expect(result.length).toBe(1);
        expect(result[0].time).toBe(0);
        expect(result[0].date).toEqual(new Date("2025-03-10T17:30:00.000Z"));
        expect(result[0].workout).toBeDefined();
        expect(result[0].workout.length).toBe(1);
    }));
    // End current session
    // Build a current session to end so we can get the generated session id
    test("End current session --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        // Store ID - check if exists or empty for type safety
        const sessionId = "65f49b7c1d34a2e5f6c89d0a";
        const result = yield sessionServices_1.default.endSession(sessionId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result._id.toString()).toBe(sessionId);
        expect(result.time).toBeGreaterThan(0);
    }));
    // Get session by ID
    // Build a new session into the database to extract auto generated ID
    test("Get session by ID --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const dummySession = {
            date: new Date("2025-01-08T12:45:00.000Z"),
            time: 3246,
            workout: [
                {
                    machineId: new mongoose_1.Types.ObjectId("60a9c8d7e6f5b4a3c2d1e0f9"),
                    sets: [
                        { reps: 3, weight: 20 },
                        { reps: 1, weight: 22 },
                    ],
                },
            ],
        };
        const res = new session_1.default(dummySession);
        yield res.save();
        // Store ID - check if exists or empty for type safety
        const sessionId = ((_a = res._id) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        const result = yield sessionServices_1.default.getSessionById(sessionId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result.time).toBe(3246);
        expect(result.date).toEqual(new Date("2025-01-08T12:45:00.000Z"));
        expect(result.workout).toBeDefined();
        expect(result.workout.length).toBe(1);
    }));
    // Add session
    // Verify session is added and data matches
    test("Add session --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const dummySession = new session_1.default({
            date: new Date("2025-03-10T15:20:00.000Z"),
            time: 3900,
            workout: [
                {
                    machineId: new mongoose_1.Types.ObjectId("5f4e3d2c1b0a9876543210fe"),
                    sets: [
                        { reps: 18, weight: 95 },
                        { reps: 15, weight: 110 },
                    ],
                },
            ],
        });
        const result = yield sessionServices_1.default.addSession(dummySession);
        expect(result).toBeTruthy();
        expect(result.date).toBe(dummySession.date);
        expect(result.time).toBe(dummySession.time);
        expect(result).toHaveProperty("_id");
    }));
    // Delete session
    test("Delete session by id --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const dummySession = {
            date: new Date("2025-03-18T12:45:00.000Z"),
            time: 1563,
            workout: [
                {
                    machineId: new mongoose_1.Types.ObjectId("60a9c3d7e6f5b5a3c2d1e0f9"),
                    sets: [
                        { reps: 10, weight: 180 },
                        { reps: 15, weight: 295 },
                    ],
                },
            ],
        };
        const res = new session_1.default(dummySession);
        yield res.save();
        // Store ID - check if exists or empty for type safety
        const sessionId = ((_a = res._id) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        const result = yield sessionServices_1.default.deleteSession(sessionId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        // On successful delete mongoose returns the id
        expect(result._id.toString()).toBe(sessionId);
    }));
});
