import sessionModel, {SessionType} from "../data/session";

/**
 * Returns all sessions
 *
 * @returns {Promise} - All sessions
 */
function getAllSessions()
{
    return sessionModel.find();
}

/**
 * Adds a session
 *
 * @param {SessionType} session - Session to add
 * @returns {Promise} - Session Added
 */
function addSession(session: SessionType)
{
    const sessionToAdd = new sessionModel(session);
    return sessionToAdd.save();
}

/**
 * Gets a session by id
 *
 * @param {String} id - Id of session object
 * @returns {Promise} - Session object if found or Undefined
 */
function getSessionById(id: string)
{
    return sessionModel.findById(id);
}

/**
 * Gets most recent session with no time
 *
 * @returns {Promise<SessionType[]>} - Gets the current session
 */
function getCurrentSession(): Promise<SessionType[]>
{
    return sessionModel.aggregate([
        {
            $sort: {date: -1},
        },
        {
            $limit: 1,
        },
        {
            $match: {time: 0},
        },
    ]);
}

/**
 * Ends a session
 *
 * @param {String} id - Id of session to end
 * @returns {Promise} - Updates Duration Of Session Object
 */
function endSession(id: string)
{
    return sessionModel.findOneAndUpdate(
        {_id: id},
        [{$set: {time: {$subtract: ["$$NOW", "$date"]}}}],
        {new: true},
    );
}

/**
 * Delete a session by id
 *
 * @param {String} id - ID of session to delete
 * @returns {Promise} - Removes Session Object
 */
function deleteSession(id: string)
{
    return sessionModel.findByIdAndDelete(id);
}

export default {
    getAllSessions,
    addSession,
    deleteSession,
    endSession,
    getSessionById,
    getCurrentSession,
};
