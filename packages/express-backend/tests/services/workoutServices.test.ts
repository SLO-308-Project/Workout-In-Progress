import {connect, close} from "../util/mongo-memory-server-config";
import workoutServices from "../../src/services/workoutServices";
import sessionModel from "../../src/data/session";
import {Types} from "mongoose";
import machineModel from "../../src/data/machine";

describe("Workout Services Tests", () => {
    // In memory database setup
    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await close();
    });

    // Build in memory database for tests
    beforeEach(async () => {
        // Session entry needed for most workout functionality
        const dummySession = new sessionModel ({
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
        await dummySession.save();

        // Machine entry needed for adding workout
        const dummyMachine = new machineModel({
            _id: new Types.ObjectId("61f12342cf4b93ee8b0b37d4"),
            name: "Treadmill",
            muscle: "Hamstring",
            attributes: [{
                name: "calories",
                unit: "cal",
            }]
        });
        await dummyMachine.save();
    });




    // Clean up database entries
    afterEach (async () => {
        await sessionModel.deleteMany();
        await machineModel.deleteMany();
    });

    test("Get workout --- successful", async () => {

        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const machineId = "6458a28d1f3d7c9a8e1b2c46";
        const result = await workoutServices.getWorkout(sessionId);
        expect(result).toBeTruthy();
        expect(result![0].machineId.toString()).toBe(machineId);
        expect(result![0].sets.length).toBe(4);
    });

    test("Remove workout --- successful", async () => {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        const result = await workoutServices.removeWorkout(sessionId, workoutId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!._id!.toString()).toBe(sessionId);
    });

    test("Add workout", async () => {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const machineId = "61f12342cf4b93ee8b0b37d4";
        const result = await workoutServices.addWorkout(machineId, sessionId);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!.workout.length).toBe(2);
    });


    // These tests exist to hit the catch blocks
    test("Get workout --- failure (session id not found)", async () => {
        try
        {
            // invalid session id forces error
            const sessionId = "6458a28d1f3d7c9a8e1b2c46";
            await workoutServices.getWorkout(sessionId);
            fail("Test shouldn't get here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Get workout --- failure (invalid session id)", async () => {
        try
        {
            // invalid session id forces error
            const sessionId = "";
            await workoutServices.getWorkout(sessionId);
            fail("Test shouldn't get here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Remove workout --- failure (session id not found)", async () => {
        try
        {
            const sessionId = "6458a28d1f3d7c9a8e1b2c46";
            const workoutId = "6458a28d1f3d7c9a8e1b2c46";
            await workoutServices.removeWorkout(sessionId, workoutId);
            fail("Test shouldn't get here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Remove workout --- failure (invalid session id)", async () => {
        try
        {
            const sessionId = "";
            const workoutId = "6458a28d1f3d7c9a8e1b2c46";
            await workoutServices.removeWorkout(sessionId, workoutId);
            fail("Test shouldn't get here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Add workout --- failure (session id not found)", async () => {
        try
        {
            // invalid session id forces error
            const sessionId = "6458a28d1f3d7c9a8e1b2c46";
            const machineId = "61f12342cf4b93ee8b0b37d4";
            await workoutServices.addWorkout(machineId, sessionId);
            fail("Test shouldn't get here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Add workout --- failure (invalid session id)", async () => {
        try
        {
            // invalid session id forces error
            const sessionId = "";
            const machineId = "61f12342cf4b93ee8b0b37d4";
            await workoutServices.addWorkout(machineId, sessionId);
            fail("Test shouldn't get here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });
});