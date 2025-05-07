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
const machine_1 = __importDefault(require("../data/machine"));
const machineLog_1 = __importDefault(require("../data/machineLog"));
const user_1 = __importDefault(require("../data/user"));
const sessionTemplate_1 = __importDefault(require("../data/sessionTemplate"));
/**
 * Gets list of all machines associated with a user
 *
 * @param {String} userEmail - The user email
 * @return {Promise} - List of machines
 */
function getListOfMachinesAggregate(userEmail) {
    return [
        { $match: { email: userEmail } }, // Find user by email
        {
            //Attach all machineLogs as an array called collectedMachineLogs.
            $lookup: {
                from: "machineLogs",
                localField: "machineLogId",
                foreignField: "_id",
                as: "collectedMachineLogs",
            },
        },
        //Turn collectedMachineLogs from an array into multiple objects.
        { $unwind: "$collectedMachineLogs" },
        {
            //Attach all machines as an array called collectedMachines.
            $lookup: {
                from: "machines",
                localField: "collectedMachineLogs.machineIds",
                foreignField: "_id",
                as: "collectedMachines",
            },
        },
        //Turn collectedMachines from an array into multiple objects.
        { $unwind: "$collectedMachines" },
        {
            //renames "$collectedMachines.name" and "$collectedMachines.muscle" as top level fields called name and muscle.
            $project: {
                name: "$collectedMachines.name",
                muscle: "$collectedMachines.muscle",
                _id: "$collectedMachines._id",
            },
        },
    ];
}
/**
 * Add a machine
 *
 * @param {MachineType} machine - Machine to add
 * @param {email} string - User email associated to machine
 *
 * @returns {Promise} - Machine added
 */
function addMachine(machine, email) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`IN MACHINESERVICES machine: ${JSON.stringify(machine)}, email: ${email}`);
        //console.log(email);
        const machineToAdd = new machine_1.default(machine);
        //Second promise to find a machineLogId
        user_1.default
            .findOne({ email: email })
            .then((foundUser) => machineLog_1.default.findOneAndUpdate({ _id: foundUser === null || foundUser === void 0 ? void 0 : foundUser.machineLogId }, //previously queried user.
        { $push: { machineIds: machineToAdd._id } }))
            .catch((err) => console.log(err));
        return machineToAdd.save();
    });
}
/**
 * Add machine to template
 *
 * @param {string} machineId - Machine object id
 * @param {string} templateId - ID to template object
 *
 * @returns {Promise} - Machine saved
 */
function saveMachine(machineId, templateId) {
    return sessionTemplate_1.default.findByIdAndUpdate(templateId, {
        $push: { machineIds: machineId },
    }, { new: true });
}
/**
 * Get all machines that match the critera
 *
 * @param {String} name - Name of machine to find
 * @param {String} muscle - Name of muscle group to find
 * @param {String} userEmail - User associated with search
 *
 * @returns {Promise<MachineType[]>} - List of machines meeting criteria
 */
function getMachines(name, muscle, userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        const listOfMachines = getListOfMachinesAggregate(userEmail);
        //if there is a name add it to the aggregate to find it.
        if (name) {
            listOfMachines.push({ $match: { name: name } });
        }
        //if there is a muscle add it to the aggregate to find it.
        if (muscle) {
            listOfMachines.push({ $match: { muscle: muscle } });
        }
        return user_1.default.aggregate(listOfMachines);
    });
}
/**
 * Get all saved machines from a template
 *
 * @param {string} templateId - Template object id
 *
 * @returns {Promise} - List of machines in template
 */
function getSavedMachines(templateId) {
    return __awaiter(this, void 0, void 0, function* () {
        return sessionTemplate_1.default
            .findById(templateId)
            .then((template) => {
            if (template == null) {
                throw new Error("No template found");
            }
            return template.machineIds;
        })
            .catch((error) => {
            console.log(error);
            return null;
        });
    });
}
/**
 * Removes a machine from a template
 *
 * @param {string} machineId - Name of Machine
 * @param {string} templateId - Template object id
 *
 * @returns {Promise} - Remove machine from template
 */
function removeMachine(machineId, templateId) {
    return __awaiter(this, void 0, void 0, function* () {
        return sessionTemplate_1.default.findByIdAndUpdate(templateId, {
            $pull: { machineIds: machineId },
        }, { new: true });
    });
}
// TODO: Fix this function to also delete a machine from the machine_log document.
/**
 * Removes a machine
 *
 * @param {String} userEmail - Associated user
 * @param {String} machineName - Name of Machine
 *
 * @returns {Promise} - Remove machine
 */
function deleteMachine(userEmail, machineName) {
    return __awaiter(this, void 0, void 0, function* () {
        const listOfMachines = getListOfMachinesAggregate(userEmail);
        listOfMachines.push({ $match: { name: machineName } }); //match with the correct machine.
        console.log(listOfMachines);
        return user_1.default
            .aggregate(listOfMachines) //get the machine that has the Id to remove.
            .then((machineList) => {
            console.log(machineList);
            const machine = machineList[0];
            return machine_1.default
                .findByIdAndDelete(machine._id) //remove the machine with the found Id
                .then((deletedMachine) => {
                return user_1.default
                    .findOne({ email: userEmail })
                    .then((user) => {
                    return machineLog_1.default
                        .findOneAndUpdate({ _id: user.machineLogId }, { $pull: { machineIds: machine._id } })
                        .then(() => deletedMachine);
                });
            });
        });
    });
}
/**
 * Update a machine with a new one
 *
 * @param {String} userEmail - Associated user
 * @param {String} currentName - Name of machine to change
 * @param {MachineType} updatedMachine - New machine to replace the old one with
 *
 * @returns {Promise} - Update machine
 */
function updateMachine(userEmail, currentName, updatedMachine) {
    return __awaiter(this, void 0, void 0, function* () {
        //aggregate to get the machine to update.
        const listOfMachines = getListOfMachinesAggregate(userEmail);
        listOfMachines.push({ $match: { name: currentName } });
        return user_1.default
            .aggregate(listOfMachines) //get the machine to update.
            .then((machineList) => {
            const machine = machineList[0];
            return machine_1.default.findByIdAndUpdate(machine._id, {
                $set: {
                    name: updatedMachine.name,
                    muscle: updatedMachine.muscle,
                    attributes: updatedMachine.attributes,
                },
            }, {
                new: true,
            }); //update the machine.
        });
    });
}
/**
 * Get the attributes of a machine by id
 *
 * @param {String} machineId - Object id of machine to search
 * @returns {Promise} - Get attributes of a machine
 */
function getAttributes(machineId) {
    return __awaiter(this, void 0, void 0, function* () {
        return machine_1.default
            .findById(machineId)
            .then((machine) => {
            if (!machine) {
                throw new Error("Machine not found");
            }
            return machine.attributes;
        })
            .catch((error) => {
            console.log(error);
            return null;
        });
    });
}
/**
 * Add attribute to a machine
 *
 * @param {String} machineId - Id to idenify the machine
 * @param {String} name - Name of attribute
 * @param {String} unit - Unit of measure for given measure
 * @returns {Promise} - Attribute added to machine
 */
function addAttribute(machineId, name, unit) {
    return __awaiter(this, void 0, void 0, function* () {
        return machine_1.default
            .findById(machineId)
            .then((machine) => {
            if (!machine) {
                throw new Error("Machine not found");
            }
            machine.attributes.push({ name: name, unit: unit });
            return machine.save();
        })
            .catch((error) => {
            console.log(error);
            return null;
        });
    });
}
/**
 * Remove an attribute
 *
 * @param {String} machineId - Unique Id of the machine
 * @param {String} attrName - Attribute to remove
 * @returns {Promise} - Remove attribute
 */
function deleteAttribute(machineId, attrName) {
    return __awaiter(this, void 0, void 0, function* () {
        return machine_1.default
            .findByIdAndUpdate(machineId, { $pull: { attributes: { name: attrName } } }, { new: true })
            .then((machine) => {
            if (!machine) {
                throw new Error("Machine not found");
            }
            return machine;
        })
            .catch((error) => {
            console.log(error);
            return null;
        });
    });
}
exports.default = {
    addMachine,
    getMachines,
    getSavedMachines,
    saveMachine,
    removeMachine,
    deleteMachine,
    updateMachine,
    getAttributes,
    addAttribute,
    deleteAttribute,
};
