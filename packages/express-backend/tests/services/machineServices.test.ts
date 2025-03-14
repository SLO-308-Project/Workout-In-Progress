import {connect, close} from "../util/mongo-memory-server-config";
import machineModel, {machineType} from "../../src/data/machine";
import userModel, {userType} from "../../src/data/user";
import machineLogModel, {machineLogType} from "../../src/data/machineLog";
import {Types} from "mongoose";
import machineServices from "../../src/services/machineServices";

describe("Machine Services Tests", () => {

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
        const dummyMachine1 = new machineModel({
            name: "Bench Press",
            muscle: "Pectoralis major",
            attributes: [{
                name: "weight",
                unit: "lbs",
            }]
        });
        await dummyMachine1.save();

        const dummyMachine2 = new machineModel({
            name: "Machine",
            muscle: "Muscle",
            attributes: [{
                name: "weight",
                unit: "kgs",
            }]
        });
        await dummyMachine2.save();

        const dummyMachine3 = new machineModel({
            name: "Leg Press",
            muscle: "Gluteus maximus",
            attributes: [{
                name: "weight",
                unit: "lbs",
            }]
        });
        await dummyMachine3.save();

        const dummyMachine4 = new machineModel({
            name: "Pull Down",
            muscle: "Latissimus Dorsi",
            attribute: [{
                name: "weight",
                unit: "lbs",
            }]
        });
        await dummyMachine4.save();

        // Machine Log entry
        const dummyMachineLog: machineLogType = {
            machineIds: [
                // Type assertion since we know it can't be null since we created
                dummyMachine1._id as Types.ObjectId,
                dummyMachine2._id as Types.ObjectId,
                dummyMachine3._id as Types.ObjectId,
                dummyMachine4._id as Types.ObjectId,
            ],
        };
        const machineLogResult = new machineLogModel(dummyMachineLog);
        await machineLogResult.save();

        // User entry
        const dummyUser: userType = {
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
        expect((machine[0] as machineType).name).toBe(name);
        expect((machine[0] as machineType).muscle).toBe(muscle);
    });

    // Update machine
    test("Update machine", async () =>
    {
        const email = "pbuff@gmail.com";
        const currentName = "Leg Press";
        const updatedMachine = new machineModel({
            name: "Leg Press",
            muscle: "Quadriceps",
            attributes: [{
                name: "weight",
                unit: "lbs",
            }]
        });
        const result = await machineServices.updateMachine(
            email,
            currentName,
            updatedMachine,
        );
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
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
        const newMachine = new machineModel({
            name: "Shoulder Press",
            muscle: "Deltoids",
            attributes: [{
                name: "weight",
                unit: "kgs",
            }]
        });
        const result = await machineServices.addMachine(newMachine, email);
        expect(result).toBeTruthy();
        expect(result.name).toBe(newMachine.name);
        expect(result.muscle).toBe(newMachine.muscle);
    });
});
