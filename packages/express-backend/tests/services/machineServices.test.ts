import { connect, close } from "../util/mongo-memory-server-config";
import machineModel, {machineType} from "../../src/data/machine";
import machineServices from "../../src/services/machineServices";

describe("Machine Services Tests", () =>
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
       let dummyMachine: machineType = {
           name: "Bench Press",
           muscle: "Pectoralis major"
       };
       let result = new machineModel(dummyMachine);
       await result.save();

       dummyMachine = {
           name: "Machine",
           muscle: "Muscle",
       };

       result = new machineModel(dummyMachine);
       await result.save();

       dummyMachine = {
           name: "Leg Press",
           muscle: "Gluteus maximus",
       };
       result = new machineModel(dummyMachine);
       await result.save();

       dummyMachine = {
           name: "Pull Down",
           muscle: "Latissimus Dorsi",
       };
       result = new machineModel(dummyMachine);
       await result.save();
    });

    // Clean up database entries for tests
    afterEach(async () => {
       await machineModel.deleteMany();
    });

    // machineServices tests

    // Set to fail currently, need to figure out how to test machines since heavily linked with user currently.
    test("Fetch machine", async () => {
        const name = "Bench Press";
        const muscle = "Pectoralis major";
        const email = "bench@gmail.com";
        const machine = await machineServices.getMachines(name, muscle, email);
        expect(machine).toBe("Figure out machine tests");
    });
});
