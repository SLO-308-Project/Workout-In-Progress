"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const machine_1 = __importDefault(require("../../src/data/machine"));
const machineLog_1 = __importDefault(require("../../src/data/machineLog"));
const sessionTemplate_1 = __importDefault(require("../../src/data/sessionTemplate"));
const user_1 = __importDefault(require("../../src/data/user"));
const machineServices_1 = __importDefault(require("../../src/services/machineServices"));
const mongoose_1 = require("mongoose");
describe("Machine Services Tests", () => {
    beforeAll(() => { });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () { }));
    // Clean up for each test
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // Clean up database entries for tests
    afterEach(() => {
        jest.restoreAllMocks();
    });
    // machineServices tests
    // Fetch machine
    test("Fetch machine --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const expected = [
            {
                name: "Bench Press",
                muscle: "Pectoralis major",
            },
        ];
        const email = "pbuff@gmail.com";
        const name = "Bench Press";
        const muscle = "Pectoralis major";
        user_1.default.aggregate = jest.fn().mockResolvedValue(expected);
        const result = yield machineServices_1.default.getMachines(name, muscle, email);
        expect(result).toBeTruthy();
        expect(result.length).toBe(1);
        expect(result[0].name).toBe(name);
        expect(result[0].muscle).toBe(muscle);
    }));
    test("Fetch saved machiens --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const stubId = "";
        const expected = [
            new machine_1.default({
                name: "Leg Press",
                muscle: "Gluteus maximus",
                attributes: [
                    {
                        name: "wegith",
                        unit: "lbs",
                    },
                ],
            }),
            new machine_1.default({
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
        const template = new sessionTemplate_1.default({
            machineIds: expected,
            workout: [],
        });
        sessionTemplate_1.default.findById = jest.fn().mockResolvedValue(template);
        const result = yield machineServices_1.default.getSavedMachines(stubId);
        expect(result).toBeTruthy();
        expect(result === null || result === void 0 ? void 0 : result.length).toBe(2);
    }));
    // Update machine
    test("Update machine --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "pbuff@gmail.com";
        const currentName = "Leg Press";
        const machines = [
            new machine_1.default({
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
        const updatedMachine = new machine_1.default({
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
        user_1.default.aggregate = jest.fn().mockResolvedValue(machines);
        machine_1.default.findByIdAndUpdate = jest.fn().mockResolvedValue(expected);
        const result = yield machineServices_1.default.updateMachine(email, currentName, updatedMachine);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result.name).toBe(updatedMachine.name);
        expect(result.muscle).toBe(updatedMachine.muscle);
    }));
    // Delete machine
    test("Delete machine --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "pbuff@gmail.com";
        const name = "Pull Down";
        const machineId = "mock-machine-id";
        const machineLogId = "mock-log-id";
        const machineToDelete = {
            _id: machineId,
            name: "Pull Down",
        };
        const list = [machineToDelete];
        const aggregateMethod = jest.spyOn(user_1.default, 'aggregate');
        const findByIdAndDeleteMethod = jest.spyOn(machine_1.default, 'findByIdAndDelete');
        const findOneMethod = jest.spyOn(user_1.default, 'findOne');
        const findOneAndUpdateMethod = jest.spyOn(machineLog_1.default, 'findOneAndUpdate');
        aggregateMethod.mockResolvedValue(list);
        findByIdAndDeleteMethod.mockResolvedValue(machineToDelete);
        findOneMethod.mockResolvedValue({
            email: email,
            machineLogId: machineLogId
        });
        findOneAndUpdateMethod.mockResolvedValue({
            _id: machineLogId,
            machineIds: []
        });
        const result = yield machineServices_1.default.deleteMachine(email, name);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result.name).toBe(name);
        expect(aggregateMethod).toHaveBeenCalled();
        expect(findByIdAndDeleteMethod).toHaveBeenCalledWith(machineId);
        // Tests for deletion from machineLog
        expect(findOneMethod).toHaveBeenCalledWith({ email: email });
        expect(findOneAndUpdateMethod).toHaveBeenCalledWith({
            _id: machineLogId
        }, { $pull: { machineIds: machineId }
        });
        const machineLogResult = yield findOneAndUpdateMethod.mock.results[0].value;
        expect(machineLogResult.machineIds).toEqual([]);
    }));
    // Add machine
    test("Add machine --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "pbuff@gmail.com";
        const machineList = [];
        const newMachine = new machine_1.default({
            name: "Shoulder Press",
            muscle: "Deltoids",
            attributes: [
                {
                    name: "weight",
                    unit: "kgs",
                },
            ],
        });
        user_1.default.findOne = jest.fn().mockResolvedValue(machineList);
        machineLog_1.default.findOneAndUpdate = jest
            .fn()
            .mockResolvedValue(newMachine);
        jest.spyOn(machine_1.default.prototype, "save").mockResolvedValue(newMachine);
        const result = yield machineServices_1.default.addMachine(newMachine, email);
        expect(result).toBeTruthy();
        expect(result.name).toBe(newMachine.name);
        expect(result.muscle).toBe(newMachine.muscle);
    }));
    test("Save Machine --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const newMachine = new machine_1.default({
            name: "Shoulder Press",
            muscle: "Deltoids",
            attributes: [
                {
                    name: "weight",
                    unit: "kgs",
                },
            ],
        });
        const newMachineId = ((_a = newMachine._id) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        const template = new sessionTemplate_1.default({
            workout: [],
            machineIds: [newMachineId],
        });
        const templateId = ((_b = template._id) === null || _b === void 0 ? void 0 : _b.toString()) || "";
        sessionTemplate_1.default.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(template);
        const result = yield machineServices_1.default.saveMachine(newMachineId, templateId);
        expect(result).toBeTruthy();
        expect(result === null || result === void 0 ? void 0 : result.machineIds[0].toString()).toBe(newMachineId);
    }));
    test("Remove machine --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const template = new sessionTemplate_1.default({
            workout: [],
            machineIds: [
                new machine_1.default({
                    _id: new mongoose_1.Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
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
        const newTemplate = new sessionTemplate_1.default(template);
        newTemplate.machineIds = [];
        const machineId = "6458a28d1f3d7c9a8e1b2c46";
        const templateId = ((_a = template._id) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        sessionTemplate_1.default.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(newTemplate);
        const result = yield machineServices_1.default.removeMachine(machineId, templateId);
        expect(result).toBeTruthy();
        expect(result === null || result === void 0 ? void 0 : result.machineIds.length).toBe(0);
    }));
    //Get attributes
    test("Get attributes --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const machineId = "65f18342cf5b93ee8b0b87d4";
        const expected = {
            attributes: [
                {
                    name: "weight",
                    unit: "lbs",
                },
            ],
        };
        machine_1.default.findById = jest.fn().mockResolvedValue(expected);
        const result = yield machineServices_1.default.getAttributes(machineId);
        expect(result).toBeTruthy();
        expect(result[0].name).toBe("weight");
        expect(result[0].unit).toBe("lbs");
    }));
    test("Add attribute --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const machineId = "65f18342cf5b93ee8b0b87d4";
        const name = "calories";
        const unit = "cal";
        const machine = new machine_1.default({
            name: "Shoulder Press",
            muscle: "Deltoids",
            attributes: [
                {
                    name: "weight",
                    unit: "kgs",
                },
            ],
        });
        machine_1.default.findById = jest.fn().mockResolvedValue(machine);
        jest.spyOn(machine_1.default.prototype, "save").mockResolvedValue(machine);
        const result = yield machineServices_1.default.addAttribute(machineId, name, unit);
        console.log(result);
        expect(result).toBeTruthy();
        expect(result.attributes[1].name).toBe(name);
        expect(result.attributes[1].unit).toBe(unit);
    }));
    test("Delete attribute --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const machineId = "65f18342cf5b93ee8b0b87d4";
        const attrName = "weight";
        const machine = new machine_1.default({
            name: "Shoulder Press",
            muscle: "Deltoids",
            attributes: [],
        });
        machine_1.default.findByIdAndUpdate = jest.fn().mockResolvedValue(machine);
        const result = yield machineServices_1.default.deleteAttribute(machineId, attrName);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result.attributes.length).toBe(0);
    }));
    // These tests exist to hit the catch blocks
    test("Add machine --- failure save", () => __awaiter(void 0, void 0, void 0, function* () {
        user_1.default.findOne = jest.fn().mockResolvedValue(null);
        jest.spyOn(machine_1.default.prototype, "save").mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.reject(new Error("boom"));
        }));
        machineLog_1.default.findOneAndUpdate = jest.fn().mockResolvedValue(null);
        try {
            const email = "pbuff@gmail.com";
            const newMachine = new machine_1.default({
                name: "Shoulder Press",
                muscle: "Deltoids",
                attributes: [
                    {
                        name: "weight",
                        unit: "kgs",
                    },
                ],
            });
            yield machineServices_1.default.addMachine(newMachine, email);
            fail("Test Should Not Be Here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
    }));
    // These tests exist to hit the catch blocks
    test("Add machine --- failure save", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "pbuff@gmail.com";
        const newMachine = new machine_1.default({
            name: "Shoulder Press",
            muscle: "Deltoids",
            attributes: [
                {
                    name: "weight",
                    unit: "kgs",
                },
            ],
        });
        user_1.default.findOne = jest.fn().mockResolvedValue(null);
        jest.spyOn(machine_1.default.prototype, "save").mockResolvedValue(newMachine);
        machineLog_1.default.findOneAndUpdate = jest
            .fn()
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.reject(new Error("boom"));
        }));
        const result = yield machineServices_1.default.addMachine(newMachine, email);
        expect(result).toBeTruthy();
    }));
    // These tests exist to hit the catch blocks
    test("Add machine --- failure save", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "pbuff@gmail.com";
        const newMachine = new machine_1.default({
            name: "Shoulder Press",
            muscle: "Deltoids",
            attributes: [
                {
                    name: "weight",
                    unit: "kgs",
                },
            ],
        });
        user_1.default.findOne = jest.fn().mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.reject(new Error("boom"));
        }));
        jest.spyOn(machine_1.default.prototype, "save").mockResolvedValue(newMachine);
        const result = yield machineServices_1.default.addMachine(newMachine, email);
        expect(result).toBeTruthy();
    }));
    test("Save Machine -- failure", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const newMachine = new machine_1.default({
            name: "Shoulder Press",
            muscle: "Deltoids",
            attributes: [
                {
                    name: "weight",
                    unit: "kgs",
                },
            ],
        });
        const machineId = ((_a = newMachine === null || newMachine === void 0 ? void 0 : newMachine._id) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        const stubId = "1";
        sessionTemplate_1.default.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(null);
        const result = yield machineServices_1.default.saveMachine(machineId, stubId);
        expect(result).toBeFalsy();
    }));
    test("Remove machine --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const template = new sessionTemplate_1.default({
            workout: [],
            machineIds: [
                new machine_1.default({
                    _id: new mongoose_1.Types.ObjectId("65f18f3ac6dc7f8d5a1234ab"),
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
        const newTemplate = new sessionTemplate_1.default(template);
        newTemplate.machineIds = [];
        const machineId = "6458a28d1f3d7c9a8e1b2c46";
        const templateId = ((_a = template._id) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        sessionTemplate_1.default.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(null);
        const result = yield machineServices_1.default.removeMachine(machineId, templateId);
        expect(result).toBeFalsy();
    }));
    test("Get attribute --- failure", () => __awaiter(void 0, void 0, void 0, function* () {
        machine_1.default.findById = jest.fn().mockResolvedValue(null);
        const machineId = "65f11142cf5b93ee8b0b87d4";
        const result = yield machineServices_1.default.getAttributes(machineId);
        expect(result).toBeFalsy();
    }));
    test("Add attribute --- failure", () => __awaiter(void 0, void 0, void 0, function* () {
        machine_1.default.findById = jest.fn().mockResolvedValue(null);
        const machineId = "65f11142cf5b93ee8b0b87d4";
        const name = "calories";
        const unit = "cal";
        const result = yield machineServices_1.default.addAttribute(machineId, name, unit);
        expect(result).toBeFalsy();
    }));
    test("Delete attribute --- failure", () => __awaiter(void 0, void 0, void 0, function* () {
        machine_1.default.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
        const machineId = "65f11142cf5b93ee8b0b87d4";
        const attrName = "weight";
        const result = yield machineServices_1.default.deleteAttribute(machineId, attrName);
        expect(result).toBeFalsy();
    }));
    test("Fetch saved machines --- failure", () => __awaiter(void 0, void 0, void 0, function* () {
        const stubId = "";
        sessionTemplate_1.default.findById = jest.fn().mockResolvedValue(null);
        const result = yield machineServices_1.default.getSavedMachines(stubId);
        expect(result).toBeFalsy();
    }));
});
