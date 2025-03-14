import {connect, close} from "../util/mongo-memory-server-config";
import sessionModel from "../../src/data/session";
import sessionServices from "../../src/services/sessionServices";
import {Types} from "mongoose";

describe("Session Services Tests", () =>
{
    // In memory database setup
    beforeAll(async () =>
    {
        await connect();
    });

    afterAll(async () =>
    {
        await close();
    });

    // Build in memory database for tests
    beforeEach(async () =>
    {
        // Entry that mimics a current session entry
        const dummyCurrentSession = new sessionModel({
            _id: new Types.ObjectId("65f49b7c1d34a2e5f6c89d0a"),
            date: new Date("2025-03-10T12:40:00.000Z"),
            time: 0,
            workout: [
                {
                    machineId: new Types.ObjectId("65f3a12b7d8c4e9b2a1d5f7e"),
                    sets: [
                        {reps: 6, weight: 290},
                        {reps: 3, weight: 210},
                    ],
                },
            ],
        });
        await dummyCurrentSession.save();

        // Session entries
        let dummySession = new sessionModel({
            date: new Date("2025-03-10T17:30:00.000Z"),
            time: 0,
            workout: [
                {
                    machineId: new Types.ObjectId("6458a28d1f3d7c9a8e1b2c3e"),
                    sets: [
                        {reps: 12, weight: 180},
                        {reps: 10, weight: 200},
                        {reps: 8, weight: 220},
                    ],
                },
            ],
        });
        await dummySession.save();

        dummySession = new sessionModel({
            date: new Date("2025-03-05T08:15:00.000Z"),
            time: 4500,
            workout: [
                {
                    machineId: new Types.ObjectId("6458a28d1f3d7c9a8e1b2c41"),
                    sets: [
                        {reps: 15, weight: 80},
                        {reps: 12, weight: 90},
                        {reps: 10, weight: 100},
                    ],
                },
            ],
        });
        await dummySession.save();

        dummySession = new sessionModel({
            date: new Date("2025-03-07T17:30:00.000Z"),
            time: 3600,
            workout: [
                {
                    machineId: new Types.ObjectId("6458a28d1f3d7c9a8e1b2c44"),
                    sets: [
                        {reps: 20, weight: 100},
                        {reps: 15, weight: 120},
                        {reps: 12, weight: 140},
                    ],
                },
                {
                    machineId: new Types.ObjectId("6458a28d1f3d7c9a8e1b2c45"),
                    sets: [
                        {reps: 15, weight: 90},
                        {reps: 12, weight: 100},
                        {reps: 10, weight: 110},
                    ],
                },
            ],
        });
        await dummySession.save();

        dummySession = new sessionModel({
            date: new Date("2025-03-08T12:45:00.000Z"),
            time: 6000,
            workout: [
                {
                    machineId: new Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
                    sets: [
                        {reps: 12, weight: 200},
                        {reps: 10, weight: 220},
                        {reps: 8, weight: 240},
                        {reps: 6, weight: 260},
                    ],
                },
            ],
        });
        await dummySession.save();
    });

    // Clean up database entries for tests
    afterEach(async () =>
    {
        await sessionModel.deleteMany();
    });

    // sessionServices tests

    // Test get all sessions
    // Verify the amount of entries returned matches expected
    test("Get list of sessions --- successful", async () =>
    {
        const result = await sessionServices.getAllSessions();
        expect(result.length).toBe(5);
    });

    // Get current session
    test("Get current session --- successful", async () =>
    {
        const result = await sessionServices.getCurrentSession();
        expect(result).toBeTruthy();
        expect(result.length).toBe(1);
        expect(result[0].time).toBe(0);
        expect(result[0].date).toEqual(new Date("2025-03-10T17:30:00.000Z"));
        expect(result[0].workout).toBeDefined();
        expect(result[0].workout.length).toBe(1);
    });

    // End current session
    // Build a current session to end so we can get the generated session id
    test("End current session --- successful", async () =>
    {
        // Store ID - check if exists or empty for type safety
        const sessionId = "65f49b7c1d34a2e5f6c89d0a";
        const result = await sessionServices.endSession(sessionId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!._id!.toString()).toBe(sessionId);
        expect(result!.time).toBeGreaterThan(0);
    });

    // Get session by ID
    // Build a new session into the database to extract auto generated ID
    test("Get session by ID --- successful", async () =>
    {
        const dummySession = {
            date: new Date("2025-01-08T12:45:00.000Z"),
            time: 3246,
            workout: [
                {
                    machineId: new Types.ObjectId("60a9c8d7e6f5b4a3c2d1e0f9"),
                    sets: [
                        {reps: 3, weight: 20},
                        {reps: 1, weight: 22},
                    ],
                },
            ],
        };
        const res = new sessionModel(dummySession);
        await res.save();
        // Store ID - check if exists or empty for type safety
        const sessionId = res._id?.toString() || "";

        const result = await sessionServices.getSessionById(sessionId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!.time).toBe(3246);
        expect(result!.date).toEqual(new Date("2025-01-08T12:45:00.000Z"));
        expect(result!.workout).toBeDefined();
        expect(result!.workout.length).toBe(1);
    });

    // Add session
    // Verify session is added and data matches
    test("Add session --- successful", async () =>
    {
        const dummySession = new sessionModel({
            date: new Date("2025-03-10T15:20:00.000Z"),
            time: 3900,
            workout: [
                {
                    machineId: new Types.ObjectId("5f4e3d2c1b0a9876543210fe"),
                    sets: [
                        {reps: 18, weight: 95},
                        {reps: 15, weight: 110},
                    ],
                },
            ],
        });
        const result = await sessionServices.addSession(dummySession);
        expect(result).toBeTruthy();
        expect(result.date).toBe(dummySession.date);
        expect(result.time).toBe(dummySession.time);
        expect(result).toHaveProperty("_id");
    });

    // Delete session
    test("Delete session by id --- successful", async () =>
    {
        const dummySession = {
            date: new Date("2025-03-18T12:45:00.000Z"),
            time: 1563,
            workout: [
                {
                    machineId: new Types.ObjectId("60a9c3d7e6f5b5a3c2d1e0f9"),
                    sets: [
                        {reps: 10, weight: 180},
                        {reps: 15, weight: 295},
                    ],
                },
            ],
        };
        const res = new sessionModel(dummySession);
        await res.save();
        // Store ID - check if exists or empty for type safety
        const sessionId = res._id?.toString() || "";

        const result = await sessionServices.deleteSession(sessionId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        // On successful delete mongoose returns the id
        expect(result!._id!.toString()).toBe(sessionId);
    });
});
