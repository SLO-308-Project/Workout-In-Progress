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
const mongo_memory_server_config_1 = require("../util/mongo-memory-server-config");
const machine_1 = __importDefault(require("../../src/data/machine"));
const user_1 = __importDefault(require("../../src/data/user"));
const machineLog_1 = __importDefault(require("../../src/data/machineLog"));
const machineServices_1 = __importDefault(require("../../src/services/machineServices"));
const mongoose_1 = require("mongoose");
describe("Machine Services Tests", () => {
    // In memory database setup
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_memory_server_config_1.connect)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_memory_server_config_1.close)();
    }));
    // Build in memory database for tests
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Machine entries
        // Machine with a forced _id for testing purposes
        const dummyMachine1 = new machine_1.default({
            _id: new mongoose_1.Types.ObjectId("65f18342cf5b93ee8b0b87d4"),
            name: "Bench Press",
            muscle: "Pectoralis major",
            attributes: [
                {
                    name: "weight",
                    unit: "lbs",
                },
            ],
        });
        yield dummyMachine1.save();
        const dummyMachine2 = new machine_1.default({
            name: "Machine",
            muscle: "Muscle",
            attributes: [
                {
                    name: "weight",
                    unit: "kgs",
                },
            ],
        });
        yield dummyMachine2.save();
        const dummyMachine3 = new machine_1.default({
            name: "Leg Press",
            muscle: "Gluteus maximus",
            attributes: [
                {
                    name: "weight",
                    unit: "lbs",
                },
            ],
        });
        yield dummyMachine3.save();
        const dummyMachine4 = new machine_1.default({
            name: "Pull Down",
            muscle: "Latissimus Dorsi",
            attribute: [
                {
                    name: "weight",
                    unit: "lbs",
                },
            ],
        });
        yield dummyMachine4.save();
        // Machine Log entry
        const dummyMachineLog = new machineLog_1.default({
            machineIds: [
                // Type assertion since we know it can't be null since we created
                dummyMachine1._id,
                dummyMachine2._id,
                dummyMachine3._id,
                dummyMachine4._id,
            ],
        });
        yield dummyMachineLog.save();
        // User entry
        const dummyUser = new user_1.default({
            name: "Philip Buff",
            email: "pbuff@gmail.com",
            password: "pass123",
            units: "lbs",
            machineLogId: dummyMachineLog._id,
        });
        const userResult = new user_1.default(dummyUser);
        yield userResult.save();
    }));
    // Clean up database entries for tests
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield machine_1.default.deleteMany();
        yield machineLog_1.default.deleteMany();
        yield user_1.default.deleteMany();
    }));
    // machineServices tests
    // Fetch machine
    test("Fetch machine --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const name = "Bench Press";
        const muscle = "Pectoralis major";
        const email = "pbuff@gmail.com";
        const result = yield machineServices_1.default.getMachines(name, muscle, email);
        expect(result).toBeTruthy();
        expect(result.length).toBe(1);
        expect(result[0].name).toBe(name);
        expect(result[0].muscle).toBe(muscle);
    }));
    // Update machine
    test("Update machine --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "pbuff@gmail.com";
        const currentName = "Leg Press";
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
        const result = yield machineServices_1.default.deleteMachine(email, name);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result.name).toBe(name);
    }));
    // Add machine
    test("Add machine --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield machineServices_1.default.addMachine(newMachine, email);
        expect(result).toBeTruthy();
        expect(result.name).toBe(newMachine.name);
        expect(result.muscle).toBe(newMachine.muscle);
    }));
    //Get attributes
    test("Get attributes --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const machineId = "65f18342cf5b93ee8b0b87d4";
        const result = yield machineServices_1.default.getAttributes(machineId);
        expect(result).toBeTruthy();
        expect(result[0].name).toBe("weight");
        expect(result[0].unit).toBe("lbs");
    }));
    test("Add attribute --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const machineId = "65f18342cf5b93ee8b0b87d4";
        const name = "calories";
        const unit = "cal";
        const result = yield machineServices_1.default.addAttribute(machineId, name, unit);
        expect(result).toBeTruthy();
        expect(result.attributes[1].name).toBe(name);
        expect(result.attributes[1].unit).toBe(unit);
    }));
    test("Delete attribute --- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const machineId = "65f18342cf5b93ee8b0b87d4";
        const attrName = "weight";
        const result = yield machineServices_1.default.deleteAttribute(machineId, attrName);
        expect(result).toBeTruthy();
        // ! to assume we are not null for type safety, previous line should guarantee that if we get this far
        expect(result.attributes.length).toBe(0);
    }));
    // These tests exist to hit the catch blocks
    test("Add machine --- failure", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // breaks database connection to force an error
            yield (0, mongo_memory_server_config_1.close)();
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
            fail("Test shouldn't get here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
        finally {
            yield (0, mongo_memory_server_config_1.connect)();
        }
    }));
    test("Get attribute --- failure", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // machine id is not a machine in database forces error
            const machineId = "65f11142cf5b93ee8b0b87d4";
            yield machineServices_1.default.getAttributes(machineId);
            fail("Test shouldn't get here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
    }));
    test("Add attribute --- failure", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const machineId = "65f11142cf5b93ee8b0b87d4";
            const name = "calories";
            const unit = "cal";
            yield machineServices_1.default.addAttribute(machineId, name, unit);
            fail("Test shouldn't get here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
    }));
    test("Delete attribute --- failure", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const machineId = "65f11142cf5b93ee8b0b87d4";
            const attrName = "weight";
            yield machineServices_1.default.deleteAttribute(machineId, attrName);
            fail("Test shouldn't get here");
        }
        catch (error) {
            expect(error).toBeTruthy();
        }
    }));
});
