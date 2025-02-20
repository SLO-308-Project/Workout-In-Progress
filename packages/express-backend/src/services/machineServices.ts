import machineModel, {machineType} from "../data/machine";
import userModel from "../data/user";

//adds a machine.
function addMachine(machineJSON: machineType, email: string)
{
    const prom = userModel.updateOne(
        {email: email}, //what user you want to update in usermodel.
        {$push: {machines: machineJSON}}, //how you want to update the user.
    );
    return prom;
}

//gets machine's based on parameters.
function getMachines(name: string, muscle: string, userEmail: string)
{

    const result = userModel.aggregate([
        {$match: {email: userEmail}},
        {$project: {machines: 1, _id: 0}},
        {$unwind: "$machines"},
        {$match: {"machines.name": "bench press"}}
    ]);
    // const result2 = userModel.findOne(
    //     {email: userEmail},
    //     {_id:0, machines: 1},
    // );
    console.log(name + "  " + muscle);
    //let result;
//     if (!name && !muscle)
//     {
//         console.log();
// //        return result;
//     }
//     else if (name && !muscle)
//     {
//         result.find({machines: {name: name}});
//     }
//     else if (!name && muscle)
//     {
//         result.find({machines: {muscle: muscle}});
//     }
//     //name and muscle
//     else
//     {
//         result.find({machines: {name: name, muscle: muscle}});
//     }
    return result;
}

//deletes a machine by it's unique name.
function deleteMachine(userEmail: string, machineName: string)
{
    return userModel.updateOne(
        {email: userEmail},
        {$pull: {machines: {name: machineName}}}
    );
    //return machineModel.findOneAndDelete({name: machineName});
}

//updates a machine based on parameters
function updateMachine(
    currentName: string,
    newName: string | undefined,
    newMuscle: string | undefined,
)
{
    let result;
    if (newName && newMuscle)
    {
        result = machineModel.findOneAndUpdate(
            {name: currentName},
            {
                name: newName,
                muscle: newMuscle,
            },
            {new: true},
        );
    }
    else if (newName && !newMuscle)
    {
        result = machineModel.findOneAndUpdate(
            {name: currentName},
            {name: newName},
            {new: true},
        );
    }
    else if (!newName && newMuscle)
    {
        result = machineModel.findOneAndUpdate(
            {name: currentName},
            {muscle: newMuscle},
            {new: true},
        );
        // if no parameters given return original machine
    }
    else
    {
        result = machineModel.find({name: currentName});
    }
    return result;
}

export default {
    addMachine,
    getMachines,
    deleteMachine,
    updateMachine,
};
