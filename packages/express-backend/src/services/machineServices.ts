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
function getMachines(name: string | undefined, muscle: string | undefined)
{
    console.log(name + "  " + muscle);
    let result;
    if (!name && !muscle)
    {
        result = machineModel.find();
    }
    else if (name && !muscle)
    {
        result = machineModel.find({name: name});
    }
    else if (!name && muscle)
    {
        result = machineModel.find({muscle: muscle});
    }
    //name and muscle
    else
    {
        result = machineModel.find({name: name, muscle: muscle});
    }
    return result;
}

//deletes a machine by it's unique name.
function deleteMachine(name: string)
{
    return machineModel.findOneAndDelete({name: name});
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
