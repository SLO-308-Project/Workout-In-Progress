import machineLogModel from "../data/machineLog";
import userModel, {UserType} from "../data/user";
import sessionLogModel from "../data/sessionLog";

//Add a user.

function createMachineLogAndSessionLog(user: UserType)
{
    const createdSessionLog = new sessionLogModel()
        .save()
        .then((result) =>
        {
            user.sessionLogId = result._id;
            return;
        })
        .catch((error) =>
        {
            console.log("create empty sessionLog error: " + error);
            throw error;
        });

    const createdMachineLog = new machineLogModel()
        .save()
        .then((result) =>
        {
            user.machineLogId = result._id;
        })
        .catch((error) =>
        {
            console.log("create empty machineLog error: " + error);
            throw error;
        });

    return Promise.all(
        //returns a promise where both promises are complete.
        [
            //create sessionLog and update user.
            createdSessionLog,
            createdMachineLog,
        ],
    );
}

async function addUser(user: UserType)
{
    return createMachineLogAndSessionLog(user).then(() =>
    {
        //both the machine and session logs have been created.
        const userToAdd = new userModel(user);
        const prom = userToAdd.save();
        return prom;
    });
}

export default {
    addUser,
};
