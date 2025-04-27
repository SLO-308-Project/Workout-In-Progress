import userModel from "../../src/data/user";
import machineLogModel from "../../src/data/machineLog";
import sessionLogModel from "../../src/data/sessionLog";
import userServices from "../../src/services/userServices";

describe("User Services Tests", () =>
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

    // userServices Tests
    test("Add user -- successful", async () =>
    {
        const dummyUser = {
            name: "Person Guy",
            email: "pguy@gmail.com",
            password: "pass123",
            units: "lbs" as const,
        };
        const user = new userModel(dummyUser);
        const stubLog = {
            _id: "0",
        };
        jest.spyOn(userModel.prototype, "save").mockResolvedValue(user);
        jest.spyOn(machineLogModel.prototype, "save").mockResolvedValue(
            stubLog,
        );
        jest.spyOn(sessionLogModel.prototype, "save").mockResolvedValue(
            stubLog,
        );
        const result = await userServices.addUser(dummyUser);
        expect(result).toBeTruthy();
        expect(result.name).toBe(user.name);
        expect(result.email).toBe(user.email);
        expect(result.units).toBe(user.units);
        expect(result).toHaveProperty("_id");
    });

    // Add user - test to hit the catch blocks
    // Closes the connection to database to force an error to hit the catch blocks
    // Reconnects after test finishes
    test("Add user -- failure (save error)", async () =>
    {
        const dummyUser = {
            name: "Person Guy",
            email: "pguy@gmail.com",
            password: "1234",
            units: "lbs" as const,
            sessionLogId: undefined,
            machineLogId: undefined,
        };
        const user = new userModel(dummyUser);
        jest.spyOn(userModel.prototype, "save").mockResolvedValue(user);
        jest.spyOn(machineLogModel.prototype, "save").mockResolvedValue(
            undefined,
        );
        jest.spyOn(sessionLogModel.prototype, "save").mockResolvedValue(
            undefined,
        );
        try
        {
            await userServices.addUser(dummyUser);
            fail("Test shouldn't get here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });
});
