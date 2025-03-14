import {PipelineStage} from "mongoose";
import machineModel, {MachineType} from "../data/machine";
import machineLogModel from "../data/machineLog";
import userModel from "../data/user";

/**
 * Gets list of all machines associated with a user
 *
 * @param {String} userEmail - The user email
 * @return {Promise} List of machines
 */
function getListOfMachinesAggregate(userEmail: string)
{
    return [
        {$match: {email: userEmail}}, // Find user by email
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
        {$unwind: "$collectedMachineLogs"},
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
        {$unwind: "$collectedMachines"},
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
 * @returns {Promise} The added machine
 */
async function addMachine(machine: MachineType, email: string)
{
    console.log(
        `IN MACHINESERVICES machine: ${JSON.stringify(machine)}, email: ${email}`,
    );
    //console.log(email);
    const machineToAdd = new machineModel(machine);

    //Second promise to find a machineLogId
    userModel
        .findOne({email: email})
        .then((foundUser) =>
            machineLogModel.findOneAndUpdate(
                {_id: foundUser?.machineLogId}, //previously queried user.
                {$push: {machineIds: machineToAdd._id}}, //previously added machine _id.
            ),
        )
        .catch((err) => console.log(err));

    return machineToAdd.save();
}

/**
 * Get all machines that machine the critera
 *
 * @param {String} name - Name of machine to find
 * @param {String} muscle - Name of muscle group to find
 * @param {String} userEmail - User associated with search
 *
 * @returns {Promise} List of machines meeting criteria
 */
function getMachines(name: string, muscle: string, userEmail: string)
{
    const listOfMachines: PipelineStage[] =
        getListOfMachinesAggregate(userEmail);

    //if there is a name add it to the aggregate to find it.
    if (name)
    {
        listOfMachines.push({$match: {name: name}});
    }
    //if there is a muscle add it to the aggregate to find it.
    if (muscle)
    {
        listOfMachines.push({$match: {muscle: muscle}});
    }
    return userModel.aggregate(listOfMachines);
}

// TODO: Fix this function to also delete a machine from the machine_log document.
/**
 * Removes a machine
 *
 * @param {String} userEmail - Associated user
 * @param {String} machineName - Name of Machine
 *
 * @returns {Promise} - To remove machine
 */
async function deleteMachine(userEmail: string, machineName: string)
{
    const listOfMachines: PipelineStage[] =
        getListOfMachinesAggregate(userEmail);
    listOfMachines.push({$match: {name: machineName}}); //match with the correct machine.
    console.log(listOfMachines);

    return userModel
        .aggregate(listOfMachines) //get the machine that has the Id to remove.
        .then((machineList) =>
        {
            console.log(machineList);
            const machine = machineList[0] as MachineType;
            return machineModel.findByIdAndDelete(machine._id); //remove the machine with the found Id
        });
}

//updates a machine based on parameters
/**
 * Update a machine with a new one
 *
 * @param {String} userEmail - Associated user
 * @param {String} currentName - Name of machine to change
 * @param {MachineType} updatedMachine - New machine to replace the old one with
 *
 * @returns {Promise} - To update machine
 */
function updateMachine(
    userEmail: string,
    currentName: string,
    updatedMachine: MachineType,
)
{
    //aggregate to get the machine to update.
    const listOfMachines: PipelineStage[] =
        getListOfMachinesAggregate(userEmail);
    listOfMachines.push({$match: {name: currentName}});

    return userModel
        .aggregate(listOfMachines) //get the machine to upddate.
        .then((machineList) =>
        {
            const machine = machineList[0] as MachineType;
            return machineModel.findByIdAndUpdate(machine._id, updatedMachine, {
                new: true,
            }); //update the machine.
        });
}
// returns the attributes for a machine by its id only.
/**
 * Get the attributes of a machine
 *
 * @param {String} machineId
 * @returns {Promise} Get attributes of a machine
 */
async function getAttributes(machineId: string)
{
    return machineModel
        .findById(machineId)
        .then((machine) =>
        {
            if (!machine)
            {
                throw new Error("Machine not found");
            }
            return machine.attributes;
        })
        .catch((error) =>
        {
            console.log(error);
            return null;
        });
}

/**
 * Add attribute to a machine
 *
 * @param {String} machineId - Id to idenify the machine
 * @param {String} name - Name of attribute
 * @param {String} unit - Unit of measure for given measure
 * @returns {Promise} To add my attribute
 */
async function addAttribute(machineId: string, name: string, unit: string)
{
    return machineModel
        .findById(machineId)
        .then((machine) =>
        {
            if (!machine)
            {
                throw new Error("Machine not found");
            }
            machine.attributes.push({name: name, unit: unit});
            return machine.save();
        })
        .catch((error) =>
        {
            console.log(error);
            return null;
        });
}

/**
 * Remove an attribute
 *
 * @param {String} machineId - Unique Id of the machine
 * @param {String} attrName - Attribute to remove
 * @returns {Promise} To remvoe objstacles
 */
async function deleteAttribute(machineId: string, attrName: string)
{
    return machineModel
        .findById(machineId)
        .then((machine) =>
        {
            if (!machine)
            {
                throw new Error("Machine not found");
            }
            machine.attributes.pull({name: attrName});
            return machine.save();
        })
        .catch((error) =>
        {
            console.log(error);
            return null;
        });
}

export default {
    addMachine,
    getMachines,
    deleteMachine,
    updateMachine,
    getAttributes,
    addAttribute,
    deleteAttribute,
};
