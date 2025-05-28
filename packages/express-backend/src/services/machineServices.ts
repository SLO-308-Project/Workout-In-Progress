import mongoose, {PipelineStage, Types} from "mongoose";
import machineModel, {MachineType} from "../data/machine";
import machineLogModel from "../data/machineLog";
import userModel from "../data/user";
import sessionTemplateModel from "../data/sessionTemplate";

/**
 * Gets list of all machines associated with a user
 *
 * @param {string} userId - The user's ID
 * @return {Promise} - List of machines
 */
function getListOfMachinesAggregate(userId: string)
{
    return [
        {$match: {_id: new Types.ObjectId(userId)}}, // Find user by email
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
 * @returns {Promise} - Machine added
 */
async function addMachine(machine: MachineType, userId: string)
{
    //console.log(
    //    `IN MACHINESERVICES machine: ${JSON.stringify(machine)}, email: ${email}`,
    //);
    //console.log(email);
    const machineToAdd = new machineModel(machine);
    const savedMachine = await machineToAdd.save();

    //Second promise to find a machineLogId
    userModel
        .findOne({_id: userId})
        .then((foundUser) =>
            machineLogModel.findOneAndUpdate(
                {_id: foundUser?.machineLogId}, //previously queried user.
                {$push: {machineIds: machineToAdd._id}}, //previously added machine _id.
            ),
        )
        .catch((err) => console.log(err));

    return savedMachine;
}

/**
 * Save a session machine to template
 *
 * @param {string} machineId - Machine object id
 * @param {string} templateId - ID to template object
 * @param {mongoose.ClientSession} [session] - Optional Mongo Session
 * @returns {Promise} - Machine saved
 */
async function saveMachine(
    machineId: string,
    templateId: string,
    options?: {session?: mongoose.ClientSession},
)
{
    const machine = await machineModel.findById(machineId, null, options);
    if (machine === null)
    {
        return null;
    }
    const updateOptions = {
        new: true,
        ...options,
    };
    machine._id = new Types.ObjectId();
    machine.attributes.map((attribute) =>
    {
        attribute._id = new Types.ObjectId();
    });
    return sessionTemplateModel.findByIdAndUpdate(
        templateId,
        {
            $push: {machines: machine},
        },
        updateOptions,
    );
}

/**
 * Save a template machine to template
 *
 * @param {string} sourceTemplateId - Id to template containing machine
 * @param {string} machineId - Machine object id
 * @param {string} destinationTemplateId - ID to template object to copy into
 * @param {mongoose.ClientSession} [session] - Optional Mongo Session
 * @returns {Promise} - Machine saved
 */
async function saveMachineFromTemplate(
    machineId: string,
    templateId: string,
    sourceTemplateId: string,
    options?: {session?: mongoose.ClientSession},
)
{
    const updateOptions = {
        new: true,
        ...options,
    };
    return sessionTemplateModel
        .findById(sourceTemplateId, null, options)
        .then((template) =>
        {
            const machine = template?.machines.filter((mach) =>
            {
                return mach._id?.toString() !== machineId;
            });
            if (!machine)
            {
                return null;
            }
            machine[0]._id = new Types.ObjectId();
            machine[0].attributes.map((attribute) =>
            {
                attribute._id = new Types.ObjectId();
            });
            return machine[0];
        })
        .then((machine) =>
        {
            return sessionTemplateModel.findByIdAndUpdate(
                templateId,
                {
                    $push: {machines: machine},
                },
                updateOptions,
            );
        })
        .catch((error) =>
        {
            console.log(error);
            return null;
        });
}

/**
 * Get all machines that match the critera
 *
 * @param {string} name - Name of machine to find
 * @param {string} muscle - Name of muscle group to find
 * @param {string} userId - User associated with search
 *
 * @returns {Promise<MachineType[]>} - List of machines meeting criteria
 */
async function getMachines(
    name: string,
    muscle: string,
    userId: string,
): Promise<MachineType[]>
{
    const listOfMachines: PipelineStage[] = getListOfMachinesAggregate(userId);

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

/**
 * Get all machines that match the critera
 *
 * @param {string[]} ids - Array of ids to search by
 * @param {string} userId - User associated with search
 * @param {mongoose.ClientSession} [options] - Optional Mongoose Session
 *
 * @returns {Promise<MachineType[]>} - List of machines meeting criteria
 */
async function getMachinesByIds(
    ids: string[],
    userId: string,
    options?: {session?: mongoose.ClientSession},
)
{
    const listOfMachines: PipelineStage[] = getListOfMachinesAggregate(userId);
    listOfMachines.push({
        $match: {_id: {$in: ids.map((id) => new mongoose.Types.ObjectId(id))}},
    });
    const aggregate = userModel.aggregate(listOfMachines);

    if (options?.session)
    {
        aggregate.session(options.session);
    }

    return aggregate
        .exec()
        .then((machines) =>
        {
            const machineIds = machines.map(
                (machine) => (machine as MachineType)._id,
            );
            return machineModel.find({_id: {$in: machineIds}});
        })
        .catch((error) =>
        {
            console.log(error);
            return null;
        });
}

/**
 * Get all saved machines from a template
 *
 * @param {string} templateId - Template object id
 * @param {mongoose.ClientSession} [session] - Optional Mongoose Session
 *
 * @returns {Promise} - List of machines in template
 */
async function getSavedMachines(
    templateId: string,
    options?: {session?: mongoose.ClientSession},
)
{
    return sessionTemplateModel
        .findById(templateId, options)
        .then((template) =>
        {
            if (template == null)
            {
                throw new Error("No template found");
            }
            console.log(template.machines);
            return template.machines;
        })
        .catch((error) =>
        {
            console.log(error);
            return null;
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
async function removeMachine(machineId: string, templateId: string)
{
    return sessionTemplateModel.findByIdAndUpdate(
        templateId,
        {
            $pull: {machines: {$match: {_id: machineId}}},
        },
        {new: true},
    );
}

// TODO: Fix this function to also delete a machine from the machine_log document.
/**
 * Removes a machine
 *
 * @param {string} userId - Associated user
 * @param {string} machineName - Name of Machine
 *
 * @returns {Promise} - Remove machine
 */
async function deleteMachine(userId: string, machineName: string)
{
    const listOfMachines: PipelineStage[] = getListOfMachinesAggregate(userId);
    listOfMachines.push({$match: {name: machineName}}); //match with the correct machine.
    console.log(listOfMachines);

    return userModel
        .aggregate(listOfMachines) //get the machine that has the Id to remove.
        .then((machineList) =>
        {
            console.log(machineList);
            const machine = machineList[0] as MachineType;
            return machineModel
                .findByIdAndDelete(machine._id) //remove the machine with the found Id
                .then((deletedMachine) =>
                {
                    return userModel.findOne({_id: userId}).then((user) =>
                    {
                        return machineLogModel
                            .findOneAndUpdate(
                                {_id: user!.machineLogId},
                                {$pull: {machineIds: machine._id}},
                            )
                            .then(() => deletedMachine);
                    });
                });
        });
}

/**
 * Update a machine with a new one
 *
 * @param {string} userId - Associated user
 * @param {string} currentName - Name of machine to change
 * @param {MachineType} updatedMachine - New machine to replace the old one with
 *
 * @returns {Promise} - Update machine
 */
async function updateMachine(
    userId: string,
    currentName: string,
    updatedMachine: MachineType,
)
{
    //aggregate to get the machine to update.
    const listOfMachines: PipelineStage[] = getListOfMachinesAggregate(userId);
    listOfMachines.push({$match: {name: currentName}});

    return userModel
        .aggregate(listOfMachines) //get the machine to update.
        .then((machineList) =>
        {
            const machine = machineList[0] as MachineType;
            return machineModel.findByIdAndUpdate(
                machine._id,
                {
                    $set: {
                        name: updatedMachine.name,
                        muscle: updatedMachine.muscle,
                        attributes: updatedMachine.attributes,
                    },
                },
                {
                    new: true,
                },
            ); //update the machine.
        });
}

/**
 * Get the attributes of a machine by id
 *
 * @param {string} machineId - Object id of machine to search
 * @returns {Promise} - Get attributes of a machine
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
 * @param {string} machineId - Id to idenify the machine
 * @param {string} name - Name of attribute
 * @param {string} unit - Unit of measure for given measure
 * @returns {Promise} - Attribute added to machine
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
 * @param {string} machineId - Unique Id of the machine
 * @param {string} attrName - Attribute to remove
 * @returns {Promise} - Remove attribute
 */
async function deleteAttribute(machineId: string, attrName: string)
{
    return machineModel
        .findByIdAndUpdate(
            machineId,
            {$pull: {attributes: {name: attrName}}},
            {new: true},
        )
        .then((machine) =>
        {
            if (!machine)
            {
                throw new Error("Machine not found");
            }
            return machine;
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
    getMachinesByIds,
    getSavedMachines,
    saveMachine,
    saveMachineFromTemplate,
    removeMachine,
    deleteMachine,
    updateMachine,
    getAttributes,
    addAttribute,
    deleteAttribute,
};
