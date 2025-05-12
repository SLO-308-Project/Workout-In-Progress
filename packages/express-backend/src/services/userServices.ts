import machineLogModel from "../data/machineLog";
import userModel, {UserType} from "../data/user";
import sessionLogModel from "../data/sessionLog";
import templateListModel from "../data/templateList";

/**
 * Create logs for machines, sessions, and templates for a user
 *
 * @param {UserType} user - User logs are being added to
 * @returns {Promise} - Create session, machine, and template logs
 */
function createUserLogs(user: UserType)
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

    const createdTemplateLog = new templateListModel()
        .save()
        .then((result) =>
        {
            user.templateListId = result._id;
        })
        .catch((error) =>
        {
            console.log("create empty templateLog erorr: " + error);
            throw error;
        });
    return Promise.all(
        //returns a promise where all promises are complete.
        [
            //create sessionLog and update user.
            createdSessionLog,
            createdMachineLog,
            createdTemplateLog,
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
    return createUserLogs(user).then(() =>
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
