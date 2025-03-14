import {connect, close} from "../util/mongo-memory-server-config";
import workoutServices from "../../src/services/workoutServices";
import sessionModel, {sessionType} from "../../src/data/session";

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

    });

    // Clean up database entries
    afterEach (async () => {

    });

    test("Get workout", async () => {
        const result = await workoutServices.getWorkout();
        expect(result).toBeTruthy();
        fail("Finish get workout tests");
    });

    test("Remove workout", async () => {
        const result = await workoutServices.removeWorkout();
        expect(result).toBeTruthy();
        fail("Finish remove workout tests");
    });
    test("Add workout", async () => {
       const result = await workoutServices.addWorkout();
       expect(result).toBeTruthy();
       fail("Finish add workout tests");
    });

});