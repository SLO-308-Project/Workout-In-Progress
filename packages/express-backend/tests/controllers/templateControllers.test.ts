import templateController from "../../src/controllers/templateController";
import templateServices from "../../src/services/templateServices";
import machineServices from "../../src/services/machineServices";
import sessionServices from "../../src/services/sessionServices";
import machineModel, {MachineType} from "../../src/data/machine";
import mongoose, {Types} from "mongoose";

jest.mock("../../src/services/sessionServices");
jest.mock("../../src/services/machineServices");
jest.mock("../../src/services/templateServices");
jest.mock("../../src/data/sessionTemplate");
jest.mock("../../src/data/session");
jest.mock("mongoose", (): typeof mongoose => ({
    ...jest.requireActual("mongoose"),
    startSession: jest.fn().mockResolvedValue({
        startTransaction: jest.fn().mockResolvedValue(null),
        commitTransaction: jest.fn().mockResolvedValue(null),
        abortTransaction: jest.fn().mockResolvedValue(null),
        endSession: jest.fn().mockResolvedValue(null),
    } as unknown as mongoose.ClientSession),
}));

type WorkoutType = {
    _id: Types.ObjectId;
    machineId: Types.ObjectId | null;
    sets: {
        _id: Types.ObjectId;
        attributeValues: {
            _id: Types.ObjectId;
            name: string;
            value: number;
        }[];
    }[];
};

type TemplateCallArgs = {
    machines: MachineType[];
    workout: WorkoutType[];
};

const verifyDeepCopy = (
    machines: MachineType[],
    workouts: WorkoutType[],
    callArguments: TemplateCallArgs,
) =>
{
    const machineCall = callArguments.machines;
    machineCall.forEach((mach, i) =>
    {
        machines.forEach((oldMach) =>
        {
            expect(oldMach._id).not.toEqual(mach._id);
        });
        mach.attributes.forEach((attr, j) =>
        {
            expect(attr._id).not.toEqual(machines[i].attributes[j]._id);
            expect(attr.name).toBe(machines[i].attributes[j].name);
            expect(attr.unit).toBe(machines[i].attributes[j].unit);
        });
    });
    expect(machineCall.length).toBe(machines.length);
    const newMachineIds = machineCall.map((mach) => mach._id);
    const workoutCall = callArguments.workout;
    workoutCall.forEach((workout, i) =>
    {
        workouts.forEach((oldWorkout) =>
        {
            expect(oldWorkout._id).not.toEqual(workout._id);
        });
        expect(newMachineIds).toContain(workout.machineId);
        workout.sets.forEach((set, j) =>
        {
            set.attributeValues.forEach((attr, k) =>
            {
                const oldAttr = workouts[i].sets[j].attributeValues[k];
                expect(attr._id).not.toEqual(oldAttr._id);
                expect(attr.name).toBe(oldAttr.name);
                expect(attr.value).toBe(oldAttr.value);
            });
        });
    });
    expect(workoutCall.length).toBe(workouts.length);
};

describe("Template Controllers Test", () =>
{
    let mockMachines: MachineType[];
    let mockWorkouts: WorkoutType[];
    let newTemplate: {set: jest.Mock; save: () => jest.Mock};
    const userId = "test";
    const stubSourceId = "test";
    const stubName = "test";

    beforeAll(() =>
    {});

    afterAll(async () =>
    {});

    // Clean up for each test
    beforeEach(() =>
    {
        jest.clearAllMocks();
        const mockMachine1 = new machineModel({
            _id: new Types.ObjectId(),
            attributes: [
                {_id: new Types.ObjectId(), name: "attr1", unit: "lbs"},
                {_id: new Types.ObjectId(), name: "attr2", unit: "lbs"},
            ],
        });
        const mockMachine2 = new machineModel({
            _id: new Types.ObjectId(),
            attributes: [
                {_id: new Types.ObjectId(), name: "attr3", unit: "lbs"},
            ],
        });
        mockMachines = [mockMachine1, mockMachine2];

        mockWorkouts = [
            {
                _id: new Types.ObjectId(),
                machineId: mockMachine1._id,
                sets: [
                    {
                        _id: new Types.ObjectId(),
                        attributeValues: [
                            {
                                _id: new Types.ObjectId(),
                                name: "a",
                                value: 1,
                            },
                        ],
                    },
                ],
            },
            {
                _id: new Types.ObjectId(),
                machineId: mockMachine2._id,
                sets: [
                    {
                        _id: new Types.ObjectId(),
                        attributeValues: [
                            {
                                _id: new Types.ObjectId(),
                                name: "b",
                                value: 2,
                            },
                        ],
                    },
                ],
            },
        ];

        newTemplate = {
            set: jest.fn(),
            save: jest.fn().mockResolvedValue(true),
        };
    });

    afterEach(async () =>
    {});

    test("Copy template --- successful", async () =>
    {
        const mockTemplate = {
            name: "test",
            workout: mockWorkouts,
            set: jest.fn(),
            save: jest.fn().mockResolvedValue(true),
        };

        (templateServices.getTemplateById as jest.Mock).mockResolvedValue(
            mockTemplate,
        );

        (templateServices.addTemplate as jest.Mock).mockResolvedValue(
            newTemplate,
        );

        (machineServices.getSavedMachines as jest.Mock).mockResolvedValue(
            mockMachines,
        );

        const result = await templateController.copyTemplate(
            stubSourceId,
            userId,
        );
        expect(result).toBeTruthy();
        expect(newTemplate.set).toHaveBeenCalledWith(
            "workout",
            expect.any(Array),
        );
        expect(newTemplate.set).toHaveBeenCalledWith(
            "machines",
            expect.any(Array),
        );
        const callArguments = Object.fromEntries(
            newTemplate.set.mock.calls as [
                keyof TemplateCallArgs,
                TemplateCallArgs[keyof TemplateCallArgs],
            ][],
        ) as TemplateCallArgs;
        verifyDeepCopy(mockMachines, mockTemplate.workout, callArguments);
    });

    test("Copy template --- unsuccessful no template created", async () =>
    {
        (templateServices.addTemplate as jest.Mock).mockResolvedValue(null);

        const result = await templateController.copyTemplate(
            stubSourceId,
            userId,
        );
        expect(result).toBeFalsy();
    });

    test("Copy template --- unsuccessful no source template found", async () =>
    {
        (templateServices.getTemplateById as jest.Mock).mockResolvedValue(null);

        const result = await templateController.copyTemplate(
            stubSourceId,
            userId,
        );
        expect(result).toBeFalsy();
    });

    test("Save session --- successful", async () =>
    {
        const mockSession = [
            {
                workout: mockWorkouts,
                set: jest.fn(),
                save: jest.fn().mockResolvedValue(true),
            },
        ];

        const newTemplate = {
            set: jest.fn(),
            save: jest.fn().mockResolvedValue(true),
        };

        (sessionServices.getSessionById as jest.Mock).mockResolvedValue(
            mockSession,
        );

        (templateServices.addTemplate as jest.Mock).mockResolvedValue(
            newTemplate,
        );

        (machineServices.getMachinesByIds as jest.Mock).mockResolvedValue(
            mockMachines,
        );

        const result = await templateController.saveSession(
            stubSourceId,
            stubName,
            userId,
        );
        expect(result).toBeTruthy();
        expect(newTemplate.set).toHaveBeenCalledWith(
            "workout",
            expect.any(Array),
        );
        expect(newTemplate.set).toHaveBeenCalledWith(
            "machines",
            expect.any(Array),
        );
        const callArguments = Object.fromEntries(
            newTemplate.set.mock.calls as [
                keyof TemplateCallArgs,
                TemplateCallArgs[keyof TemplateCallArgs],
            ][],
        ) as TemplateCallArgs;
        verifyDeepCopy(mockMachines, mockSession[0].workout, callArguments);
    });

    test("Save session --- unsuccessful no source session found", async () =>
    {
        (sessionServices.getSessionById as jest.Mock).mockResolvedValue([]);

        const result = await templateController.saveSession(
            stubSourceId,
            stubName,
            userId,
        );
        expect(result).toBeFalsy();
    });
});
