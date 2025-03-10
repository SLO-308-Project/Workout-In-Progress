import {PipelineStage} from "mongoose";
import machineModel, {machineType} from "../data/machine";
import machineLogModel from "../data/machineLog";
import userModel from "../data/user";

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

//Helper for addMachine.
function createMachineAndGetUser(machine: machineType, email: string)
{
    //first promise to add a machine and return _id.
    const machineToAdd = new machineModel(machine);
    const addedMachine = machineToAdd.save();

    //Second promise to find a machineLogId
    const foundUser = userModel.findOne({email: email});

    //returns a promise of both. Then is called when both are successful. Catch is called when at least one has an error.
    return Promise.all([addedMachine, foundUser]);
}

//adds a machine.
function addMachine(machine: machineType, email: string)
{
    //console.log(email);
    return createMachineAndGetUser(machine, email).then((result) =>
    {
        return machineLogModel.findOneAndUpdate(
            {_id: result[1]?.machineLogId}, //previously queried user.
            {$push: {machineIds: result[0]._id}}, //previously added machine _id.
        );
    });
}

//gets machine's based on parameters.
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

//deletes a machine by it's unique name.
function deleteMachine(userEmail: string, machineName: string)
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
            const machine = machineList[0] as machineType;
            return machineModel.findByIdAndDelete(machine._id); //remove the machine with the found Id
        });
}

//updates a machine based on parameters
function updateMachine(
    userEmail: string,
    currentName: string,
    updatedMachine: machineType,
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
            const machine = machineList[0] as machineType;
            return machineModel.findByIdAndUpdate(machine._id, updatedMachine); //update the machine.
        });
}

export default {
    addMachine,
    getMachines,
    deleteMachine,
    updateMachine,
};
