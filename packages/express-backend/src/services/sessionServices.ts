import sessionModel, {SessionType} from "../data/session";
import {PipelineStage, Types} from "mongoose";
import userModel from "../data/user";
import sessionLogModel from "../data/sessionLog";

/**
 * Gets list of all machines associated with a user
 *
 * @param {String} userId - The user associated id
 * @return {Promise} - List of user sessions
 */
function aggregateUserSession(userId: string)
{
    return [
        {$match: {_id: new Types.ObjectId(userId)}}, // Find user by email
        {
            //Attach all machineLogs as an array called collectedMachineLogs.
            $lookup: {
                from: "sessionLogs",
                localField: "sessionLogId",
                foreignField: "_id",
                as: "collectedSessionLogs",
            },
        },
        //Turn collectedMachineLogs from an array into multiple objects.
        {$unwind: "$collectedSessionLogs"},
        {
            //Attach all machines as an array called collectedMachines.
            $lookup: {
                from: "sessions",
                localField: "collectedSessionLogs.sessionIds",
                foreignField: "_id",
                as: "collectedSessions",
            },
        },
        //Turn collectedMachines from an array into multiple objects.
        {$unwind: "$collectedSessions"},
        {
            //renames "$collectedMachines.name" and "$collectedMachines.muscle" as top level fields called name and muscle.
            $project: {
                date: "$collectedSessions.date",
                time: "$collectedSessions.time",
                workout: "$collectedSessions.workout",
                _id: "$collectedSessions._id",
            },
        },
    ];
}

/**
 * Returns all user sessions
 *
 * @param {string} userId - User associated id
 * @returns {Promise} - All sessions
 */
function getAllSessions(userId: string)
{
    const listOfSessions: PipelineStage[] = aggregateUserSession(userId);
    return userModel.aggregate(listOfSessions);
}

/**
 * Adds a session
 *
 * @param {SessionType} session - Session to add
 * @param {string} userId - User associated id
 * @returns {Promise} - Session Added
 */
function addSession(
    session: SessionType,
    userId: string,
): Promise<SessionType>
{
    const sessionToAdd = new sessionModel(session);
    userModel
        .findOne({_id: userId})
        .then((user) =>
        {
            sessionLogModel
                .findOneAndUpdate(
                    {_id: user?.sessionLogId},
                    {$push: {sessionIds: sessionToAdd._id}}, //previously added session id.
                    {new: true},
                )
                .then((newLog) =>
                {
                    console.log(newLog);
                })
                .catch((error) =>
                {
                    console.log(error);
                });
        })
        .catch((error) =>
        {
            console.log(error);
        });
    return sessionToAdd.save();
}

/**
 * Gets a user session by id
 *
 * @param {string} userId - User associated id
 * @param {string} id - Id of session object
 * @returns {Promise} - Session object if found or Undefined
 */
function getSessionById(id: string, userId: string): Promise<SessionType[]>
{
    const listOfSessions: PipelineStage[] = aggregateUserSession(userId);
    listOfSessions.push({$match: {_id: new Types.ObjectId(id)}});
    return userModel.aggregate(listOfSessions);
}

/**
 * Gets most recent session with no time
 *
 * @param {string} userId - User associated id
 * @returns {Promise<SessionType[]>} - Gets the current session
 */
function getCurrentSession(userId: string): Promise<SessionType[]>
{
    const listOfSessions: PipelineStage[] = aggregateUserSession(userId);
    // Sort By Date And Get The Newest Session With No Time (Not Intialized)
    listOfSessions.push({
        $sort: {date: -1},
    });
    listOfSessions.push({
        $limit: 1,
    });
    listOfSessions.push({
        $match: {time: 0},
    });

    return userModel.aggregate(listOfSessions);
}

/**
 * updates the session with sessionId to session and returns the updated session.
 * @param sessionId
 * @param session
 * @returns
 */
function patchSession(
    sessionId: string,
    session: SessionType,
): Promise<SessionType | null>
{
    if (!sessionId)
    {
        throw new Error("No sessionId provided: " + sessionId);
    }
    if (!session)
    {
        throw new Error("No session provided: " + session);
    }
    return sessionModel.findByIdAndUpdate(sessionId, session, {
        new: true,
    });
}

/**
 * Ends a session
 *
 * @param {string} userId - User associated id
 * @param {string} id - Id of session to end
 * @returns {Promise} - Updates Duration Of Session Object
 */
async function endSession(id: string, userId: string)
{
    // Ensure session is owned by user
    const session = await getSessionById(id, userId);
    if (session.length == 0)
    {
        return null;
    }
    return sessionModel.findOneAndUpdate(
        {_id: id},
        [{$set: {time: {$subtract: ["$$NOW", "$date"]}}}],
        {new: true},
    );
}

/**
 * Delete a session by id
 *
 * @param {string} userId - User associated id
 * @param {string} id - ID of session to delete
 * @returns {Promise} - Removes Session Object
 */
async function deleteSession(id: string, userId: string)
{
    return getSessionById(id, userId)
        .then((session) =>
        {
            if (session.length === 0)
            {
                throw new Error("No session found");
            }

            return userModel.findOne({_id: userId});
        })
        .then((user) =>
        {
            return sessionLogModel.findOneAndUpdate(
                {_id: user?.sessionLogId},
                {$pull: {sessionIds: id}}, //previously added session id.
            );
        })
        .then(() =>
        {
            return sessionModel.findByIdAndDelete(id);
        })
        .catch((error) =>
        {
            console.log(error);
        });
}

/**
 * Verify User Owns A Session
 *
 * @param {string} userId - User associated id
 * @param {string} sessionId - Id of session
 * @return {Promise<boolean>} - User owns
 */
export async function verifyUserOwnSession(
    sessionId: string,
    userId: string,
): Promise<boolean>
{
    // Ensure session is owned by user
    const session = await getSessionById(sessionId, userId);
    console.log(session.length);
    if (session.length == 0)
    {
        return false;
    }
    return true;
}

export default {
    getAllSessions,
    addSession,
    deleteSession,
    endSession,
    getSessionById,
    getCurrentSession,
    patchSession,
};
