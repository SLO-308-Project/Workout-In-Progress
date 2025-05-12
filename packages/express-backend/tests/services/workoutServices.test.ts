import workoutServices from "../../src/services/workoutServices";
import sessionModel from "../../src/data/session";
import userModel from "../../src/data/user";
// import machineModel from "../../src/data/machine";
import {Types} from "mongoose";
import sessionTemplateModel from "../../src/data/sessionTemplate";

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
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
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
        userModel.aggregate = jest.fn().mockResolvedValue([session]);
        sessionModel.findById = jest.fn().mockResolvedValue(session);
        const result = await workoutServices.getWorkout(sessionId, stubUserId);
        expect(result).toBeTruthy();
        expect(result![0].machineId.toString()).toBe(machineId);
        expect(result![0].sets.length).toBe(4);
    });

    test("Remove workout --- successful", async () =>
    {
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
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
        userModel.aggregate = jest.fn().mockResolvedValue([session]);
        sessionModel.findOne = jest.fn().mockResolvedValue(session);
        jest.spyOn(sessionModel.prototype, "save").mockResolvedValue(session);
        const result = await workoutServices.removeWorkout(
            sessionId,
            workoutId,
            stubUserId,
        );
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!._id!.toString()).toBe(sessionId);
    });

    test("Add workout", async () =>
    {
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
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
        userModel.aggregate = jest.fn().mockResolvedValue([session]);
        sessionModel.findOne = jest.fn().mockResolvedValue(session);
        jest.spyOn(sessionModel.prototype, "save").mockResolvedValue(session);
        const result = await workoutServices.addWorkout(
            machineId,
            sessionId,
            stubUserId,
        );
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!.workout.length).toBe(2);
    });

    test("Save workout", async () =>
    {
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const templateId = "61f12342cf4b93ee8b0b37d4";
        const index = 0;
        const saveWorkout = {
            machineId: new Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
            sets: [
                {
                    attributeValues: [
                        {name: "reps", value: 12},
                        {name: "weight", value: 200},
                    ],
                },
                {
                    attributeValues: [
                        {name: "reps", value: 10},
                        {name: "weight", value: 220},
                    ],
                },
                {
                    attributeValues: [
                        {name: "reps", value: 8},
                        {name: "weight", value: 240},
                    ],
                },
                {
                    attributeValues: [
                        {name: "reps", value: 6},
                        {name: "weight", value: 260},
                    ],
                },
            ],
        };
        const session = new sessionModel({
            _id: new Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
            date: new Date("2025-03-08T12:45:00.000Z"),
            time: 6000,
            workout: [saveWorkout],
        });
        const template = new sessionTemplateModel({
            _id: new Types.ObjectId(templateId),
            machineIds: [],
            workout: [saveWorkout],
        });
        userModel.aggregate = jest.fn().mockResolvedValue([session]);
        sessionModel.findById = jest.fn().mockResolvedValue(session);
        sessionTemplateModel.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(template);
        const result = await workoutServices.saveWorkout(
            templateId,
            sessionId,
            index,
            stubUserId,
        );
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        for (let i = 0; i < saveWorkout.sets.length; i++)
        {
            expect(result?.sets[i].attributeValues[0].name).toBe(
                saveWorkout.sets[i].attributeValues[0].name,
            );
            expect(result?.sets[i].attributeValues[0].value).toBe(
                saveWorkout.sets[i].attributeValues[0].value,
            );
            expect(result?.sets[i].attributeValues[1].name).toBe(
                saveWorkout.sets[i].attributeValues[1].name,
            );
            expect(result?.sets[i].attributeValues[1].value).toBe(
                saveWorkout.sets[i].attributeValues[1].value,
            );
        }
    });

    test("Remove saved workout", async () =>
    {
        const saveWorkout = {
            machineId: new Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
            sets: [
                {
                    attributeValues: [
                        {name: "reps", value: 12},
                        {name: "weight", value: 200},
                    ],
                },
                {
                    attributeValues: [
                        {name: "reps", value: 10},
                        {name: "weight", value: 220},
                    ],
                },
                {
                    attributeValues: [
                        {name: "reps", value: 8},
                        {name: "weight", value: 240},
                    ],
                },
                {
                    attributeValues: [
                        {name: "reps", value: 6},
                        {name: "weight", value: 260},
                    ],
                },
            ],
        };
        const index = 0;
        const template = new sessionTemplateModel({
            machineIds: [],
            workout: [saveWorkout],
        });
        const templateId = template._id?.toString() || "";
        sessionTemplateModel.findById = jest.fn().mockResolvedValue(template);
        jest.spyOn(sessionTemplateModel.prototype, "save").mockResolvedValue(
            template,
        );
        const result = await workoutServices.removeSavedWorkout(
            templateId,
            index,
        );
        console.log(result);
        expect(result).toBeTruthy();
        expect(result?.workout.length).toBe(0);
    });

    test("Get saved workout", async () =>
    {
        const workout = {
            machineId: new Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
            sets: [
                {
                    attributeValues: [
                        {name: "reps", value: 12},
                        {name: "weight", value: 200},
                    ],
                },
            ],
        };
        const template = new sessionTemplateModel({
            machineIds: [],
            workout: [workout, workout, workout],
        });
        const templateId = template._id?.toString() || "";
        sessionTemplateModel.findById = jest.fn().mockResolvedValue(template);
        const result = await workoutServices.getSavedWorkout(templateId);
        expect(result).toBeTruthy();
        expect(result?.length).toBe(3);
    });

    // These tests exist to hit the catch blocks
    test("Get workout --- failure (session id not found)", async () =>
    {
        userModel.aggregate = jest.fn().mockResolvedValue([]);
        sessionModel.findById = jest.fn().mockResolvedValue(null);
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        const result = await workoutServices.getWorkout(sessionId, stubUserId);
        expect(result).toBeFalsy();
    });

    test("Get workout --- failure (session error)", async () =>
    {
        userModel.aggregate = jest.fn().mockResolvedValue([null]);
        sessionModel.findById = jest.fn().mockImplementation(async () =>
        {
            await Promise.reject(new Error("boom"));
        });
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        const result = await workoutServices.getWorkout(sessionId, stubUserId);
        expect(result).toBeNull();
    });

    test("Remove workout --- failure (session not found)", async () =>
    {
        const sessionId = "";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        try
        {
            await workoutServices.removeWorkout(
                sessionId,
                workoutId,
                stubUserId,
            );
            fail("Test Should Not Be Here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Remove workout --- failure (session not found)", async () =>
    {
        userModel.aggregate = jest.fn().mockResolvedValue([]);
        sessionModel.findOne = jest.fn().mockResolvedValue(null);
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        const result = await workoutServices.removeWorkout(
            sessionId,
            workoutId,
            stubUserId,
        );
        expect(result).toBeFalsy();
    });

    test("Remove workout --- failure (session error)", async () =>
    {
        userModel.aggregate = jest.fn().mockResolvedValue([]);
        sessionModel.findOne = jest.fn().mockImplementation(async () =>
        {
            await Promise.reject(new Error("boom"));
        });
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const workoutId = "6458a28d1f3d7c9a8e1b2c46";
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        const result = await workoutServices.removeWorkout(
            sessionId,
            workoutId,
            stubUserId,
        );
        expect(result).toBeNull();
    });

    test("Add workout --- failure (session id not found)", async () =>
    {
        userModel.aggregate = jest.fn().mockResolvedValue([]);
        sessionModel.findOne = jest.fn().mockResolvedValue(null);
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const machineId = "61f12342cf4b93ee8b0b37d4";
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        const result = await workoutServices.addWorkout(
            machineId,
            sessionId,
            stubUserId,
        );
        expect(result).toBeFalsy();
    });

    test("Add workout --- failure (session id not found)", async () =>
    {
        userModel.aggregate = jest.fn().mockResolvedValue([]);
        sessionModel.findOne = jest.fn().mockImplementation(async () =>
        {
            await Promise.reject(new Error("boom"));
        });
        const sessionId = "6458a28d1f3d7c9a8e1b2c46";
        const machineId = "61f12342cf4b93ee8b0b37d4";
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        const result = await workoutServices.addWorkout(
            machineId,
            sessionId,
            stubUserId,
        );
        expect(result).toBeNull();
    });
    test("Save workout --- failure (session id not found)", async () =>
    {
        const sessionId = "";
        const templateId = "61f12342cf4b93ee8b0b37d4";
        const index = 0;
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        userModel.aggregate = jest.fn().mockResolvedValue([]);
        sessionModel.findById = jest.fn().mockResolvedValue(null);
        const result = await workoutServices.saveWorkout(
            templateId,
            sessionId,
            index,
            stubUserId,
        );
        expect(result).toBeFalsy();
    });

    test("Save workout --- failure (index not in range)", async () =>
    {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const templateId = "61f12342cf4b93ee8b0b37d4";
        const badIndex = -1000;
        const saveWorkout = {
            machineId: new Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
            sets: [
                {
                    attributeValues: [
                        {name: "reps", value: 12},
                        {name: "weight", value: 200},
                    ],
                },
            ],
        };
        const session = new sessionModel({
            _id: new Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
            date: new Date("2025-03-08T12:45:00.000Z"),
            time: 6000,
            workout: [saveWorkout],
        });
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        userModel.aggregate = jest.fn().mockResolvedValue([session]);
        sessionModel.findById = jest.fn().mockResolvedValue(session);
        const result = await workoutServices.saveWorkout(
            templateId,
            sessionId,
            badIndex,
            stubUserId,
        );
        expect(result).toBeFalsy();
    });

    test("Save workout --- failure (tempalte id not found)", async () =>
    {
        const sessionId = "65f18f3ac6dc7f8d5a1234ab";
        const templateId = "";
        const index = 0;
        const saveWorkout = {
            machineId: new Types.ObjectId("6458a28d1f3d7c9a8e1b2c46"),
            sets: [
                {
                    attributeValues: [
                        {name: "reps", value: 12},
                        {name: "weight", value: 200},
                    ],
                },
            ],
        };
        const session = new sessionModel({
            _id: new Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
            date: new Date("2025-03-08T12:45:00.000Z"),
            time: 6000,
            workout: [saveWorkout],
        });
        const stubUserId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        userModel.aggregate = jest.fn().mockResolvedValue([session]);
        sessionModel.findById = jest.fn().mockResolvedValue(session);
        sessionTemplateModel.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(null);
        const result = await workoutServices.saveWorkout(
            templateId,
            sessionId,
            index,
            stubUserId,
        );
        expect(result).toBeFalsy();
    });

    test("Remove saved workout --- failure (no template id found)", async () =>
    {
        const index = 0;
        const templateId = "";
        sessionTemplateModel.findById = jest.fn().mockResolvedValue(null);
        const result = await workoutServices.removeSavedWorkout(
            templateId,
            index,
        );
        expect(result).toBeFalsy();
    });

    test("Remove saved workout --- failure (bad index)", async () =>
    {
        const index = -1000;
        const template = new sessionTemplateModel({
            machineIds: [],
            workout: [],
        });
        const templateId = "";
        sessionTemplateModel.findById = jest.fn().mockResolvedValue(template);
        const result = await workoutServices.removeSavedWorkout(
            templateId,
            index,
        );
        expect(result).toBeFalsy();
    });

    test("Get saved workout --- failure (template id not found)", async () =>
    {
        const templateId = "";
        sessionTemplateModel.findById = jest.fn().mockResolvedValue(null);
        const result = await workoutServices.getSavedWorkout(templateId);
        expect(result).toBeFalsy();
    });
});
