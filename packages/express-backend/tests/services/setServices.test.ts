import setServices from "../../src/services/setServices";
import sessionModel from "../../src/data/session";
import {Types} from "mongoose";

type AttributeValue = {
    name: string;
    value: number;
};

describe("Session Services Tests", () =>
{
    beforeAll(async () =>
    {});

    afterAll(async () =>
    {});

    beforeEach(() =>
    {
        jest.clearAllMocks();
    });

    afterEach(async () =>
    {});

    test("Get sets --- successful", async () =>
    {
        const workout = {
            _id: new Types.ObjectId(),
        };
        const session = new sessionModel({
            workout: [workout],
        });
        const sessionId = session._id?.toString() || "";
        const workoutId = workout._id?.toString();
        sessionModel.findOne = jest.fn().mockResolvedValue(workout);

        const result = await setServices.getSets(sessionId, workoutId);
        expect(result).toBeTruthy();
        expect(result).toEqual(workout);
    });

    test("Get sets --- failure no session", async () =>
    {
        const workout = {
            _id: new Types.ObjectId(),
        };
        const sessionId = "";
        const workoutId = workout._id?.toString();
        try
        {
            await setServices.getSets(sessionId, workoutId);
            fail("Test Should Not Be Here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Get sets --- failure no workout", async () =>
    {
        const session = new sessionModel({
            workout: [],
        });
        const sessionId = session._id?.toString() || "";
        const workoutId = "";
        try
        {
            await setServices.getSets(sessionId, workoutId);
            fail("Test Should Not Be Here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Add set --- successful", async () =>
    {
        const attributeToAdd: AttributeValue[] = [
            {
                name: "test",
                value: 1,
            },
        ];
        const workout = {
            _id: new Types.ObjectId(),
            sets: [
                {_id: new Types.ObjectId(), attributeValues: [attributeToAdd]},
            ],
        };
        const session = new sessionModel({
            workout: [workout],
        });

        const sessionId = session._id?.toString() || "";
        const workoutId = workout._id.toString();

        sessionModel.findOneAndUpdate = jest.fn().mockResolvedValue(session);

        const result = await setServices.addSet(
            sessionId,
            workoutId,
            attributeToAdd,
        );
        expect(result).toBeTruthy();
    });

    test("Add set --- failure no session", async () =>
    {
        const attributeToAdd: AttributeValue[] = [
            {
                name: "test",
                value: 1,
            },
        ];
        const workout = {
            _id: new Types.ObjectId(),
            sets: [
                {_id: new Types.ObjectId(), attributeValues: [attributeToAdd]},
            ],
        };

        const sessionId = "";
        const workoutId = workout._id.toString();
        try
        {
            await setServices.addSet(sessionId, workoutId, attributeToAdd);
            fail("Test should not reach here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Add set --- failre no workout", async () =>
    {
        const attributeToAdd: AttributeValue[] = [
            {
                name: "test",
                value: 1,
            },
        ];
        const session = new sessionModel({
            workout: [],
        });

        const sessionId = session._id?.toString() || "";
        const workoutId = "";

        try
        {
            await setServices.addSet(sessionId, workoutId, attributeToAdd);
            fail("Test should not reach here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Add set --- failre no attribute to add", async () =>
    {
        const attributeToAdd: AttributeValue[] = [];
        const workout = {
            _id: new Types.ObjectId(),
            sets: [
                {_id: new Types.ObjectId(), attributeValues: [attributeToAdd]},
            ],
        };
        const session = new sessionModel({
            workout: [workout],
        });

        const sessionId = session._id?.toString() || "";
        const workoutId = workout._id.toString();

        try
        {
            await setServices.addSet(sessionId, workoutId, attributeToAdd);
            fail("Test should not reach here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Add set --- failre no session update", async () =>
    {
        const attributeToAdd: AttributeValue[] = [
            {
                name: "test",
                value: 1,
            },
        ];
        const workout = {
            _id: new Types.ObjectId(),
            sets: [
                {_id: new Types.ObjectId(), attributeValues: [attributeToAdd]},
            ],
        };
        const session = new sessionModel({
            workout: [workout],
        });

        const sessionId = session._id?.toString() || "";
        const workoutId = workout._id.toString();

        sessionModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);
        try
        {
            await setServices.addSet(sessionId, workoutId, attributeToAdd);
            fail("Test should not reach here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Remove set --- successful", async () =>
    {
        const attributeValue: AttributeValue[] = [
            {
                name: "test",
                value: 1,
            },
        ];

        const sets = [
            {_id: new Types.ObjectId(), attributeValues: [attributeValue]},
        ];
        const workout = {
            _id: new Types.ObjectId(),
            sets: [],
        };
        const session = new sessionModel({
            _id: new Types.ObjectId(),
            workout: [workout],
        });

        const sessionId = session._id?.toString() || "";
        const workoutId = workout._id.toString();
        const setsId = sets[0]._id.toString();

        sessionModel.updateOne = jest.fn().mockResolvedValue(session);

        const result = await setServices.removeSet(
            sessionId,
            workoutId,
            setsId,
        );
        expect(result).toBeTruthy();
    });

    test("Remove set --- failure", async () =>
    {
        const attributeValue: AttributeValue[] = [
            {
                name: "test",
                value: 1,
            },
        ];

        const sets = [
            {_id: new Types.ObjectId(), attributeValues: [attributeValue]},
        ];
        const workout = {
            _id: new Types.ObjectId(),
            sets: [],
        };

        const sessionId = "";
        const workoutId = workout._id.toString();
        const setsId = sets[0]._id.toString();

        try
        {
            await setServices.removeSet(sessionId, workoutId, setsId);
            fail("Test should not reach here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Remove set --- failure no workout", async () =>
    {
        const attributeValue: AttributeValue[] = [
            {
                name: "test",
                value: 1,
            },
        ];

        const sets = [
            {_id: new Types.ObjectId(), attributeValues: [attributeValue]},
        ];
        const session = new sessionModel({
            _id: new Types.ObjectId(),
            workout: [],
        });

        const sessionId = session._id?.toString() || "";
        const workoutId = "";
        const setsId = sets[0]._id.toString();

        try
        {
            await setServices.removeSet(sessionId, workoutId, setsId);
            fail("Test should not reach here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Remove set --- failure no set", async () =>
    {
        const workout = {
            _id: new Types.ObjectId(),
            sets: [],
        };
        const session = new sessionModel({
            _id: new Types.ObjectId(),
            workout: [workout],
        });

        const sessionId = session._id?.toString() || "";
        const workoutId = workout._id.toString();
        const setsId = "";

        try
        {
            await setServices.removeSet(sessionId, workoutId, setsId);
            fail("Test should not reach here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Update set --- successful", async () =>
    {
        const attributeValue: AttributeValue[] = [
            {
                name: "test",
                value: 1,
            },
        ];

        const sets = [
            {_id: new Types.ObjectId(), attributeValues: [attributeValue]},
        ];
        const workout = {
            _id: new Types.ObjectId(),
            sets: [sets],
        };
        const session = new sessionModel({
            _id: new Types.ObjectId(),
            workout: [workout],
        });

        const setsId = sets[0]._id.toString();
        sessionModel.findOneAndUpdate = jest.fn().mockResolvedValue(session);

        const result = await setServices.updateSet(setsId, attributeValue);
        expect(result).toBeTruthy();
    });

    test("Update set --- failure no set", async () =>
    {
        const attributeValue: AttributeValue[] = [
            {
                name: "test",
                value: 1,
            },
        ];

        const setsId = "";

        try
        {
            await setServices.updateSet(setsId, attributeValue);
            fail("Test should not reach here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });
});
