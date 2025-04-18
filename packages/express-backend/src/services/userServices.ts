import machineLogModel from "../data/machineLog";
import userModel, {UserType} from "../data/user";
import sessionLogModel from "../data/sessionLog";

/**
 * Create logs for machine and sessions for a user
 *
 * @param {UserType} user - User logs are being added to
 * @returns {Promise} - Create session and machine log
 */
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

/**
 * Add a new user
 *
 * @param {UserType} user - User to be added
 * @returns {Promise} - Add user
 */
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

// Optional includePassword for auth checks since schema set to hide password from select
async function getUser(email: string, includePassword: boolean = false)
{
    let query = userModel.findOne({email});
    if (includePassword)
    {
        query = query.select("+password");
    }
    return query;
}

export default {
    addUser,
    getUser,
};
