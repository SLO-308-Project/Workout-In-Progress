import sessionModel, {sessionType} from "../data/session";

// Returns all sessions
function getAllSessions()
{
    return sessionModel.find();
}

// Adds a session
function addSession(session: sessionType)
{
    const sessionToAdd = new sessionModel(session);
    return sessionToAdd.save();
}

// Get a session by _id
function getSessionById(id: string) {
    return sessionModel.findById(id);
}

// Get most recent session with no time
function getCurrentSession() {
    return sessionModel.aggregate([
        {
            $sort: {date: -1}
        },
        {
            $limit: 1
        },
        {
            $match: {time: 0}
        }
    ]);
}

// End a session
function endSession(id: string) 
{
    return sessionModel.findOneAndUpdate(
        { _id: id}, 
        [ { $set: { time: { $subtract: ["$$NOW", "$date" ] } } } ],
        { new: true }
    );
}

// Delete a session by _id
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
