import {connect, close} from "../util/mongo-memory-server-config";
import userModel from "../../src/data/user";
import userServices from "../../src/services/userServices";

describe("User Services Tests", () =>
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
        let dummyUser = new userModel({
            name: "Philip Buff",
            email: "pbuff@gmail.com",
            units: "lbs",
        });
        await dummyUser.save();

        dummyUser = new userModel({
            name: "Anna Bolick",
            email: "abolick@gmail.com",
            units: "kilos",
        });
        await dummyUser.save();

        dummyUser = new userModel({
            name: "John Smith",
            email: "jsmith@gmail.com",
            units: "lbs",
        });
        await dummyUser.save();

        dummyUser = new userModel({
            name: "Jane Doe",
            email: "jdoe@gmail.com",
            units: "lbs",
        });
        await dummyUser.save();
    });

    // Clean up database entries for tests
    afterEach(async () =>
    {
        await userModel.deleteMany();
    });

    // userServices Tests
    test("Add user -- successful", async () =>
    {
        const dummyUser = {
            name: "Person Guy",
            email: "pguy@gmail.com",
            units: "lbs" as const,
        };
        const result = await userServices.addUser(dummyUser);
        expect(result).toBeTruthy();
        expect(result.name).toBe(dummyUser.name);
        expect(result.email).toBe(dummyUser.email);
        expect(result.units).toBe(dummyUser.units);
        expect(result).toHaveProperty("_id");
    });

    // Add user - test to hit the catch blocks
    // Closes the connection to database to force an error to hit the catch blocks
    // Reconnects after test finishes
    test("Add user -- failure (save error)", async () =>
    {
        await close();
        const dummyUser = {
            name: "Person Guy",
            email: "pguy@gmail.com",
            units: "lbs" as const,
            sessionLogId: undefined,
            machineLogId: undefined,
        };
        try
        {
            await userServices.addUser(dummyUser);
            fail("Test shouldn't get here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
        finally
        {
            await connect();
        }
    });
});
