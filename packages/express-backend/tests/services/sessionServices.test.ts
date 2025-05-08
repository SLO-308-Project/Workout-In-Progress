import sessionModel from "../../src/data/session";
import sessionServices from "../../src/services/sessionServices";
import {Types} from "mongoose";

describe("Session Services Tests", () =>
{
    // In memory database setup
    beforeAll(async () =>
    {});

    afterAll(async () =>
    {});

    // Build in memory database for tests
    beforeEach(() =>
    {
        jest.clearAllMocks();
    });

    // Clean up database entries for tests
    afterEach(async () =>
    {});

    // sessionServices tests

    // Test get all sessions
    // Verify the amount of entries returned matches expected
    test("Get list of sessions --- successful", async () =>
    {
        const sessions = [
            new sessionModel(),
            new sessionModel(),
            new sessionModel(),
        ];
        sessionModel.find = jest.fn().mockResolvedValue(sessions);
        const result = await sessionServices.getAllSessions();
        expect(result.length).toBe(3);
    });

    // Get current session
    test("Get current session --- successful", async () =>
    {
        const sessions = [
            new sessionModel({
                date: new Date("2025-03-10T17:30:00.000Z"),
                time: 0,
                workout: [
                    {
                        machineId: new Types.ObjectId(
                            "6458a28d1f3d7c9a8e1b2c3e",
                        ),
                        sets: [
                            {reps: 12, weight: 180},
                            {reps: 10, weight: 200},
                            {reps: 8, weight: 220},
                        ],
                    },
                ],
            }),
        ];
        sessionModel.aggregate = jest.fn().mockResolvedValue(sessions);
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
        const session = new sessionModel({
            _id: new Types.ObjectId(sessionId),
            time: 1,
        });
        sessionModel.findOneAndUpdate = jest.fn().mockResolvedValue(session);
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
        const session = new sessionModel({
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
        });
        // Store ID - check if exists or empty for type safety
        const sessionId = session._id?.toString() || "";

        sessionModel.findById = jest.fn().mockResolvedValue(session);
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
        const session = new sessionModel({
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
        jest.spyOn(sessionModel.prototype, "save").mockResolvedValue(session);
        const result = await sessionServices.addSession(session);
        expect(result).toBeTruthy();
        expect(result.date).toBe(session.date);
        expect(result.time).toBe(session.time);
        expect(result).toHaveProperty("_id");
    });

    // Delete session
    test("Delete session by id --- successful", async () =>
    {
        const session = new sessionModel({
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
        });
        // Store ID - check if exists or empty for type safety
        const sessionId = session._id?.toString() || "";

        sessionModel.findByIdAndDelete = jest.fn().mockResolvedValue(session);
        const result = await sessionServices.deleteSession(sessionId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        // On successful delete mongoose returns the id
        expect(result!._id!.toString()).toBe(sessionId);
    });
});
