import { connect, close } from "../util/mongo-memory-server-config";
import userModel, {userType} from "../../src/data/user";
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
    beforeEach(async () => {
        let dummyUser: userType = {
            name: "Philip Buff",
            email: "pbuff@gmail.com",
            units: "lbs",
        };
        let result = new userModel(dummyUser);
        await result.save();

        dummyUser = {
            name: "Anna Bolick",
            email: "abolick@gmail.com",
            units: "kilos",
        };

        result = new userModel(dummyUser);
        await result.save();

        dummyUser = {
            name: "John Smith",
            email: "jsmith@gmail.com",
            units: "lbs",
        };
        result = new userModel(dummyUser);
        await result.save();

        dummyUser = {
            name: "Jane Doe",
            email: "jdoe@gmail.com",
            units: "lbs"
        };
        result = new userModel(dummyUser);
        await result.save();
    });

    // Clean up database entries for tests
    afterEach(async () => {
        await userModel.deleteMany();
    });

    // userServices Tests
    test("Add user -- successful", async () => {
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
});
