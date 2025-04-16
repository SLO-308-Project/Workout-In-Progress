import workoutServices from "../../src/services/workoutServices";
import sessionModel from "../../src/data/session";
// import machineModel from "../../src/data/machine";
import {Types} from "mongoose";

describe("Workout Services Tests", () =>
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

    // Clean up database entries
    afterEach(async () =>
    {});

    test("Get workout --- successful", async () =>
    {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const machineId = "6458a28d1f3d7c9a8e1b2c46";
        const session = new sessionModel({
            _id: new Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
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
        sessionModel.findById = jest.fn().mockResolvedValue(session);
        const result = await workoutServices.getWorkout(sessionId);
        expect(result).toBeTruthy();
        expect(result![0].machineId.toString()).toBe(machineId);
        expect(result![0].sets.length).toBe(4);
    });

    test("Remove workout --- successful", async () =>
    {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        const session = new sessionModel({
            _id: new Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
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
        sessionModel.findOne = jest.fn().mockResolvedValue(session);
        jest.spyOn(sessionModel.prototype, "save").mockResolvedValue(session);
        const result = await workoutServices.removeWorkout(
            sessionId,
            workoutId,
        );
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!._id!.toString()).toBe(sessionId);
    });

    test("Add workout", async () =>
    {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const machineId = "61f12342cf4b93ee8b0b37d4";
        const session = new sessionModel({
            _id: new Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
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
        sessionModel.findOne = jest.fn().mockResolvedValue(session);
        jest.spyOn(sessionModel.prototype, "save").mockResolvedValue(session);
        const result = await workoutServices.addWorkout(machineId, sessionId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!.workout.length).toBe(2);
    });

    // These tests exist to hit the catch blocks
    test("Get workout --- failure (session id not found)", async () =>
    {
        sessionModel.findById = jest.fn().mockResolvedValue(null);
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const result = await workoutServices.getWorkout(sessionId);
        expect(result).toBeFalsy();
    });

    test("Get workout --- failure (session error)", async () =>
    {
        sessionModel.findById = jest.fn().mockImplementation(async () =>
        {
            await Promise.reject(new Error("boom"));
        });
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const result = await workoutServices.getWorkout(sessionId);
        expect(result).toBeNull();
    });

    test("Remove workout --- failure (session not found)", async () =>
    {
        const sessionId = "";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        try
        {
            await workoutServices.removeWorkout(sessionId, workoutId);
            fail("Test Should Not Be Here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Remove workout --- failure (session not found)", async () =>
    {
        sessionModel.findOne = jest.fn().mockResolvedValue(null);
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        const result = await workoutServices.removeWorkout(
            sessionId,
            workoutId,
        );
        expect(result).toBeFalsy();
    });

    test("Remove workout --- failure (session error)", async () =>
    {
        sessionModel.findOne = jest.fn().mockImplementation(async () =>
        {
            await Promise.reject(new Error("boom"));
        });
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        const result = await workoutServices.removeWorkout(
            sessionId,
            workoutId,
        );
        expect(result).toBeNull();
    });

    test("Add workout --- failure (session id not found)", async () =>
    {
        sessionModel.findOne = jest.fn().mockResolvedValue(null);
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const machineId = "61f12342cf4b93ee8b0b37d4";
        const result = await workoutServices.addWorkout(machineId, sessionId);
        expect(result).toBeFalsy();
    });

    test("Add workout --- failure (session id not found)", async () =>
    {
        sessionModel.findOne = jest.fn().mockImplementation(async () =>
        {
            await Promise.reject(new Error("boom"));
        });
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const machineId = "61f12342cf4b93ee8b0b37d4";
        const result = await workoutServices.addWorkout(machineId, sessionId);
        expect(result).toBeNull();
    });
});
