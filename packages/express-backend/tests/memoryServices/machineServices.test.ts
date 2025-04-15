import {connect, close} from "../util/mongo-memory-server-config";
import machineModel from "../../src/data/machine";
import userModel from "../../src/data/user";
import machineLogModel from "../../src/data/machineLog";
import machineServices from "../../src/services/machineServices";
import {Types} from "mongoose";

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
        // Machine entries

        // Machine with a forced _id for testing purposes
        const dummyMachine1 = new machineModel({
            _id: new Types.ObjectId("65f18342cf5b93ee8b0b87d4"),
            name: "Bench Press",
            muscle: "Pectoralis major",
            attributes: [
                {
                    name: "weight",
                    unit: "lbs",
                },
            ],
        });
        await dummyMachine1.save();

        const dummyMachine2 = new machineModel({
            name: "Machine",
            muscle: "Muscle",
            attributes: [
                {
                    name: "weight",
                    unit: "kgs",
                },
            ],
        });
        await dummyMachine2.save();

        const dummyMachine3 = new machineModel({
            name: "Leg Press",
            muscle: "Gluteus maximus",
            attributes: [
                {
                    name: "weight",
                    unit: "lbs",
                },
            ],
        });
        await dummyMachine3.save();

        const dummyMachine4 = new machineModel({
            name: "Pull Down",
            muscle: "Latissimus Dorsi",
            attribute: [
                {
                    name: "weight",
                    unit: "lbs",
                },
            ],
        });
        await dummyMachine4.save();

        // Machine Log entry
        const dummyMachineLog = new machineLogModel({
            machineIds: [
                // Type assertion since we know it can't be null since we created
                dummyMachine1._id,
                dummyMachine2._id,
                dummyMachine3._id,
                dummyMachine4._id,
            ],
        });
        await dummyMachineLog.save();

        // User entry
        const dummyUser = new userModel({
            name: "Philip Buff",
            email: "pbuff@gmail.com",
            password: "pass123",
            units: "lbs",
            machineLogId: dummyMachineLog._id,
        });
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
    test("Fetch machine --- successful", async () =>
    {
        const name = "Bench Press";
        const muscle = "Pectoralis major";
        const email = "pbuff@gmail.com";
        const result = await machineServices.getMachines(name, muscle, email);
        expect(result).toBeTruthy();
        expect(result.length).toBe(1);
        expect(result[0].name).toBe(name);
        expect(result[0].muscle).toBe(muscle);
    });

    // Update machine
    test("Update machine --- successful", async () =>
    {
        const email = "pbuff@gmail.com";
        const currentName = "Leg Press";
        const updatedMachine = new machineModel({
            name: "Leg Press",
            muscle: "Quadriceps",
            attributes: [
                {
                    name: "weight",
                    unit: "lbs",
                },
            ],
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
    test("Delete machine --- successful", async () =>
    {
        const email = "pbuff@gmail.com";
        const name = "Pull Down";
        const result = await machineServices.deleteMachine(email, name);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!.name).toBe(name);
    });

    // Add machine
    test("Add machine --- successful", async () =>
    {
        const email = "pbuff@gmail.com";
        const newMachine = new machineModel({
            name: "Shoulder Press",
            muscle: "Deltoids",
            attributes: [
                {
                    name: "weight",
                    unit: "kgs",
                },
            ],
        });
        const result = await machineServices.addMachine(newMachine, email);
        expect(result).toBeTruthy();
        expect(result.name).toBe(newMachine.name);
        expect(result.muscle).toBe(newMachine.muscle);
    });

    //Get attributes
    test("Get attributes --- successful", async () =>
    {
        const machineId = "65f18342cf5b93ee8b0b87d4";
        const result = await machineServices.getAttributes(machineId);
        expect(result).toBeTruthy();
        expect(result![0].name).toBe("weight");
        expect(result![0].unit).toBe("lbs");
    });

    test("Add attribute --- successful", async () =>
    {
        const machineId = "65f18342cf5b93ee8b0b87d4";
        const name = "calories";
        const unit = "cal";
        const result = await machineServices.addAttribute(
            machineId,
            name,
            unit,
        );
        expect(result).toBeTruthy();
        expect(result!.attributes[1].name).toBe(name);
        expect(result!.attributes[1].unit).toBe(unit);
    });

    test("Delete attribute --- successful", async () =>
    {
        const machineId = "65f18342cf5b93ee8b0b87d4";
        const attrName = "weight";
        const result = await machineServices.deleteAttribute(
            machineId,
            attrName,
        );
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!.attributes.length).toBe(0);
    });

    // These tests exist to hit the catch blocks
    test("Add machine --- failure", async () =>
    {
        try
        {
            // breaks database connection to force an error
            await close();
            const email = "pbuff@gmail.com";
            const newMachine = new machineModel({
                name: "Shoulder Press",
                muscle: "Deltoids",
                attributes: [
                    {
                        name: "weight",
                        unit: "kgs",
                    },
                ],
            });
            await machineServices.addMachine(newMachine, email);
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
    test("Get attribute --- failure", async () =>
    {
        try
        {
            // machine id is not a machine in database forces error
            const machineId = "65f11142cf5b93ee8b0b87d4";
            await machineServices.getAttributes(machineId);
            fail("Test shouldn't get here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Add attribute --- failure", async () =>
    {
        try
        {
            const machineId = "65f11142cf5b93ee8b0b87d4";
            const name = "calories";
            const unit = "cal";
            await machineServices.addAttribute(machineId, name, unit);
            fail("Test shouldn't get here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    test("Delete attribute --- failure", async () =>
    {
        try
        {
            const machineId = "65f11142cf5b93ee8b0b87d4";
            const attrName = "weight";
            await machineServices.deleteAttribute(machineId, attrName);
            fail("Test shouldn't get here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });
});