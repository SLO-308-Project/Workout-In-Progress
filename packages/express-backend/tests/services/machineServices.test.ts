import machineModel from "../../src/data/machine";
import machineLogModel from "../../src/data/machineLog";
import userModel from "../../src/data/user";
import machineServices from "../../src/services/machineServices";

describe("Machine Services Tests", () =>
{
    beforeAll(() =>
    {});

    afterAll(async () =>
    {});

    // Clean up for each test
    beforeEach(() =>
    {
        jest.clearAllMocks();
    });

    // Clean up database entries for tests
    afterEach(async () =>
    {});

    // machineServices tests

    // Fetch machine
    test("Fetch machine --- successful", async () =>
    {
        const expected = [
            {
                name: "Bench Press",
                muscle: "Pectoralis major",
            },
        ];
        const email = "pbuff@gmail.com";
        const name = "Bench Press";
        const muscle = "Pectoralis major";
        userModel.aggregate = jest.fn().mockResolvedValue(expected);

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
        const machines = [
            new machineModel({
                name: "Leg Press",
                muscle: "Gluteus maximus",
                attributes: [
                    {
                        name: "wegith",
                        unit: "lbs",
                    },
                ],
            }),
        ];

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
        const expected = {
            name: "Leg Press",
            muscle: "Quadriceps",
        };
        userModel.aggregate = jest.fn().mockResolvedValue(machines);
        machineModel.findByIdAndUpdate = jest.fn().mockResolvedValue(expected);
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
        const expected = {
            name: "Pull Down",
        };
        const list = [
            {
                name: "Pull Down",
            },
        ];
        userModel.aggregate = jest.fn().mockResolvedValue(list);
        machineModel.findByIdAndDelete = jest.fn().mockResolvedValue(expected);
        const result = await machineServices.deleteMachine(email, name);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!.name).toBe(name);
    });

    // Add machine
    test("Add machine --- successful", async () =>
    {
        const email = "pbuff@gmail.com";
        const machineList: (typeof machineModel)[] = [];
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
        userModel.findOne = jest.fn().mockResolvedValue(machineList);
        machineLogModel.findOneAndUpdate = jest
            .fn()
            .mockResolvedValue(newMachine);
        jest.spyOn(machineModel.prototype, "save").mockResolvedValue(
            newMachine,
        );
        const result = await machineServices.addMachine(newMachine, email);
        expect(result).toBeTruthy();
        expect(result.name).toBe(newMachine.name);
        expect(result.muscle).toBe(newMachine.muscle);
    });

    //Get attributes
    test("Get attributes --- successful", async () =>
    {
        const machineId = "65f18342cf5b93ee8b0b87d4";
        const expected = {
            attributes: [
                {
                    name: "weight",
                    unit: "lbs",
                },
            ],
        };
        machineModel.findById = jest.fn().mockResolvedValue(expected);
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
        const machine = new machineModel({
            name: "Shoulder Press",
            muscle: "Deltoids",
            attributes: [
                {
                    name: "weight",
                    unit: "kgs",
                },
            ],
        });
        machineModel.findById = jest.fn().mockResolvedValue(machine);
        jest.spyOn(machineModel.prototype, "save").mockResolvedValue(machine);
        const result = await machineServices.addAttribute(
            machineId,
            name,
            unit,
        );
        console.log(result);
        expect(result).toBeTruthy();
        expect(result!.attributes[1].name).toBe(name);
        expect(result!.attributes[1].unit).toBe(unit);
    });

    test("Delete attribute --- successful", async () =>
    {
        const machineId = "65f18342cf5b93ee8b0b87d4";
        const attrName = "weight";
        const machine = new machineModel({
            name: "Shoulder Press",
            muscle: "Deltoids",
            attributes: [],
        });
        machineModel.findByIdAndUpdate = jest.fn().mockResolvedValue(machine);
        const result = await machineServices.deleteAttribute(
            machineId,
            attrName,
        );
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!.attributes.length).toBe(0);
    });

    // These tests exist to hit the catch blocks
    test("Add machine --- failure save", async () =>
    {
        userModel.findOne = jest.fn().mockResolvedValue(null);
        jest.spyOn(machineModel.prototype, "save").mockImplementation(
            async () =>
            {
                await Promise.reject(new Error("boom"));
            },
        );
        machineLogModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);
        try
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
            await machineServices.addMachine(newMachine, email);
            fail("Test Should Not Be Here");
        }
        catch (error)
        {
            expect(error).toBeTruthy();
        }
    });

    // These tests exist to hit the catch blocks
    test("Add machine --- failure save", async () =>
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
        userModel.findOne = jest.fn().mockResolvedValue(null);
        jest.spyOn(machineModel.prototype, "save").mockResolvedValue(
            newMachine,
        );
        machineLogModel.findOneAndUpdate = jest
            .fn()
            .mockImplementation(async () =>
            {
                await Promise.reject(new Error("boom"));
            });
        const result = await machineServices.addMachine(newMachine, email);
        expect(result).toBeTruthy();
    });

    // These tests exist to hit the catch blocks
    test("Add machine --- failure save", async () =>
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
        userModel.findOne = jest.fn().mockImplementation(async () =>
        {
            await Promise.reject(new Error("boom"));
        });
        jest.spyOn(machineModel.prototype, "save").mockResolvedValue(
            newMachine,
        );
        const result = await machineServices.addMachine(newMachine, email);
        expect(result).toBeTruthy();
    });

    test("Get attribute --- failure", async () =>
    {
        machineModel.findById = jest.fn().mockResolvedValue(null);
        const machineId = "65f11142cf5b93ee8b0b87d4";
        const result = await machineServices.getAttributes(machineId);
        expect(result).toBeFalsy();
    });

    test("Add attribute --- failure", async () =>
    {
        machineModel.findById = jest.fn().mockResolvedValue(null);
        const machineId = "65f11142cf5b93ee8b0b87d4";
        const name = "calories";
        const unit = "cal";
        const result = await machineServices.addAttribute(
            machineId,
            name,
            unit,
        );
        expect(result).toBeFalsy();
    });

    test("Delete attribute --- failure", async () =>
    {
        machineModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
        const machineId = "65f11142cf5b93ee8b0b87d4";
        const attrName = "weight";
        const result = await machineServices.deleteAttribute(
            machineId,
            attrName,
        );
        expect(result).toBeFalsy();
    });
});
