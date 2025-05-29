import machineModel from "../../src/data/machine";
import machineLogModel from "../../src/data/machineLog";
import sessionTemplateModel from "../../src/data/sessionTemplate";
import userModel from "../../src/data/user";
import machineServices from "../../src/services/machineServices";
import mongoose, {Types} from "mongoose";

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
    afterEach(() =>
    {
        jest.restoreAllMocks();
    });

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
        const stubId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        const name = "Bench Press";
        const muscle = "Pectoralis major";
        userModel.aggregate = jest.fn().mockResolvedValue(expected);

        const result = await machineServices.getMachines(name, muscle, stubId);
        expect(result).toBeTruthy();
        expect(result.length).toBe(1);
        expect(result[0].name).toBe(name);
        expect(result[0].muscle).toBe(muscle);
    });

    test("Fetch multiple machines --- successful", async () =>
    {
        const stubUserId = "66561f94a8c2f9d4c4b9e31a";
        const mockSession = {} as mongoose.ClientSession;
        const machines = [
            new machineModel(),
            new machineModel(),
            new machineModel(),
        ];
        const machineIds: string[] = machines.map(
            (machine) => machine._id?.toString() as string,
        );
        userModel.aggregate = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(machines),
            session: jest.fn().mockResolvedValue(null),
        });
        machineModel.find = jest.fn().mockResolvedValue(machines);

        const result = await machineServices.getMachinesByIds(
            machineIds,
            stubUserId,
            {session: mockSession},
        );
        expect(result).toBeTruthy();
        expect(result?.length).toBe(3);
    });

    test("Fetch saved machiens --- successful", async () =>
    {
        const stubId = "";
        const expected = [
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
        const template = new sessionTemplateModel({
            machines: expected,
            workout: [],
        });
        sessionTemplateModel.findById = jest.fn().mockResolvedValue(template);
        const result = await machineServices.getSavedMachines(stubId);
        expect(result).toBeTruthy();
        expect(result?.length).toBe(2);
    });

    // Update machine
    test("Update machine --- successful", async () =>
    {
        const stubId = "a3f7d2e1b9c8d0a1e4b5f9c3";
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
            stubId,
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
        const stubId = "a3f7d2e1b9c8d0a1e4b5f9c3";
        const name = "Pull Down";
        const machineId = "mock-machine-id";
        const machineLogId = "mock-log-id";
        const machineToDelete = {
            _id: machineId,
            name: "Pull Down",
        };
        const list = [machineToDelete];
        const aggregateMethod = jest.spyOn(userModel, "aggregate");
        const findByIdAndDeleteMethod = jest.spyOn(
            machineModel,
            "findByIdAndDelete",
        );
        const findOneMethod = jest.spyOn(userModel, "findOne");
        const findOneAndUpdateMethod = jest.spyOn(
            machineLogModel,
            "findOneAndUpdate",
        );

        aggregateMethod.mockResolvedValue(list);
        findByIdAndDeleteMethod.mockResolvedValue(machineToDelete);
        findOneMethod.mockResolvedValue({
            _id: stubId,
            machineLogId: machineLogId,
        });
        findOneAndUpdateMethod.mockResolvedValue({
            _id: machineLogId,
            machineIds: [],
        });
        const result = await machineServices.deleteMachine(stubId, name);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result!.name).toBe(name);
        expect(aggregateMethod).toHaveBeenCalled();
        expect(findByIdAndDeleteMethod).toHaveBeenCalledWith(machineId);

        // Tests for deletion from machineLog
        expect(findOneMethod).toHaveBeenCalledWith({_id: stubId});
        expect(findOneAndUpdateMethod).toHaveBeenCalledWith(
            {
                _id: machineLogId,
            },
            {$pull: {machineIds: machineId}},
        );
        const machineLogResult = (await findOneAndUpdateMethod.mock.results[0]
            .value) as {
            _id: string;
            machineIds: string[];
        };
        expect(machineLogResult.machineIds).toEqual([]);
    });

    // Add machine
    test("Add machine --- successful", async () =>
    {
        const stubId = "";
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
        const result = await machineServices.addMachine(newMachine, stubId);
        expect(result).toBeTruthy();
        expect(result.name).toBe(newMachine.name);
        expect(result.muscle).toBe(newMachine.muscle);
    });

    test("Save Machine --- successful", async () =>
    {
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
        const newMachineId = newMachine._id?.toString() || "";
        const template = new sessionTemplateModel({
            workout: [],
            machines: [newMachine],
        });
        const templateId = template._id?.toString() || "";
        machineModel.findById = jest.fn().mockResolvedValue(newMachine);
        sessionTemplateModel.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(template);
        const result = await machineServices.saveMachine(
            newMachineId,
            templateId,
        );
        expect(result).toBeTruthy();
        expect(result?.machines[0]._id?.toString()).toBe(newMachineId);
    });

    test("Save machine from template -- successful", async () =>
    {
        const machine = new machineModel({
            attributes: [{name: "attr1"}, {name: "attr2"}],
        });
        const copyMachine = new machineModel({
            attributes: [{name: "attr1"}, {name: "attr2"}],
        });
        const sourceTemplate = new sessionTemplateModel({
            machines: [machine],
        });
        const destTemplate = new sessionTemplateModel({
            machines: [copyMachine],
        });
        const machineId = machine._id?.toString() || "";
        const sourceTemplateId = sourceTemplate._id?.toString() || "";
        const destTemplateId = destTemplate._id?.toString() || "";

        sessionTemplateModel.findById = jest
            .fn()
            .mockResolvedValue(sourceTemplate);
        sessionTemplateModel.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(destTemplate);
        const result = await machineServices.saveMachineFromTemplate(
            machineId,
            destTemplateId,
            sourceTemplateId,
        );
        expect(result).toBeTruthy();
        expect(result?.machines[0]._id?.toString()).not.toEqual(machineId);
    });

    test("Remove machine --- successful", async () =>
    {
        const template = new sessionTemplateModel({
            workout: [],
            machines: [
                new machineModel({
                    _id: new Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
                    name: "Shoulder Press",
                    muscle: "Deltoids",
                    attributes: [
                        {
                            name: "weight",
                            unit: "kgs",
                        },
                    ],
                }),
            ],
        });
        const machineId = "65f18f3ac6dc7f8d5a1234ab";
        const newTemplate = new sessionTemplateModel(template);
        newTemplate.set(
            "machines",
            newTemplate.machines.filter(
                (machine) => machine._id!.toString() !== machineId,
            ),
        );
        const templateId = template._id?.toString() || "";
        sessionTemplateModel.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(newTemplate);
        const result = await machineServices.removeMachine(
            machineId,
            templateId,
        );
        console.log("HERE");
        console.log(result);
        expect(result).toBeTruthy();
        expect(result?.machines.length).toBe(0);
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
            const stubId = "";
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
            await machineServices.addMachine(newMachine, stubId);
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
        const stubId = "";
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
        const result = await machineServices.addMachine(newMachine, stubId);
        expect(result).toBeTruthy();
    });

    // These tests exist to hit the catch blocks
    test("Add machine --- failure save", async () =>
    {
        const stubId = "";
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
        const result = await machineServices.addMachine(newMachine, stubId);
        expect(result).toBeTruthy();
    });

    test("Save Machine -- failure", async () =>
    {
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
        const machineId = newMachine?._id?.toString() || "";
        const stubId = "";
        machineModel.findById = jest.fn().mockResolvedValue(null);
        const result = await machineServices.saveMachine(machineId, stubId);
        expect(result).toBeFalsy();
    });

    test("Save machine from template -- failure no template", async () =>
    {
        const machineId = "";
        const sourceTemplateId = "";
        const destTemplateId = "";

        sessionTemplateModel.findById = jest.fn().mockResolvedValue(null);
        const result = await machineServices.saveMachineFromTemplate(
            machineId,
            destTemplateId,
            sourceTemplateId,
        );
        expect(result).toBeFalsy();
    });

    test("Save machine from template -- failure no machine", async () =>
    {
        const machine = new machineModel();
        const sourceTemplate = new sessionTemplateModel({
            machines: [machine],
        });
        const machineId = "";
        const sourceTemplateId = sourceTemplate._id?.toString() || "";
        const destTemplateId = "";

        sessionTemplateModel.findById = jest
            .fn()
            .mockResolvedValue(sourceTemplate);
        const result = await machineServices.saveMachineFromTemplate(
            machineId,
            destTemplateId,
            sourceTemplateId,
        );
        expect(result).toBeFalsy();
    });

    test("Fetch multiple machines --- failure", async () =>
    {
        const stubUserId = "66561f94a8c2f9d4c4b9e31a";
        const machineIds: string[] = [];
        userModel.aggregate = jest.fn().mockReturnValue({
            exec: jest.fn().mockImplementation(async () =>
            {
                await Promise.reject(new Error("boom"));
            }),
        });
        const result = await machineServices.getMachinesByIds(
            machineIds,
            stubUserId,
        );
        expect(result).toBeFalsy();
    });

    test("Remove machine --- failure", async () =>
    {
        const template = new sessionTemplateModel({
            workout: [],
            machines: [
                new machineModel({
                    _id: new Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
                    name: "Shoulder Press",
                    muscle: "Deltoids",
                    attributes: [
                        {
                            name: "weight",
                            unit: "kgs",
                        },
                    ],
                }),
            ],
        });
        const machineId = "6458a28d1f3d7c9a8e1b2c46";
        const templateId = template._id?.toString() || "";
        sessionTemplateModel.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(null);
        const result = await machineServices.removeMachine(
            machineId,
            templateId,
        );
        expect(result).toBeFalsy();
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

    test("Fetch saved machines --- failure", async () =>
    {
        const stubId = "";
        sessionTemplateModel.findById = jest.fn().mockResolvedValue(null);
        const result = await machineServices.getSavedMachines(stubId);
        expect(result).toBeFalsy();
    });
});
