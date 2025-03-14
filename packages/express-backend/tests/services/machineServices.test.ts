import {connect, close} from "../util/mongo-memory-server-config";
import machineModel, {MachineType} from "../../src/data/machine";
import userModel, {UserType} from "../../src/data/user";
import machineLogModel, {MachineLogType} from "../../src/data/machineLog";
import {Types} from "mongoose";
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
    beforeEach(async () =>
    {
        // Need to add entries for machineLog and user to get functional

        // Machine entries
        let dummyMachine: MachineType = {
            name: "Bench Press",
            muscle: "Pectoralis major",
        };
        const machine1 = new machineModel(dummyMachine);
        await machine1.save();

        dummyMachine = {
            name: "Machine",
            muscle: "Muscle",
        };

        const machine2 = new machineModel(dummyMachine);
        await machine2.save();

        dummyMachine = {
            name: "Leg Press",
            muscle: "Gluteus maximus",
        };
        const machine3 = new machineModel(dummyMachine);
        await machine3.save();

        dummyMachine = {
            name: "Pull Down",
            muscle: "Latissimus Dorsi",
        };
        const machine4 = new machineModel(dummyMachine);
        await machine4.save();

        // Machine Log entry
        const dummyMachineLog: MachineLogType = {
            machineIds: [
                // Type assertion since we know it can't be null since we created
                machine1._id as Types.ObjectId,
                machine2._id as Types.ObjectId,
                machine3._id as Types.ObjectId,
                machine4._id as Types.ObjectId,
            ],
        };
        const machineLogResult = new machineLogModel(dummyMachineLog);
        await machineLogResult.save();

        // User entry
        const dummyUser: UserType = {
            name: "Philip Buff",
            email: "pbuff@gmail.com",
            units: "lbs",
            machineLogId: machineLogResult._id,
        };
        const userResult = new userModel(dummyUser);
        await userResult.save();
    });

    // Clean up database entries for tests
    afterEach(async () =>
    {
        await machineModel.deleteMany();
        await machineLogModel.deleteMany();
        await userModel.deleteMany();
    });

    // machineServices tests

    // Fetch machine
    test("Fetch machine", async () =>
    {
        const name = "Bench Press";
        const muscle = "Pectoralis major";
        const email = "pbuff@gmail.com";
        const machine = await machineServices.getMachines(name, muscle, email);
        expect(machine).toBeTruthy();
        expect(machine.length).toBe(1);
        // Type assertion, we know the data exists if we get this far in the tests
        expect((machine[0] as MachineType).name).toBe(name);
        expect((machine[0] as MachineType).muscle).toBe(muscle);
    });

    // Update machine
    test("Update machine", async () =>
    {
        const email = "pbuff@gmail.com";
        const currentName = "Leg Press";
        const updatedMachine = {
            name: "Leg Press",
            muscle: "Quadriceps",
        };
        const result = await machineServices.updateMachine(
            email,
            currentName,
            updatedMachine,
        );
        expect(result).toBeTruthy();
        expect(result!.name).toBe(updatedMachine.name);
        expect(result!.muscle).toBe(updatedMachine.muscle);
    });

    // Delete machine
    test("Delete machine", async () =>
    {
        const email = "pbuff@gmail.com";
        const name = "Pull Down";
        const result = await machineServices.deleteMachine(email, name);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!.name).toBe(name);
    });

    // Add machine
    test("Add machine", async () =>
    {
        const email = "pbuff@gmail.com";
        const newMachine = {
            name: "Shoulder Press",
            muscle: "Deltoids",
        };
        const result: MachineType = await machineServices.addMachine(
            newMachine,
            email,
        );
        // Add machine returns
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result.machineIds.length).toBe(5);
    });
});
